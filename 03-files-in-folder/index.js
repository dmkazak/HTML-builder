const fs = require('node:fs');
const path = require('node:path');

const secretFolderPath = path.join(__dirname, 'secret-folder');
fs.readdir(secretFolderPath, (error, fileNames) =>
  onDirectoryRead(secretFolderPath, error, fileNames),
);

/////////////////////////////////////////////////////////////////////////////////

function onDirectoryRead(directoryPath, error, fileNames) {
  if (error) {
    console.log('Something went wrong while reading directory:\n', error);
    return;
  }

  for (const fileName of fileNames) {
    const filePath = path.join(directoryPath, fileName);

    fs.stat(filePath, (error, statistics) =>
      onFileStatisticsRead(filePath, error, statistics),
    );
  }
}

function onFileStatisticsRead(filePath, error, statistics) {
  if (error) {
    console.log('Something went wrong while reading file statistics:\n', error);
    return;
  }

  if (statistics.isFile()) {
    console.log(formatFileMeta(filePath, statistics));
  }
}

function formatFileMeta(filePath, statistics) {
  const parsedFilePath = path.parse(filePath);

  // result has the following format: <file-name> - <file-extension> - <file-size> Bytes
  let result = parsedFilePath.name;
  result += parsedFilePath.ext
    ? ` - ${parsedFilePath.ext.replace('.', '')}`
    : ' - <no-extension>';
  result += ` - ${statistics.size} Bytes`;

  return result;
}
