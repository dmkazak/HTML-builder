const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');
const fileReadStream = fs.createReadStream(filePath, { encoding: 'utf8' });

fileReadStream.on('data', (fileChunk) => process.stdout.write(fileChunk));
