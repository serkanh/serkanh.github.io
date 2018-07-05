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
