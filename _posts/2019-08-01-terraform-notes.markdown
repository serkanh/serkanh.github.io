---
layout: post
title: "Terraform Notes"
date: 2019-08-01 7:40:00
categories: terraform,circleci
---

[github search](https://github.com/search?q=redis+extension%3Atf)


* **Check if value is set if not get it from remote state**

`DB_HOST             = "${var.DB_HOST != "" ? var.DB_HOST : data.terraform_remote_state.rds.outputs.write_encrypted_cname.fqdn}"`


* **Merge 2 objects to single one.**

````
merge(local.comman_lt_settings,{ ECS_CLUSTER = "oddjobs-${local.env}", app = "oddjobs" }))
````


* **To iterate over lists with for_each**

https://blog.gruntwork.io/terraform-tips-tricks-loops-if-statements-and-gotchas-f739bbae55f9
````
locals {
    sqs-queues = ["ccpa-dmd-finanace","ccpa-dmd-devops","ccpa-dmd-mst"]
}


resource "aws_sqs_queue" "sqs_queue" {
  for_each                  = toset(local.sqs-queues)
  name                      = "c51-${var.env}-${each.value}"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
   tags = {
    Name = "c51-${var.env}-${each.value}"
    env  = "${var.env}"
  }
}
````

* **cidr subnet function**
https://tidalmigrations.com/subnet-builder/

````
terraform console 
>cidrsubnet("10.226.0.0/20", 4, 2)
10.226.2.0/24
> cidrsubnet("10.226.0.0/20", 4, 3)
10.226.3.0/24
> cidrsubnet("10.226.0.0/20", 4, 4)
10.226.4.0/24
> cidrsubnet("10.226.0.0/20", 3, 4)
10.226.8.0/23
> cidrsubnet("10.226.0.0/20", 3, 1)
10.226.2.0/23
> cidrsubnet("10.226.0.0/20", 3, 2)
10.226.4.0/23
> cidrsubnet("10.226.0.0/20", 3, 4)
10.226.8.0/23
> cidrsubnet("10.226.0.0/18", 4, 8)
10.226.32.0/22
> cidrsubnet("10.226.0.0/18", 4, 1)
...
10.226.60.0/22
> cidrsubnet("10.226.0.0/18", 4, 16)

#produces 32 ip blocks with 512 ips each
> cidrsubnet("10.226.0.0/18", 5, 0)
10.226.0.0/23


````

* **look up syntax for 0.11**

````
my_var = [
  {
    key1 = "value1"
    key2 = "value2"
    key3 = "value3"
  },
  {
    key1 = "value11"
    key2 = "value22"
    key3 = "value33"
  },
  {
    key1 = "value111"
    key2 = "value222"
    key3 = "value333"
  },
]

output "test" {
  value = "${lookup(local.my_var[0], "key1")}"
}
Outputs:
test = value1
````
* **look up syntax for 0.12**

````
my_var = [
  {
    key1 = "value1"
    key2 = "value2"
    key3 = "value3"
  },
  {
    key1 = "value11"
    key2 = "value22"
    key3 = "value33"
  },
  {
    key1 = "value111"
    key2 = "value222"
    key3 = "value333"
  },
]

output "test" {
  value = local.my_var[1].key1
}
Outputs:
test = value1
````


* **Iterating through nested blocks**

````
  ecs-clusters = {
    webapp = {
      task-definition       = templatefile("${path.module}/webapp-task-definition.json", { env = "dev" })
      service_desired_count = 1
      is_internal_alb       = false
      public_subnet_ids     = local.public_subnet_ids
      alb_ingress_ports     = [80,443] <-- To iterate over this list
    }
  }


resource "aws_security_group" "alb" {
  for_each    = var.ecs-clusters
  name        = "${each.key}-${var.env}"
  description = "${each.key}-${var.env}"
  vpc_id      = var.vpc-id

  egress {
    description = "all"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
  dynamic "ingress" {
   for_each = [for ip in each.value.alb_ingress_ports: {
      from_port  = ip
      to_port = ip
      protocol = "tcp"
    }]
   content {
         from_port = ingress.value.from_port
         to_port = ingress.value.to_port
         protocol = ingress.value.protocol
     }
  }

  tags = {
    Name = "${each.key}-${var.env}"
    env = "${var.env}"
  }

}
````



* **To upgrade terraform providers' versions to latest**

`terraform init --upgrade` 

* **Show the state list**

````
(base) ➜  vpc git:(dev) ✗ terraform state list                                                       
data.http.executor_ip
module.dev-vpc.data.aws_ami.ubuntu
module.dev-vpc.data.aws_secretsmanager_secret.vpc
module.dev-vpc.data.aws_secretsmanager_secret_version.falconid
module.dev-vpc.aws_eip.eip["us-west-2a"]
module.dev-vpc.aws_instance.bastion["bastion1"]
module.dev-vpc.aws_internet_gateway.igw
module.dev-vpc.aws_nat_gateway.natgateway["us-west-2a"]
module.dev-vpc.aws_route_table.private["us-west-2a"]
module.dev-vpc.aws_route_table.public
module.dev-vpc.aws_route_table_association.private["us-west-2a"]
module.dev-vpc.aws_route_table_association.public["us-west-2a"]
module.dev-vpc.aws_security_group.bastion-sg
module.dev-vpc.aws_subnet.private["us-west-2a"]
module.dev-vpc.aws_subnet.private["us-west-2b"]
module.dev-vpc.aws_subnet.public["us-west-2a"]
module.dev-vpc.aws_vpc.main
````

* **Remove specific state of instance that is created by foreach**

````
(base) ➜  vpc git:(dev) ✗ terraform state rm 'module.dev-vpc.aws_subnet.private["us-west-2b"]'
Acquiring state lock. This may take a few moments...
Removed module.dev-vpc.aws_subnet.private["us-west-2b"]
Successfully removed 1 resource instance(s).
Releasing state lock. This may take a few moments...
````


* **Show remote state of a specific instance created by `for_each` **

````
(base) ➜  vpc git:(dev) ✗ terraform state show 'module.dev-vpc.aws_nat_gateway.natgateway["us-west-2a"]'
# module.dev-vpc.aws_nat_gateway.natgateway["us-west-2a"]:
resource "aws_nat_gateway" "natgateway" {
    allocation_id        = "eipalloc-07a54166dc3895130"
    id                   = "nat-0162ae2d0ed022fa1"
    network_interface_id = "eni-0d4a03b3aa3bee379"
    private_ip           = "10.227.115.245"
    public_ip            = "44.229.139.157"
    subnet_id            = "subnet-0edd61ecfe793c4f5"
    tags                 = {
        "Name" = "c51-dev-nat-us-west-2a"
        "env"  = "c51-dev"
    }
}
````

* **Testing template rendering with `templatefile` function
Given the template file is in a module, go into main section where module is called from and start the console with `terraform console`
Give the relative path of the file

````
> templatefile("../../../modules/vpc/bastion-host-userdata.tmpl", { falcon-cid="test" })
#!/bin/bash 

# Install the AWS command-line tools
sudo yum install -y aws-cli

# Install CrowdStrike
sudo mkdir /home/ec2-user/falcon-sensor
cd /home/ec2-user/falcon-sensor
aws s3 cp s3://c51-falcon-sensor/falcon-sensor-4.25.0-7103.amzn2.x86_64.rpm .
sudo yum install -y falcon-sensor-4.25.0-7103.amzn2.x86_64.rpm

# Set crowdstrike cid
sudo /opt/CrowdStrike/falconctl -s --cid=test
sudo /opt/CrowdStrike/falconctl -s --feature=enableLog,disableLogBuffer --update # enable logging
sudo service falcon-sensor start

>  
````

* **To use AWS Secret manager for secrets** 

```
~ cat ~/vcp.tf

data "aws_secretsmanager_secret" "vpc" {
  name = "c51-dev/vpc/"
}
data "aws_secretsmanager_secret_version" "vpc" {
  secret_id = "${data.aws_secretsmanager_secret.vpc.id}"
}

~ cat ~/output.tf
output "c51-dev-vpc-secrets" {
  value = data.aws_secretsmanager_secret_version.vpc.secret_string
}

returns an json string 
falcon-cid = {"falcon-cid":"blahblah"}

```


* **To pull\push the terraform state file to local env**

````
terraform state pull > state_file_from_s3.json
terraform state push -file <file>
````

* **Conditional ternary syntax** 

````
variable "enable_autoscaling" { 
  description = "If set to true, enable auto scaling" 
  type = bool 
}

resource "aws_autoscaling_schedule" "scale_out_during_business_hours" { 
  count = var.enable_autoscaling ? 1 : 0
  ...
}

module "webserver_cluster" { 
  source = "../../../../modules/services/webserver-cluster" cluster_name = "webservers-stage" 
  db_remote_state_bucket = "( YOUR_BUCKET_NAME)" 
  db_remote_state_key = "stage/ data-stores/ mysql/ terraform.tfstate" 
  instance_type = "t2. micro" 
  min_size = 2 
  max_size = 2 
  **enable_autoscaling = false**
}
````

* **For loops with expressions** 

````
variable "names" { 
  description = "A list of names" type = list( string) default = [" neo", "trinity", "morpheus"] 
} 
output "upper_names" { 
  value = [for name in var.names : upper(name)] 
}
Outputs: upper_names = [ "NEO", "TRINITY", "MORPHEUS", ]
````


* **Array look up syntax**

````
variable "user_names" { 
  description = "Create IAM users with these names" 
  type = list(string) 
  default = [" neo", "trinity", "morpheus"] }
  
resource "aws_iam_user" "example" { 
 count = length( var.user_names) 
 name = var.user_names[count.index] 
}

output "neo_arn" { 
  value = aws_iam_user.example[0]. arn description = "The ARN for user Neo" 
}

output "all_arns" { 
  value = aws_iam_user.example[*]. arn description = "The ARNs for all users" 
}
````
* **To index resources** 

````
resource "aws_iam_user" "example" { 
  count = 3 name = "neo. ${count.index}" 
}

````

* **To reference modules values**

````
module "redis-cluster" {
  source         = "github.com/terraform-community-modules/tf_aws_elasticache_redis?ref=v1.3.0"
  env            = "${var.environment_identifier}"
  name           = "${var.project_prefix}-cluster"
  redis_clusters = "2"
  redis_failover = "true"
  subnets        = ["${aws_subnet.private_subnet_primary.id}", "${aws_subnet.private_subnet_secondary.id}"]
  vpc_id         = "${aws_vpc.vpc_primary.id}"
}

#need to use output
output "endpoint" {
  value = "${module.redis-cluster.endpoint}"
}

#and finally when referencing the values
    {
      "name": "REDIS_ENDPOINT",
      "value": "tcp://${module.redis-cluster.endpoint}:6379"
    },

#Then use `terraform output` to see if it is working

./tf-env blackbook-dev output
...
chrome_data_bucket.arn = arn:aws:s3:::<reducted>.<reducted>.us-east-1
ecs_service_role.arn = arn:aws:iam::<reducted>:role/dev-ld-ecs-service-role.us-east-1
dev-ld-base-alb/<reducted>/79c73dc7899db9a8
redis-cluster-endpoint = <reducted>
...

````

* **To ignore changes of an attribute object key.** 

````
resource "aws_cognito_user_pool" "test-pool" {
  name = "test"
  admin_create_user_config {
    allow_admin_create_user_only = true
    unused_account_validity_days = 10
  }
	lifecycle {
    ignore_changes = [
      "admin_create_user_config[0].unused_account_validity_days"
    ]
  }
}
````

* **To test the output**

````
➜ terraform console
> aws_cognito_user_pool.test-pool.name
test
> aws_cognito_user_pool.test-pool.admin_create_user_config
[
  {
    "allow_admin_create_user_only" = true
    "invite_message_template" = []
    "unused_account_validity_days" = 90
  },
]
````

* **Get the public ip address of where the execution is being done from and add it sg's ingress rules.**

````
data "http" "myip" {
  url = "http://ipv4.icanhazip.com"
}


ingress {
  from_port = 5432
  to_port = 5432
  protocol = "tcp"
  cidr_blocks = ["${chomp(data.http.myip.body)}/32"]
}
````


* **To taint module resources.Useful when you want to recreate resources**

 `terraform taint -module=salt_master aws_instance.salt_master`  
 
 ````
 ./tf-env blackbook-dev taint -module=redis-cluster aws_elasticache_replication_group.redis 
 
 ````
 
 
 * **Circleci terraform example to create resources in GCP**

 ````
version: 2

#Default configurations
terraform: &terraform
  docker:
    - image: hashicorp/terraform:0.11.13

jobs:
#Application related jobs are below
  checkout:
    <<: *terraform
    steps:
      - attach_workspace:
          at: /tmp/workspace
      - checkout
      - run:
          name: Validate Terraform Formatting
          command: "[ -z \"$(terraform fmt -write=false)\" ] || { terraform fmt -write=false -diff; exit 1; }"
      - persist_to_workspace:
          root: .
          paths: .

#Infrastructure related jobs are below
  validate_infrastructure:
    <<: *terraform
    working_directory: /tmp/workspace
    steps:
      - attach_workspace:
          at: /tmp/workspace
      - run:
          name: Add github.com to ~/.ssh/known_hosts
          command: mkdir ~/.ssh && ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
      - run:
          name: create service-account-keys folder
          command: |
             mkdir -p /tmp/workspace/service-account-keys/
      - run:
          name: extract google credentials
          command: |
             echo "$GOOGLE_SERVICE_KEY" | base64 -d  > "/tmp/workspace/service-account-keys/service-key.json"
      - run:
          name: Set terraform plugins directory
          command: echo -e "plugin_cache_dir = \"$HOME/.terraform.d/plugin-cache\"\ndisable_checkpoint = true" > ~/.terraformrc
      - run:
          name: terraform init
          command: export "GOOGLE_APPLICATION_CREDENTIALS=/tmp/workspace/service-account-keys/service-key.json" && terraform init -input=false
      - run:
          name: Check if Terraform configurations are properly formatted
          command: if [[ -n "$(terraform fmt -write=false)" ]]; then echo "Some terraform files need be formatted, run 'terraform fmt' to fix"; exit 1; fi
      - persist_to_workspace:
          root: .
          paths:
            - service-account-keys
  plan_infrastructure:
    <<: *terraform
    working_directory: /tmp/workspace
    steps:
      - attach_workspace:
          at: /tmp/workspace
      - run:
          name: Add github.com to ~/.ssh/known_hosts
          command: mkdir ~/.ssh && ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
      - run:
          name: terraform init && plan
          command: |
            export "GOOGLE_APPLICATION_CREDENTIALS=/tmp/workspace/service-account-keys/service-key.json" && \
            terraform init -input=false && \
            terraform plan -input=false -out=tfplan -lock=false
      - persist_to_workspace:
          root: .
          paths:
            - .terraform # persist this to be able to apply execution plan without running init once more
            - tfplan

  apply_infrastructure:
    <<: *terraform
    working_directory: /tmp/workspace
    steps:
      - attach_workspace:
          at: /tmp/workspace
      - run:
          name: terraform apply
          command: export "GOOGLE_APPLICATION_CREDENTIALS=/tmp/workspace/service-account-keys/service-key.json" && terraform apply -input=false -lock=false tfplan

master_workflow_filters: &master_workflow_filters
  filters:
    branches:
      only:
        - master
        - IMDB-4509
workflows:
  version: 2
  test-build-plan-apply:
    jobs:
      - checkout
      - validate_infrastructure:
          requires:
            - checkout
      - plan_infrastructure:
          requires:
            - validate_infrastructure
      - approve_infrastructure:
          <<: *master_workflow_filters
          type: approval
          requires:
            - plan_infrastructure
      - apply_infrastructure:
          <<: *master_workflow_filters
          requires:
            - approve_infrastructure
````