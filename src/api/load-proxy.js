import fs from 'fs';
import fetch from 'node-fetch';

export default async ({ file }) => {
  return await loadFromUrl(file) || await loadFromFile(file);
};

async function loadFromUrl(file) {
  if (!file.startsWith('http://') && !file.startsWith('https://')) {
    return;
  }

  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
  }

  return await response.text();
}

async function loadFromFile(file) {
  return fs.readFileSync(file, 'utf8');
}
