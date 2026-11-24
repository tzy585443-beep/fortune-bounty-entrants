// Entry for make.fun bounty-entrants-03: validates BOUNTY.json names the launched bounty,
// then copies the exact original bytes to MAKEFUN_OUTPUT_DIR/BOUNTY.json for grading.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = join(BOT_DIR, 'BOUNTY.json');
const dest = join(OUTPUT_DIR, 'BOUNTY.json');

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

let bytes: Buffer;
try {
  bytes = readFileSync(source);
} catch (err) {
  fail(`Could not read ${source}: ${(err as Error).message}`);
}

let data: unknown;
try {
  data = JSON.parse(bytes.toString('utf8'));
} catch (err) {
  fail(`BOUNTY.json is not valid JSON: ${(err as Error).message}`);
}

if (data === null || typeof data !== 'object' || Array.isArray(data)) {
  fail('BOUNTY.json must be a JSON object.');
}

const obj = data as Record<string, unknown>;
const hasBounties = Object.prototype.hasOwnProperty.call(obj, 'bounties');
const hasUrl = Object.prototype.hasOwnProperty.call(obj, 'url');

if (hasBounties && hasUrl) {
  fail('BOUNTY.json must name either "bounties" or "url", not both.');
}

if (hasBounties) {
  const bounties = obj.bounties;
  if (!Array.isArray(bounties) || bounties.length === 0) {
    fail('"bounties" must be a non-empty array of strings.');
  }
  if (bounties.length > 100) {
    fail('"bounties" must not contain more than 100 items.');
  }
  for (const item of bounties) {
    if (typeof item !== 'string') {
      fail('"bounties" must contain only strings.');
    }
    if (item.length > 2048) {
      fail('Each "bounties" item must be at most 2048 characters.');
    }
  }
} else if (hasUrl) {
  if (typeof obj.url !== 'string') {
    fail('"url" must be a string.');
  }
  if (obj.url.length > 2048) {
    fail('"url" must be at most 2048 characters.');
  }
} else {
  fail('BOUNTY.json must name a non-empty "bounties" array of strings or a "url" string.');
}

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(dest, bytes);
} catch (err) {
  fail(`Could not write ${dest}: ${(err as Error).message}`);
}
