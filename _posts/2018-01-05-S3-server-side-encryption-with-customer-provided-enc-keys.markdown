---
layout: post
title:  "Server-Side Encryption with Customer-Provided Encryption Keys "
date:   2018-01-05 22:13:00
categories: s3, encryption 
---

Per AWS docs requirements for encryptions are:
https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerSideEncryptionCustomerKeys.html

##### 1. Generate your AES256 keys.

```
➜ cat testing
this is a test
➜ echo -n your-super-secret-phrase-string | openssl dgst -sha256 -binary > aes256.key    
```

##### 3. Encrypt and upload your file
```
➜ aws --profile=personal \
s3api put-object \
--bucket=shaytac-test \
--key=test2 \
--body=testing \
--sse-customer-algorithm=AES256 \
--sse-customer-key=fileb://aes256.key
```

##### 4. Decrypt and download your file
```
➜ aws --profile=personal \
s3api get-object \
--bucket=shaytac-test \
--key=test2  \
--sse-customer-algorithm=AES256 \
--sse-customer-key=fileb://aes256.key testing-downloaded
➜ cat testing-downloaded
this is a test
```

 

