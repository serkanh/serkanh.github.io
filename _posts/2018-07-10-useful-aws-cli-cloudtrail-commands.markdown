---
layout: post
title:  "Some useful cloudtrail commands i use often. "
date:   2018-07-10 15:51:00
categories: aws, clooudtrail, cli
---

[AWS Docs](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events-cli.html#attribute-lookup-example)

##### Get the last 10 actions done by IAM user.

````
➜  ~ aws cloudtrail lookup-events --lookup-attributes aws lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=username --max-items 10
````
##### Get the last 10 actions done by IAM role.
````
➜  ~ aws cloudtrail lookup-events --lookup-attributes aws lookup-events --lookup-attributes AttributeKey=ResourceName,AttributeValue=CloudTrail_CloudWatchLogs_Role  --max-items 10
````