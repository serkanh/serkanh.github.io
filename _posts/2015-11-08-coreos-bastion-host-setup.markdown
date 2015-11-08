---
layout: post
title:  "Bastion Host Setup for CoreOS"
date:   2015-11-07 14:14:56
categories: Coreos,ssh 
---

A common server access pattern is to prevent any connection to your production servers from outside of their private subnet, and use a bastion host to access the private subnet. This pattern is very
useful when you want to limit; for example ssh access, from only within the network. 

Typically you set up a bastion host, and execute a nc command to the destination host located within the private network. 



#####

```
#~/.ssh/config
Host bastion-host
        Hostname 54.54.54.54
        User ec2-user
        RequestTTY yes
        ForwardAgent yes
        IdentityFile ~/.ssh/id_rsa

Host destination-host
        Hostname 10.0.1.141
        port 22
        User core
        ProxyCommand ssh -A bastion-host nc %h %p


```

This works on most systems where netcat installed on both destination and bastion host.
Recently i have been working on a project to deploy a Mesosphere cluster with Cloudformation.
All the instances in the cluster were Coreos based so as usual i set up my config file with the bastion 
host pattern like above which suprisingly did not work. Turns out Coreos uses a newer implementation
of netcat which is called ncat. By modifying ProxyCommand lin on ~/.ssh/config file and change **nc** to **ncat**, i was able to 
ssh into hosts within private instances with ease.

```
#~/.ssh/config
Host bastion-host
        Hostname 54.54.54.54
        User ec2-user
        RequestTTY yes 
        ForwardAgent yes 
        IdentityFile ~/.ssh/id_rsa

Host destination-host
        Hostname 10.0.1.141
        port 22
        User core
        ProxyCommand ssh -A bastion-host ncat %h %p


```

