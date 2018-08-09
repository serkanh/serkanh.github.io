---
layout: post
title:  "Multi stage api gateway deployment with serverless framework."
date:   2018-08-06 15:51:00
categories: aws, lambda, serverless,cloudformation
---

Both serverless framework and api gateway has the concept of stages. 

We will build a serverless application with api gateway and deploy it to multiple stages. What this means is that `dev` lambda functions will be associated with the api gateways `/dev/` stage and prod with `prod` stage. 

First we start by setting up multiple stages for our lambda functions. To keep it simple we will simply set different environment variables per lambda function stage. Function basically will read from the env var and return its value as a string. We will deploy to different stages with serverless' `--stage` flag. 

You can follow this steps by cloning  serverless-api-gateway-multi-stage-demo repo and checkout corresponding steps.


## Step1
If you cloned the repo checkout `step1` and issue `sls` commands as directed below in the specified order.

````

service: serverless-api-gateway-multi-stage-demo

## This is where we setup env variables that will be set for different stages of lambda functions.
custom:
  dev_APP_STAGE: 'DEV STAGE'
  prod_APP_STAGE: 'PROD STAGE'
provider:
  name: aws
  runtime: nodejs8.10
  environment:
    APP_STAGE: ${self:custom.${opt:stage, self:provider.stage}_APP_STAGE}
functions:
  hello:
    handler: handler.hello

````

and deploy to both `dev` and `prod` stages

````
sls deploy --stage=dev
sls deploy --stage=prod
````

if you are using aws profiles you can deploy by specifiying the aws profile you'd like to use `sls --aws-profile=<aws-personal-profile> deploy --stage=dev`

When you invoke the function on both envs, it should simply return the env name a string.

````
➜  serverless-api-gateway-multi-stage-demo git:(master) ✗ sls invoke -f hello --stage=dev
{
    "statusCode": 200,
    "body": "{\"message\":\"Current lambda function env DEV STAGE\",\"input\":{}}"
}

````

````
➜  serverless-api-gateway-multi-stage-demo git:(master) ✗ sls invoke -f hello --stage=prod
{
    "statusCode": 200,
    "body": "{\"message\":\"Current lambda function env PROD STAGE\",\"input\":{}}"
}

````


Now we want to create a openapi(swagger) file to define paths for our api. Also we will add api gateway stages, deployment and associated stage variables for api gateway.

One gotcha of this setup is that we need to give permissions to api gateway to execute each individual function based on env. This is because we are using lambda functions stage name as a api gateway stage variable.

````
swagger: "2.0"
schemes:
- "https"
paths:
  /:
    get:
      produces:
      - "application/json"
      responses:
        200:
          description: "200 response"
          schema:
            $ref: "#/definitions/Empty"
      x-amazon-apigateway-integration:
        uri: "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:174076265606:function:serverless-multistage-${stageVariables.Stage}-hello/invocations"
        responses:
          default:
            statusCode: "200"
        passthroughBehavior: "when_no_match"
        httpMethod: "POST"
        contentHandling: "CONVERT_TO_TEXT"
        type: "aws"
definitions:
  Empty:
    type: "object"
    title: "Empty Schema"
````

We will include the swagger file in our serverless.yml. One gotcha of using api gateway stage variables in serverless is that both serverless and api gateway and serverless framework is using the same syntax to refer to variables. In order to get around this we will use custom variable syntax so serverless does not interpret this as a serverless variable.

````
//serverless.yml
provider:
  name: aws
  runtime: nodejs8.10
  environment:
    APP_STAGE: ${self:custom.${opt:stage, self:provider.stage}_APP_STAGE}
  variableSyntax: "\\${((?!stageVariables)[ ~:a-zA-Z0-9._'\",\\-\\/\\(\\)]+?)}"
````

````
//swagger.yml
 x-amazon-apigateway-integration:
        uri: "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:174076265606:function:serverless-multistage-${stageVariables.Stage}-hello/invocations"
````
Give api-gateway execute perm on dev hello function 
````

aws lambda add-permission    --function-name "arn:aws:lambda:us-east-1:174076265606:function:serverless-multistage-dev-hello"    --source-arn "arn:aws:execute-api:us-east-1:174076265606:rci6d8tuc7/*/GET/"   --principal apigateway.amazonaws.com    --statement-id 8513374b-509d-4cfc-920c-c69e72264c7a    --action lambda:InvokeFunction

````

Give api-gateway execute perm on prod  hello function 
````
aws lambda add-permission    --function-name "arn:aws:lambda:us-east-1:174076265606:function:serverless-multistage-prod-hello"    --source-arn "arn:aws:execute-api:us-east-1:174076265606:rci6d8tuc7/*/GET/"   --principal apigateway.amazonaws.com    --statement-id 8513374b-509d-4cfc-920c-c69e72264c7a    --action lambda:InvokeFunction

````


Final `serverless.yml` should look like below. 

````


service: serverless-multistage

##### This is where we setup env variables that will be set for different stages of lambda functions.
custom:
  dev_APP_STAGE: 'DEV STAGE'
  prod_APP_STAGE: 'PROD STAGE'


provider:
  name: aws
  runtime: nodejs8.10
  environment:
    APP_STAGE: ${self:custom.${opt:stage, self:provider.stage}_APP_STAGE}
  variableSyntax: "\\${((?!stageVariables)[ ~:a-zA-Z0-9._'\",\\-\\/\\(\\)]+?)}"
resources:
  Resources:
    ApiGatewayRestApi:
      Type: AWS::ApiGateway::RestApi
      Properties:
        Name: ${self:service}
        Body: ${file(swagger.yml)}
    ApiGatewayDeploymentDev:
      Type: AWS::ApiGateway::Deployment
      Properties:
        RestApiId:
          Ref: ApiGatewayRestApi
        Description: 'Dev deployment'

    
    ApiGatewayDeploymentProd:
      Type: AWS::ApiGateway::Deployment
      Properties:
        RestApiId:
          Ref: ApiGatewayRestApi
        Description: 'Prod Deployment'

    ApiGatewayStageDev:
        Type: 'AWS::ApiGateway::Stage'
        Properties:
          StageName: dev
          Description: Dev Stage
          RestApiId: 
            Ref: ApiGatewayRestApi
          DeploymentId: 
            Ref: ApiGatewayDeploymentDev
          Variables:
            "Stage": "dev"
    ApiGatewayStageProd:
        Type: 'AWS::ApiGateway::Stage'
        Properties:
          StageName: prod
          Description: Prod Stage
          RestApiId: 
            Ref: ApiGatewayRestApi
          DeploymentId: 
            Ref: ApiGatewayDeploymentProd
          Variables:
            "Stage": "prod"

functions:
  hello:
    handler: handler.hello


````

To test the `dev` and `prod` functionality in api gateway simply go into api gateway console ->
 Resources -> Get method 

 ![Screenshot](/images/lambda-integration-req1.png)

 Test -> Enter dev into `Stage` stage variable.

  ![dev stage var](/images/dev-test.png)

 Test -> Enter prod into `Stage` stage variable.

  ![prod stage var](/images/prod-test.png)