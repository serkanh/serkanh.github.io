#!/usr/bin/env node
/**
 * Fetches starred repos from GitHub using `gh` CLI (authenticated)
 * and writes them to src/data/stars.json.
 *
 * Run: node scripts/fetch-stars.mjs
 * Part of the build process: "prebuild" in package.json
 */

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const OUTPUT = 'src/data/stars.json';

mkdirSync(dirname(OUTPUT), { recursive: true });

console.log('⭐ Fetching starred repos from GitHub...');

const raw = execSync(
  `gh api /users/serkanh/starred --paginate -H "Accept: application/vnd.github.v3.star+json" --jq '.[] | {starred_at: .starred_at, full_name: .repo.full_name, html_url: .repo.html_url, description: .repo.description, stargazers_count: .repo.stargazers_count, language: .repo.language, topics: .repo.topics}'`,
  { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
);

const repos = raw
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

writeFileSync(OUTPUT, JSON.stringify(repos, null, 2));
console.log(`✓ Wrote ${repos.length} starred repos to ${OUTPUT}`);
