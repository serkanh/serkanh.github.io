---
layout: post
title:  "Encrypting files with rsa key pairs."
date:   2017-12-03 22:13:00
categories: ssh, encryption 
---
My day job i use ssh... alot. When you manage hundreds of servers with mission critical infastructure running on passswordless login with ssh keys can be huge time saver. I also take security pretty seriously when it comes to store sensitive information and always looking to find better ways to store sensitive information securely and also in  a convenient way for it to be not cumbersome. 
With that thought combining ssh keys to encrypt/decrypt files made quite sense so here is a quick write up to do it for anyone else that are interested in it.


##### 1. Create or open a file that you would like to encrypt.

```
➜  ~ echo "my super secret information" > secret.txt
➜  ~ cat secret.txt 
my super secret information
```
##### 2. If you havent already create a rsa key pair. If you would like to use existing rsa key pair skip this step and continue to step 3.
```
ssh-keygen
```

##### 3. Export your generated or existing public key to pem format. 
```
openssl rsa -in ~/.ssh/id_rsa -pubout > ~/id_rsa.pub.pem
```

##### 4. Now you are ready encrypt the file you created earliear. 
```
cat secret.txt  | openssl rsautl -encrypt -pubin -inkey ~/id_rsa.pub.pem > encrypted-secret.txt
cat encrypted-secret.txt 
????uG?????$?&?????VN?'?(????,þQaE咫:?i??t?(?jr.g?#?ջO???=*?e??<"?y'% 
```

##### 5. To decypt the secret 
```
➜  ~ cat encrypted-secret.txt  | openssl rsautl -decrypt -inkey ~/.ssh/id_rsa
my super secret information
```

 

