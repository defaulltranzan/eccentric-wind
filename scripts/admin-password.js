#!/usr/bin/env node
/* Prints an ADMIN_PASSWORD_HASH for .env / Vercel.
 *   npm run admin:password            (prompts, input hidden)
 *   npm run admin:password -- "pass"  (non-interactive) */
'use strict';
const { hashPassword } = require('../src/middleware/adminSession');

function finish(password) {
  if (!password || password.length < 10) {
    console.error('Use at least 10 characters.');
    process.exit(1);
  }
  console.log('\nADMIN_PASSWORD_HASH=' + hashPassword(password) + '\n');
  console.log('Add that line to .env (local) and to Vercel → Settings → Environment Variables.');
}

const arg = process.argv[2];
if (arg) {
  finish(arg);
} else {
  const stdin = process.stdin;
  process.stdout.write('New admin password: ');
  if (stdin.isTTY) stdin.setRawMode(true);
  let input = '';
  stdin.setEncoding('utf8');
  stdin.on('data', (ch) => {
    if (ch === '\r' || ch === '\n' || ch === '\u0004') {
      if (stdin.isTTY) stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write('\n');
      finish(input);
    } else if (ch === '\u0003') {
      process.exit(1);
    } else if (ch === '\u007f' || ch === '\b') {
      input = input.slice(0, -1);
    } else {
      input += ch;
    }
  });
}
