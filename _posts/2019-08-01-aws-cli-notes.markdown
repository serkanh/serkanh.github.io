---
layout: post
title: "AWS CLI Notes"
date: 2019-08-01 7:40:00
categories: aws,cli,aws-cli
---

[cloudfront](#cloudfront) | [ec2](#ec2) | [ecr](#ecr) | [elb](#elb) | [ecs](#ecs) | [events](#events) [kms](#kms) | [sns](#sns) | [s3](#s3)

##### Cloudfront 

**Get cloudfront distribution url and origin as a table**

````
➜  notes git:(master) ✗ aws cloudfront list-distributions --query 'DistributionList.Items[*].{DomainName:Origins.Items[0].DomainName,Origins:Origins.Items[0].Id,CNAME:Aliases.Items[0]}' --output table

`````


##### Configure
**Create a named profile**
````
aws configure --profile=hdm-advantage
````

**Get access_key_id/access_key_secret vals based on profile**
```
aws configure get aws_access_key_id --profile=HA
aws configure get aws_secret_access_key --profile=HA

```

##### ECS
**Get scheduled events based on name**
````
aws --profile=jumpstart events list-rules --query 'Rules[?contains('Name',`jam`)==`true`].{Name:Name}'  --output text

````


**Kill all tasks within ecs cluster**
````
aws --profile=HA ecs list-tasks --cluster ContentPublishing_qa --query taskArns --output text \
| xargs -n1 -I{} \
| awk -F/ '{print $2}' \
| xargs -I{} aws ecs --profile=HA stop-task --cluster ContentPublishing_qa --task {}
````


**Get the env vars and values set on ECS task definition**
````
aws --profile=HA ecs describe-task-definition --task-definition arn:aws:ecs:us-east-1:174076265606:task-definition/preparation-h-generator-task-prod:81  --query 'taskDefinition.containerDefinitions[].environment' --output text 
GENERATOR_FINAL_DIR     /final-dir
REDIS_HOST      <redacted>
REDIS_PORT      6379
````


**Get the specific env var value in ECS task definition**

````
➜  notes git:(master) aws --profile=HA ecs describe-task-definition --task-definition arn:aws:ecs:us-east-1:174076265606:task-definition/preparation-h-generator-task-prod:81  --query 'taskDefinition.containerDefinitions[].environment[?name==`MONGODB`].value' --output text
````


**Get container instance arns**
```` 
aws --profile="jumpstart" ecs list-container-instances --cluster "dev" --query '[containerInstanceArns][0][*]' --output text | xargs -n1
arn:aws:ecs:us-east-1:<redacted>:container-instance/5beb75a3-00c8-409e-bf7f-205d6f03fefa
arn:aws:ecs:us-east-1:<redacted>:container-instance/5d2df610-c795-4c63-b723-8632cfbf728f
````

##### EC2 


**Get the list of ec2 instances by tag key/values**

````
 aws ec2 describe-instances --filters 'Name=tag-key,Values=Cluster,Name=tag-value, Values=["vault-two"]' --query 'Reservations[*].Instances[*].{Name:Tags[?Key==`Name`].Value[]}' --output text     
                                                                
NAME    kubeprod:vault-two:etcd
NAME    kubeprod:vault-two:etcd
NAME    kubeprod:vault-two:etcd
NAME    kubeprod:vault-two:etcd
NAME    kubeprod:vault-two:etcd
````

**Get decoded user-data from ec2 instances**
````
#/bin/bash
trap exit INT
INSTANCES=$( aws --profile=HA ec2 describe-instances --query 'Reservations[].Instances[].InstanceId[]' | sed -e 's/\[//g' -e 's/\]//g')
SUM=0
echo $INSTANCES
for i in $( echo $INSTANCES | sed -e 's/"//g' -e 's/,//g' -e 's/\[//g' -e 's/\]//g' ) ;do
	echo "---------------------------$i-------------------------------\n"
	 aws --profile=HA ec2 describe-instances --instance-ids $i --query 'Reservations[].Instances[].Tags[?Key==`Name`].Value' --output text 
	 aws --profile=HA ec2 describe-instance-attribute --instance-id $( echo $i |  sed -e 's/"//g'  -e 's/,//' -e 's/\[//g' -e 's/\]//g' ) --attribute userData \
	 	| jq '.UserData.Value' | sed 's/"//g' |  base64 --decode
	((SUM += 1))
	echo "\n"
done
echo "Total Number of Servers: $SUM"

````


**Delete all the snaphsots older than given data**

````
#!/bin/sh
snapshots_to_delete=($(aws ec2 --region='us-west-2' describe-snapshots --owner-ids <aws-account-id> --query 'Snapshots[?StartTime<=`2018-01-01`].SnapshotId' --output text))
echo "List of snapshots to delete: $snapshots_to_delete"

# actual deletion
for snap in $snapshots_to_delete; do
   aws ec2 --region=us-west-2 delete-snapshot --snapshot-id $snap
done

````

**Get public submnets on a given vpc**
````
aws --profile=$PROFILE ec2 describe-subnets \
					   --filters "Name=vpc-id,Values=$VPCID" \
					   --query "Subnets[?Tags != null && Tags[?contains(Value,\`Public\`)==\`true\`]].SubnetId" --output text
````

**Get public and private ips of given instances**
````
aws  ec2 describe-instances --instance-ids '["i-09487272fb11a4f90","i-0d111210e7ebd78bc"]' --query 'Reservations[*].Instances[*].NetworkInterfaces[*].PrivateIpAddresses[0]'              
[
    [
        [
            {
                "Association": {
                    "IpOwnerId": "amazon",
                    "PublicDnsName": "<redacted>.compute-1.amazonaws.com",
                    "PublicIp": "<redacted>"
                },
                "Primary": true,
                "PrivateDnsName": "<redacted>.ec2.internal",
                "PrivateIpAddress": "192.168.12.6"
            }
        ]
    ],
...
````

#### ECR 
**Sort ecr images by push date and get the latest**
````
aws --profile=jumpstart ecr describe-images --repository-name lead-front-door \ 
    --query 'sort_by(imageDetails,& imagePushedAt)[-1].imageTags[0]' --output text
````


#### ELB
**Create an elb**
````
aws --profile=$PROFILE elb create-load-balancer \
		--load-balancer-name $ELB_NAME \
	    --listeners "Protocol=HTTP,LoadBalancerPort=$ELBPORT,InstanceProtocol=HTTP,InstancePort=$INSTANCEPORT" \
		--subnets $PUBLIC_SUBNETS \
		--security-groups sg-8c2d57f6 
````

#### Events
**list targets by events**
````
 aws  events list-targets-by-rule --rule "prod-email-appraisal-lambda-schedule"
{
    "Targets": [
        {
            "Id": "terraform-20190827182914938000000001",
            "Arn": "arn:aws:lambda:us-east-1:<redacted>:function:prod-email-appraisal-lead-sweep"
        }
    ]
}
````
**list rules by target**
````
## Get scheduled tasks on ecs clusters

 aws --profile=jumpstart events list-rule-names-by-target --target arn:aws:ecs:us-east-1:<redacted>:cluster/production
{
    "RuleNames": [
        "jam-tools-dps-production-2909-sync-AdUnit",
        "jam-tools-dps-production-2909-sync-AudienceSegment",
        "jam-tools-dps-production-2909-sync-CustomTargetingKey",
        "jam-tools-dps-production-2909-sync-CustomTargetingValue",
        "jam-tools-dps-production-2909-sync-Placement",
        "jam-tools-dps-production-3611-sync-AdUnit",
        "jam-tools-dps-production-3611-sync-AudienceSegment",
        "jam-tools-dps-production-3611-sync-Buyer",
        "jam-tools-dps-production-3611-sync-Company",
        "jam-tools-dps-production-3611-sync-Creative",
}

````


#### KMS 
**Encrypt/Descrypt text** \
[Using aws kms to encrypt/decrpt](https://www.youtube.com/watch?v=R5-_eu_9cLM) 
````
#encrypt text
aws --profile=jumpstart kms encrypt \
    --key-id <YOUR-KEY-ID> \
    --plaintext fileb://test \
    --query CiphertextBlob \
    --output text | base64 --decode > testencrypted.txt
    
#decrypt text
aws --profile=jumpstart kms decrypt \
    --ciphertext-blob fileb://testencrypted.txt \
    --query Plaintext --output text | base64 --decode
````


#### SNS
**List subscriptions**
````
aws --profile=HA sns list-subscriptions --query 'Subscriptions[*]|[?contains(Protocol,`lambda`)==`false`]|[?contains(Endpoint,`bark`)==`true`]|[?contains(Endpoint,`stg`)==`true`]|[?contains(TopicArn,`d6cbe`)==`false`].{TopicArn:TopicArn}' --output text 
arn:aws:sns:us-east-1:<redacted>:<redacted>
arn:aws:sns:us-east-1:<redacted>:<redacted>
````


#### S3

**Server Side encryption with customer provided encryption keys** \
Per AWS docs requirements for encryptions are:
https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerSideEncryptionCustomerKeys.html

##### 1. Generate your AES256 keys.

```
➜ cat testing
this is a test
➜ echo -n your-super-secret-phrase-string | openssl dgst -sha256 -binary > aes256.key    
```

##### 3. Encrypt and upload your file
```
➜ aws --profile=personal \
s3api put-object \
--bucket=shaytac-test \
--key=test2 \
--body=testing \
--sse-customer-algorithm=AES256 \
--sse-customer-key=fileb://aes256.key
```

##### 4. Decrypt and download your file
```
➜ aws --profile=personal \
s3api get-object \
--bucket=shaytac-test \
--key=test2  \
--sse-customer-algorithm=AES256 \
--sse-customer-key=fileb://aes256.key testing-downloaded
➜ cat testing-downloaded
this is a test
```

#### VPC
**Get vpc names**
````
aws --profile=HA ec2 describe-vpcs --query "Vpcs[*].Tags[].Value" --output text
<redacted> vpc   <redacted> vpc
````
