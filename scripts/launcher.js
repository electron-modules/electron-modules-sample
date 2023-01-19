'use strict';

const { spawn } = require('child_process');
const electron = require('electron');

spawn(electron, [
  '-r',
  'ts-node/register/transpile-only',
  './src/main.ts',
  '--no-sandbox',
], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit',
});
