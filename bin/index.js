#!/usr/bin/env node

import pkg from '@caporal/core';
import {install, action} from '../src/cmd/default.js';

const { program } = pkg;

if (process.argv.length === 2) {
  process.argv.push('--help');
}

install(program).action(action);

program.run().catch((err) => {
  console.error(err);
});
