---
layout: post
title:  "Filter and delete s3 objects by date."
date:   2018-10-09 10:40:00
categories: aws,cli,s3
---



##### Filter and delete aws s3 object. 

````
➜  ~ aws s3api list-objects --bucket fake-bucket --query 'Contents[?LastModified>=`2018-10-04` ].{Key:Key}' --prefix "2018-10-04" --output text |  xargs -I {} aws  s3 rm s3://fake-bucket/{}                                                                                           
delete: s3://fake-bucket/2018-10-04T19:00-0zdoEmH9Mp7Y897MGMIy.log
delete: s3://fake-bucket/2018-10-04T19:00-16FZUUHHZZkWisbJhyn2.log
delete: s3://fake-bucket/2018-10-04T19:00-3Uw2gy2OyjgkMvhStPfE.log

````