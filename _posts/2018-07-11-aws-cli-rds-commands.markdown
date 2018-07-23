---
layout: post
title:  "Useful aws cli rds  commands i use often. "
date:   2018-07-11 15:51:00
categories: aws, rds, cli 
---

#### Get the full attributes of rds instances with its instancesidentifier
````
aws --profile=HA rds describe-db-instances --query 'DBInstances[?DBInstanceIdentifier==`evox-dev`]'
````

#### Get list of snapshots of RDS database.
````
aws --profile=HA rds describe-db-snapshots --db-instance-identifier evox-dev

````


#### Get list of snapshots of RDS databse but only display snapshot id and creation time with jq.

````
aws --profile=HA rds describe-db-snapshots --db-instance-identifier evox-dev | jq '[.DBSnapshots[] | {Snapshot_Identifier:.DBSnapshotIdentifier,Creationtime:.SnapshotCreateTime}]'
````


#### Get the LatestRestorableTime that is typically within the range of 5 min of current time. 

```
aws --profile=HA rds  describe-db-instances --query 'DBInstances[?DBInstanceIdentifier==`evox-dev`].LatestRestorableTime'  --output text
```