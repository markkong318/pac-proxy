import fs from 'fs';
import fetch from 'node-fetch';
import { logger } from 'rg-commander';

export default async ({file}) => {
  let content = '';

  if (file.startsWith('http://') || file.startsWith('https://')) {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
    }

    content = await response.text();
  } else {
    content = await fs.readFileSync(file, 'utf8');
  }

  logger.debug(`content: ${content}`);

  return content
};
