---
title: "TIL - ArgoCD PR Previews: Use the Commit SHA, Not the PR Number"
date: 2026-03-24 12:00:00
tags: ["argocd", "kubernetes", "til", "gitops"]
description: "Why tagging Docker images with the PR number breaks ArgoCD preview deployments, and how head_short_sha_7 fixes it"
---

I was setting up PR preview environments with ArgoCD. The idea: open a pull request, and ArgoCD automatically deploys that branch so you can test it at a unique URL.

It worked on the first push. But when I pushed more commits to the same PR, **nothing happened**. The preview was stuck on my first commit.

#### What went wrong

My CI pipeline tagged Docker images with the PR number — `my-app:pr-42`. ArgoCD's config also referenced `pr-42`. So when I pushed a second commit, CI built a new image and pushed it as `my-app:pr-42` again (overwriting the old one). But ArgoCD's config still said `pr-42` — same as before. ArgoCD compared the old config to the new config, saw no difference, and did nothing.

```yaml
# The problem: this tag never changes between pushes
images:
  - my-app=my-registry/my-app:pr-{{number}}
```

#### The fix

ArgoCD's `pullRequest` generator has a variable called `head_short_sha_7` — it's the first 7 characters of the latest commit on the PR branch. Every new push changes this value.

```yaml
# Now each push produces a different tag
images:
  - my-app=my-registry/my-app:sha-{{head_short_sha_7}}
```

CI just needs to tag images with the commit SHA instead of the PR number:

```bash
docker tag my-app my-registry/my-app:sha-$(git rev-parse --short=7 HEAD)
```

Now the flow works:
1. I push commit `abc1234` — CI builds `my-app:sha-abc1234`, ArgoCD deploys it
2. I push commit `def5678` — CI builds `my-app:sha-def5678`, ArgoCD sees the tag changed and re-deploys

Every push gets its own unique image tag, so ArgoCD always picks up the change.
