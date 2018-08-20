---
layout: post
title:  "Useful EC2 cli commands. "
date:   2018-08-20 11:40:00
categories: aws, ec2, cli 
---

[AWS Docs](https://docs.aws.amazon.com/cli/latest/userguide/controlling-output.html)

##### Get the internal ip address of ec2 instances that are on Windows platform.
````
➜  ~ aws ec2 describe-instances --filters "Name=platform,Values=windows" "Name=instance-state-name,Values=running" --query 'Reservations[*].Instances[*].[InstanceId, PrivateIpAddress,PublicIpAdress]' --output table --region us-east-1 
-------------------------------------------
|            DescribeInstances            |
+----------------------+------------------+
|  i-7a644a55          |  192.168.43.26   |
|  i-24d62cdc          |  192.168.43.80   |
|  i-8f0ff908          |  10.0.4.35       |
|  i-7eb3a95e          |  10.0.1.115      |
|  i-6b612644          |  192.168.43.75   |
|  i-071708d7          |  10.0.4.31       |
|  i-8f2e57a0          |  192.168.43.69   |
|  i-8a273eaa          |  10.0.2.136      |
|  i-0ac96c4d095cee4d4 |  10.0.1.251      |
|  i-729a4a51          |  10.0.2.156      |
|  i-68349581          |  10.0.5.89       |
|  i-fe8e69dd          |  10.0.2.179      |
|  i-91d87eb2          |  10.0.1.30       |
|  i-988cf1b7          |  192.168.43.43   |
|  i-52011b72          |  10.0.2.203      |
|  i-1fb75cc9          |  10.0.1.254      |
|  i-bb044044          |  192.168.33.20   |
|  i-960e75b9          |  192.168.43.62   |
|  i-88b493a7          |  192.168.43.117  |
|  i-6a573485          |  10.0.3.140      |
|  i-462217c2          |  10.0.4.96       |
|  i-adf5267b          |  10.0.1.17       |
+----------------------+------------------+
````


##### Get both public and private ip address of ec2 instances that are on Windows platform.
````
➜  ~ aws ec2 describe-instances --filters "Name=platform,Values=windows" "Name=instance-state-name,Values=running" --query 'Reservations[*].Instances[*].[InstanceId, PrivateIpAddress,PublicIpAdress]' --output table --region us-east-1 
````