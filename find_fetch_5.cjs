const fs = require('fs');
const path = require('path');
function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.mjs')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.match(/(?:window|globalThis|global|self)\s*\.\s*fetch\s*=\s*/g)) {
        console.log("MATCH DOT: " + fullPath);
      }
      if (content.match(/(?:window|globalThis|global|self)\s*\[\s*['"]fetch['"]\s*\]\s*=\s*/g)) {
        console.log("MATCH BRACKET: " + fullPath);
      }
      if (content.match(/.*fetch\s*=\s*.*/g)) {
         let line = content.split('\n').find(l => l.includes('fetch =') || l.includes('fetch='));
         if (line && line.includes('window')) console.log("FETCH EQUAL WINDOW: " + fullPath);
      }
    }
  }
}
search('node_modules/firebase');
search('node_modules/@firebase');
search('node_modules/undici');
search('node_modules/node-fetch');
search('node_modules/cross-fetch');
search('node_modules/whatwg-fetch');
