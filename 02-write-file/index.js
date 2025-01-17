const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const filePath = path.join(__dirname, 'text.txt');
fs.appendFile(filePath, '', onError);

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readlineInterface.question(
  'Greetings, my friend! What do you want to say?\n',
  onLine,
);
readlineInterface.on('line', onLine);
readlineInterface.on('close', goodbye);

/////////////////////////////////////////////////////////////////////////////////

function goodbye() {
  readlineInterface.write('Goodbye!\n');
  process.exit(0);
}

function onLine(line) {
  if (line === 'exit') {
    readlineInterface.close();
    return;
  }

  fs.appendFile(filePath, line + '\n', onError);
}

function onError(error) {
  if (error) {
    console.log('Something went wrong while appending to file:\n', error);
  }
}
