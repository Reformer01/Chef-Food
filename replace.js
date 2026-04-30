const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/bg-gray-/g, 'bg-neutral-');
      content = content.replace(/text-gray-/g, 'text-neutral-');
      content = content.replace(/border-gray-/g, 'border-neutral-');
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('./src/components');
console.log('Replaced all gray with neutral.');
