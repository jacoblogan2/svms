const fs = require('fs');
const txt = fs.readFileSync('err.txt', 'utf16le');
console.log(txt);
