---
layout: post
title:  "Quickstart with Vault"
date:   2015-10-20 15:40:56
categories: jekyll 
---
Vault is a secure storage server that secures, stores, passwords, tokens, API keys etc. It is the from Hashicorp which had some great products such as Vault, Terraform and i think the most popular of all Vagrant.
"Vault handles leasing, key revocation, key rolling, and auditing. I want to give a simple to follow setup example for anyone to try out this awesome tool. 



##### 1. Start the server
{% highlight bash %} 
vault server -config=vault.hcl 
{% endhighlight %} 
```
#vault.hcl
backend "file" {
  path="vault"
}

listener "tcp" {
  tls_disable = 1 
  address="127.0.0.1:8200"
}

disable_mlock = true
```
##### 2. Initiate vault and copy/save root token and the keys. **This is only done when initating a new server.*
```
VAULT_ADDR=http://127.0.0.1:8200 vault init 
```

##### 3. Authenticate with master token.
```
VAULT_ADDR=http://127.0.0.1:8200 vault auth <root-token>
```

##### 4. Unseal to add new authentication tokens. Default threshold is set to 3. Only root token can unseal the vault. Vault is sealed everytime it is restarted and has to be unsealed for services to acces
```
VAULT_ADDR=http://127.0.0.1:8200 vault unseal  
```

##### 5. Create a policy.
```
VAULT_ADDR=http://127.0.0.1:8200 vault policy-write secret acl.hcl
```

```
#acl.hcl
path "secret/*" {
  policy = "read"
}


path "auth/token/lookup-self" {
  policy = "read"
}
```
##### 6. Create a token that services will be using with the previously created policy. Token generated will be used for services so make a copy of it. 
```
VAULT_ADDR=http://127.0.0.1:8200 vault token-create -policy="secret"   
```

##### 7. While still in root and add new key/values
```
VAULT_ADDR=http://127.0.0.1:8200 vault write secret/AWS_SECRET_KEY value=<key goes here>
```

##### 8. Authenticate with service token that was generated on step 6 and read the key entered. 

