const fs = require('fs');
const path = require('path');
function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.match(/\.fetch\s*=\s*/g) && !fullPath.includes('node_modules/typescript')) {
        console.log(fullPath);
      }
      if (content.match(/fetchPolyfill/i)) {
        console.log("POLYFILL: " + fullPath);
      }
    }
  }
}
search('node_modules');
