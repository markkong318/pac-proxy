import fs from 'fs';
import fetch from 'node-fetch';

export default async ({file}) => {
  if (string.startsWith('http://') || string.startsWith('https://')) {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
    }
    return await response.text();
  }

  return fs.readFileSync(file, 'utf8');
};
