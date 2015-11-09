---
layout: post
title:  "OpenVpn Setup with Docker"
date:   2015-10-20 15:40:56
categories: vpn, docker
---




##### 1. Create an fqdn 

I am using AWS Route53 for this step so when you login create an A record(assuming you are pointing to an ip.) for your vpn. Assuming your domain name is mydomain.com, create something like vpn.yourdomain.com


##### 2. Create a data container.

``` export OVPN_DATA="ovpn-data"``` <br /><br />
``` docker run -name $OVPN_DATA -v /etc/openvpn busybox``` 



##### 3. Generate vpn config file based on fqdn.

``` docker run --volumes-from $OVPN_DATA --rm kylemanna/openvpn ovpn_genconfig -u udp://vpn.yourdomain.com:1194```


#### 4. Generate ovpn_initpki

```docker run --volumes-from $OVPN_DATA --rm -it kylemanna/openvpn ovpn_initpki```

#### 5. Run the server 
```docker run --volumes-from $OVPN_DATA --rm -p 1194:1194/udp --cap-add=NET_ADMIN kylemanna/openvpn```

#### 6. Generate client keys
```docker run --volumes-from $OVPN_DATA rm -it  kylemanna/openvpn easyrsa build-client-full serkan nopass``` <br /><br />
```docker run --volumes-from $OVPN_DATA -rm kylemanna/openvpn ovpn_getclient serkan > serkan.ovpn```


#### 7. Run the server

```docker run -d --volumes-from $OVPN_DATA -p 0.0.0.0:1194:1193/udp --cap-add=NET_ADMIN kylemanna/openvpn```
