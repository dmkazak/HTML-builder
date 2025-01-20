const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');
const { error } = require('node:console');

const stylesDirectoryPath = path.join(__dirname, 'styles');
const bundleCssFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(bundleCssFilePath, '', (error) => {
  handleError(error);

  fs.readdir(stylesDirectoryPath, onDirectoryRead);
});

/////////////////////////////////////////////////////////////////////////////////

async function onDirectoryRead(error, fileNames) {
  handleError(error);

  const fileReadPromises = fileNames
    .filter((fileName) => path.extname(fileName) === '.css')
    .map((fileName) => path.join(stylesDirectoryPath, fileName))
    .map((filePath) => fsPromises.readFile(filePath, 'utf-8'));

  const fileContents = await Promise.all(fileReadPromises);
  fileContents.forEach((fileContent) =>
    fs.appendFile(bundleCssFilePath, fileContent + '\n', handleError),
  );
}

function handleError(error) {
  if (error) {
    throw new Error(error);
  }
}
