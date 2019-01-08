---
layout: page
title: One liners
permalink: /one-liners/
---
To get the [LatestRestorableTime](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)  on a given RDS instances.

````python
➜  ~ aws rds describe-db-instances \
				 --db-instance-identifier="evox-dev" \
				 --query "DBInstances[*].[DBInstanceIdentifier,LatestRestorableTime]" --output text \
				| awk '{print $2}' | TZ='America/New_York' date
Thu Jul  5 10:51:02 EDT 2018
➜  ~ 
````
---

To fetch the `PR #100` and create a local branch named `TICKET100` on local env.

````python
git fetch upstream pull/100/head:TICKET100
````
---

To copy s3 files matching a certain pattern to another but excluding others. Use optional dryrun flag to make sure the operation going to be done is what your intend is.

````python
aws s3 cp s3://mybucket/reports/ s3://mybucket/reports/Archive/ --dryrun --exclude "*" --include "VER_Daily_Report_2016*"
````
