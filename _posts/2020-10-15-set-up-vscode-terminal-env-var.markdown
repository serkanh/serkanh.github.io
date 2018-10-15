---
layout: post
title:  "Setup env variables for VScode integrated terminal."
date:   2018-10-15 10:40:00
categories: vscode,terminal,
---



If you are working on a project that involves multiple aws profiles and vscode, this trick might come handy. Depending on the project you would like to make calls from vscode interated terminal to certail aws accounts. In order to do it you need to setup env var `AWS_PROFILE` on the current shell session. So in order to that in vscode simply create `.vscode/settings.json` in your projects root and append or add the following snippet. Depending on the os you might need to slightly use different settings. 

````
{
	"terminal.integrated.env.osx": {
		"AWS_PROFILE":"shaytacycombinator"
	}
}
````

![Screenshot](/images/vscode-env.png)
