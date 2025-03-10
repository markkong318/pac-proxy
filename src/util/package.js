import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, './../../package.json');

export function getVersion() {
  const data = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(data);
  return packageJson.version;
}
