---
layout: post
title: "Terrform Notes"
date: 2019-08-01 7:40:00
categories: terraform,circleci
---


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