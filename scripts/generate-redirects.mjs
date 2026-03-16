#!/usr/bin/env node
/**
 * Generates HTML redirect files for old Jekyll URLs → new Astro URLs.
 * Run as part of the build: node scripts/generate-redirects.mjs
 * Creates files in dist/ after astro build.
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const DIST = 'dist';

// Ensure dist directory exists
mkdirSync(DIST, { recursive: true });

const redirects = {
  // Posts (old Jekyll: /:categories/:year/:month/:day/:title.html)
  'jekyll/2015/10/20/hashicorp-vault-setup.html': '/posts/hashicorp-vault-setup/',
  'coreos,ssh/2015/11/07/coreos-bastion-host-setup.html': '/posts/coreos-bastion-host-setup/',
  'vpn,/docker/2015/11/09/open-vpn-setup-with-docker.html': '/posts/open-vpn-setup-with-docker/',
  'osx,/screenshot/2016/07/10/save-screenshot-to-clipboard-on-osx.html': '/posts/save-screenshot-to-clipboard-on-osx/',
  'ssh,/encryption/2017/12/03/encrypting-files-rsa-key-pairs.html': '/posts/encrypting-files-rsa-key-pairs/',
  's3,/encryption/2018/01/05/S3-server-side-encryption-with-customer-provided-enc-keys.html': '/posts/s3-server-side-encryption-with-customer-provided-enc-keys/',
  'git,/github/2018/04/01/useful-github-search-queries.html': '/posts/useful-github-search-queries/',
  'aws,/lambda,/serverless/2018/06/30/setting-up-sqs-as-event-source-with-serverless-and-cloudformation.html': '/posts/setting-up-sqs-as-event-source-with-serverless-and-cloudformation/',
  'aws,/til,/2018/07/09/TIL-AWS-ip-range-api.html': '/posts/til-aws-ip-range-api/',
  'aws,/clooudtrail,/cli/2018/07/10/useful-aws-cli-cloudtrail-commands.html': '/posts/useful-aws-cli-cloudtrail-commands/',
  'aws,/rds,/cli/2018/07/11/aws-cli-rds-commands.html': '/posts/aws-cli-rds-commands/',
  'aws,/lambda,/serverless,cloudformation/2018/08/09/multi-stage-api-gateway-deployment-with-serverless.html': '/posts/multi-stage-api-gateway-deployment-with-serverless/',
  'aws,/ec2,/cli/2018/08/20/useful-aws-cli-ec2-commands.html': '/posts/useful-aws-cli-ec2-commands/',
  'jq,cli/2018/09/26/jq-cheat-sheet.html': '/posts/jq-cheat-sheet/',
  'aws,cli/2018/09/28/search-aws-sg-for-a-given-ip.html': '/posts/search-aws-sg-for-a-given-ip/',
  'aws,cli,s3/2018/10/09/filter-and-delete-s3-objects-by-date.html': '/posts/filter-and-delete-s3-objects-by-date/',
  'vscode,terminal,/2018/10/15/set-up-vscode-terminal-env-var.html': '/posts/set-up-vscode-terminal-env-var/',
  'github,github-topic-labels,github/search/2019/02/26/sarching-github-multiple-topics-copy.html': '/posts/sarching-github-multiple-topics/',
  'awk,cli/2019/07/01/awk-notes.html': '/posts/awk-notes/',
  'aws,cli,aws-cli/2019/08/01/aws-cli-notes.html': '/posts/aws-cli-notes/',
  'terraform,circleci/2019/08/01/terraform-notes.html': '/posts/terraform-notes/',
  // Old pages
  'categories.html': '/tags/',
  'tags.html': '/tags/',
  'articles.html': '/posts/',
  'tools.html': '/one-liners/',
};

function redirectHtml(newUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta http-equiv="refresh" content="0;url=${newUrl}"/>
<link rel="canonical" href="${newUrl}"/>
<title>Redirecting…</title>
</head>
<body><p>Redirecting to <a href="${newUrl}">${newUrl}</a>…</p></body>
</html>`;
}

// Create .nojekyll file to disable GitHub Pages Jekyll processing
writeFileSync(join(DIST, '.nojekyll'), '');
console.log('✓ Created .nojekyll file to disable Jekyll processing');

let count = 0;
for (const [oldPath, newUrl] of Object.entries(redirects)) {
  const filePath = join(DIST, oldPath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, redirectHtml(newUrl));
  count++;
}

console.log(`✓ Generated ${count} redirect files in ${DIST}/`);
