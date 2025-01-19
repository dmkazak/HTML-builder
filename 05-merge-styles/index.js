const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

const stylesDirectoryPath = path.join(__dirname, 'styles');
const bundleCssFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(bundleCssFilePath, '', onError);
fs.readdir(stylesDirectoryPath, onDirectoryRead);

/////////////////////////////////////////////////////////////////////////////////

async function onDirectoryRead(error, fileNames) {
  if (error) {
    console.error(
      `Something went wrong while reading directory '${stylesDirectoryPath}':\n${error}`,
    );
    return;
  }

  const fileReadPromises = fileNames
    .filter((fileName) => path.extname(fileName) === '.css')
    .map((fileName) => path.join(stylesDirectoryPath, fileName))
    .map((filePath) => fsPromises.readFile(filePath, 'utf-8'));

  const fileContents = await Promise.all(fileReadPromises);
  fileContents.forEach((fileContent) =>
    fs.appendFile(bundleCssFilePath, fileContent + '\n', onError),
  );
}

function onError(error) {
  if (error) {
    console.log('Something went wrong while writing to file:\n', error);
  }
}
