---
layout: post
title:  "Setting up SQS as event source with serverless and cloudformation. "
date:   2018-06-30 22:33:00
categories: aws, lambda, serverless
---


##### AWS recently announced SQS as an event source for lambda functions. This is now GA and looks like there is already a [pr](https://github.com/serverless/serverless/pull/5074) for it to to be soon implemened in [serverless framework](https://serverless.com/) as well. 

##### As soon as it was announced we had a use case for this implementation in a project that we built with serverless framework. So instead of waiting pr to be merged  i decided to impletemented via cloudformation. 

##### Below is the `serverless.yml` file with its entirety. Cloudformation creates a sqs and and EventSourceMapping for the function `supervisor`. 
````


service: cd-evox

provider:
  name: aws
  runtime:  nodejs8.10
  iamRoleStatements:
    - Effect: 'Allow'
      Action:
        - "lambda:InvokeFunction"
        - "lambda:InvokeAsync"
        - "sqs:ReceiveMessage"
        - "sqs:DeleteMessage"
        - "sqs:GetQueueAttributes"
      Resource: "*"




functions:
  supervisor:
    handler: lambdas.supervisor


# Create Sqs Queue
resources:
  Resources:
    mapping:
      Type: AWS::Lambda::EventSourceMapping
      Properties:
        EventSourceArn:
          Fn::GetAtt:
            - CdEvoxQueue
            - Arn
        FunctionName:
          Fn::GetAtt:
            - SupervisorLambdaFunction
            - Arn
    CdEvoxQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: cd_evox_${opt:stage}
        MessageRetentionPeriod: '1209600'
        VisibilityTimeout: '60'

````

![Screenshot](/images/sqs-as-eventsource.png)


Maximum batch size currently supported is between 1-10 so if you define a  batch size higher than 10 you will receive the error message:
``` An error occurred: mapping - Maximum batch size must be between 1 and 10 inclusive (Service: AWSLambda; Status Code: 400; Error Code: InvalidParameterValueException; Request ID: a03c1359-7cd5-11e8-8e95-8fcb11ee2f63).```