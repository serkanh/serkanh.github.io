---
layout: post
title:  "Search aws security groups for a given ip address."
date:   2018-09-28 10:40:00
categories: aws,cli 
---



##### For a given ip addres search the security groups that includes that ip address in their rules. 

````
➜  ~ aws ec2 describe-security-groups --query 'SecurityGroups[?IpPermissions[?contains(IpRanges[].CidrIp, `0.0.0.0/0`)]].{GroupId: GroupId, GroupName: GroupName}' --output text
sg-c632eeaf     default
sg-b632eedf     web

````