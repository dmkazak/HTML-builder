const fs = require('node:fs');
const path = require('node:path');

const sourceDirectoryPath = path.join(__dirname, 'files');
const targetDirectoryPath = path.join(__dirname, 'files-copy');

fs.mkdir(targetDirectoryPath, onDirectoryCreated);
fs.readdir(sourceDirectoryPath, (error, fileNames) =>
  onDirectoryRead(sourceDirectoryPath, error, fileNames),
);

/////////////////////////////////////////////////////////////////////////////////

function onDirectoryCreated(error) {
  if (error) {
    console.error(`Something went wrong while creating directory:\n${error}`);
  }
}

function onDirectoryRead(directoryPath, error, fileNames) {
  if (error) {
    console.error(
      `Something went wrong while reading directory '${directoryPath}':\n${error}`,
    );
    return;
  }

  for (const fileName of fileNames) {
    const sourceFilePath = path.join(directoryPath, fileName);
    const targetFilePath = path.join(targetDirectoryPath, fileName);

    fs.copyFile(sourceFilePath, targetFilePath, onFileCopyError);
  }
}

function onFileCopyError(error) {
  if (error) {
    console.error(`Something went wrong while copying file:\n${error}`);
  }
}
