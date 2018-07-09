---
layout: post
title:  "TIL -AWS has a nice api endpoint to get its ip ranges. "
date:   2018-07-09 15:51:00
categories: aws, til, TIL, 
---


##### Not only you can query by service but also you can get notification of any changes to ip ranges by subscribing to SNS `AmazonIpSpaceChanged`. [source](https://docs.aws.amazon.com/general/latest/gr/aws-ip-ranges.html)

##### To get ec2 service ip ranges

````
>> curl -s https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '.prefixes[] | select(.service=="EC2") | .ip_prefix'

````
#### To select services in us-east-1 and us-west-2. This type of filtering might come handy when a service provider  who runs on AWS specifically mentions which regions they run their service on ie [circleci](https://discuss.circleci.com/t/circleci-ip-range/10759)

````
>> curl -s https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '.prefixes[] | select(select(.region=="us-east-1" or .region=="us-east-2" or .region=="us-west-1") and .service=="EC2") | .ip_prefix'
18.208.0.0/13
52.95.245.0/24
54.196.0.0/15
216.182.224.0/21
52.119.224.0/21
216.182.232.0/22
52.144.193.128/26
107.20.0.0/14
52.94.224.0/20
67.202.0.0/18
52.95.0.0/20
205.251.246.0/24
52.93.249.0/24
207.171.160.0/20
184.73.0.0/16
54.80.0.0/13
.
.
.

54.172.0.0/15
````

````
>>> curl -s https://ip-ranges.amazonaws.com/ip-ranges.json | jq -r '.prefixes[] | select(select(.region=="us-east-1" or .region=="us-east-2" or .region=="us-west-1" ) and .service=="EC2") | .ip_prefix+ " " +.region' ' 
18.208.0.0/13 us-east-1
52.95.245.0/24 us-east-1
54.196.0.0/15 us-east-1
54.241.0.0/16 us-west-1
184.169.128.0/17 us-west-1
216.182.224.0/21 us-east-1
216.182.232.0/22 us-east-1
54.193.0.0/16 us-west-1
107.20.0.0/14 us-east-1
67.202.0.0/18 us-east-1
184.73.0.0/16 us-east-1
54.80.0.0/13 us-east-1
.
.
.
54.172.0.0/15 us-east-1
````