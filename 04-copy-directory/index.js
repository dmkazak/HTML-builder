const fs = require('node:fs');
const path = require('node:path');

const sourceDirectoryPath = path.join(__dirname, 'files');
const targetDirectoryPath = path.join(__dirname, 'files-copy');

fs.rm(targetDirectoryPath, { recursive: true, force: true }, (error) => {
  handleError(error);

  fs.mkdir(targetDirectoryPath, (error) => {
    handleError(error);

    fs.readdir(sourceDirectoryPath, (error, fileNames) =>
      onDirectoryRead(sourceDirectoryPath, error, fileNames),
    );
  });
});
/////////////////////////////////////////////////////////////////////////////////

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

    fs.copyFile(sourceFilePath, targetFilePath, handleError);
  }
}

function handleError(error) {
  if (error) {
    throw new Error(error);
  }
}
