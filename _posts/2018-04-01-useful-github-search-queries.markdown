---
layout: post
title:  "Useful github search queries "
date:   2018-04-01 22:13:00
categories: git, github
---


#### Search a npm package that is used in a project. This is useful to get ideas of how package is setup and used. [github](https://github.com/search?utf8=%E2%9C%93&q=rbac+filename%3Apackage.json&ref=simplesearch)
```
rbac filename:package.json
```
#### Search repos with more than 100 stars.

```
 rbac filename:package.json stars:>100
```

#### Search repos with more than 100 stars and a javasscript repo.
```
rbac filename:package.json stars:>100 language:javascript
```

#### Search string `ecs` in a file with .tf extension. [github](https://github.com/search?utf8=%E2%9C%93&q=ecs+extension%3Atf&type=Repositories&ref=advsearch&l=&l=) 

```
ecs extension:tf
```

#### Another practical example is to search for content that are usually in a certain path. Forexample circleci 2.0 files are are stored in `<repo-root>/.circleci/config.yml`. Say you want to find an example of psql usage in circleci manifest file:
```
 psql filename:config.yml path:.circleci
 ````

