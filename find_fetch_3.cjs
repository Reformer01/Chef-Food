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
      if (content.match(/fetch\"\s*\]\s*=\s*/g)) {
        console.log("BRACKET: " + fullPath);
      }
      if (content.match(/fetch\s*=\s*/g) && content.includes('window')) {
        console.log("WINDOW: " + fullPath);
      }
      if (content.match(/fetch\s*=\s*/g) && content.includes('global')) {
        console.log("GLOBAL: " + fullPath);
      }
    }
  }
}
search('node_modules');
