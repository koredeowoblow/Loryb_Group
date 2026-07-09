const fs = require('fs');
let content = fs.readFileSync('src/mocks/db.ts', 'utf8');
content = content.replace(/"rejectNo":\s*"(\d+)"/g, '"rejectNo": $1');
fs.writeFileSync('src/mocks/db.ts', content);
console.log('Done replacing rejectNo');
