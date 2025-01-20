const fs = require('node:fs');
const path = require('node:path');

const projectDistDirectoryPath = path.join(__dirname, 'project-dist');

const sourceAssetsDirectoryPath = path.join(__dirname, 'assets');
const targetAssetsDirectoryPath = path.join(projectDistDirectoryPath, 'assets');

const componentsDirectoryPath = path.join(__dirname, 'components');
const templateHtmlFilePath = path.join(__dirname, 'template.html');
const targetIndexHtmlFilePath = path.join(
  projectDistDirectoryPath,
  'index.html',
);

const sourceStylesDirectoryPath = path.join(__dirname, 'styles');
const targetStyleCssFilePath = path.join(projectDistDirectoryPath, 'style.css');

fs.rm(projectDistDirectoryPath, { recursive: true, force: true }, (error) => {
  handleError(error);

  fs.mkdir(projectDistDirectoryPath, (error) => {
    handleError(error);

    copyDirectory(sourceAssetsDirectoryPath, targetAssetsDirectoryPath);
    buildIndexHtml();
    buildStyleCss();
  });
});

/////////////////////////////////////////////////////////////////////////////////

function copyDirectory(sourceDirectoryPath, targetDirectoryPath) {
  fs.mkdir(targetDirectoryPath, handleError);

  fs.readdir(sourceDirectoryPath, (error, fileNames) => {
    handleError(error);

    for (const fileName of fileNames) {
      const sourceFilePath = path.join(sourceDirectoryPath, fileName);
      const targetFilePath = path.join(targetDirectoryPath, fileName);

      fs.stat(sourceFilePath, (error, fileStatistics) => {
        handleError(error);

        if (fileStatistics.isDirectory()) {
          copyDirectory(sourceFilePath, targetFilePath);
        } else {
          fs.copyFile(sourceFilePath, targetFilePath, handleError);
        }
      });
    }
  });
}

function buildIndexHtml() {
  let indexHtml = '';

  fs.readFile(templateHtmlFilePath, (error, template) => {
    handleError(error);

    fs.readdir(componentsDirectoryPath, (error, fileNames) => {
      handleError(error);

      indexHtml = template.toString();
      const componentPaths = toPaths(componentsDirectoryPath, fileNames).filter(
        (filePath) => path.extname(filePath) === '.html',
      );

      readComponents(
        componentPaths,
        (componentName, component) => {
          indexHtml = replaceComponent(
            indexHtml,
            componentName,
            component.toString(),
          );
        },
        () => fs.writeFile(targetIndexHtmlFilePath, indexHtml, handleError),
      );
    });
  });
}

function readComponents(filePaths, onRead, onFinish) {
  if (filePaths.length === 0) {
    onFinish();
    return;
  }

  const filePath = filePaths.pop();
  const fileExtension = path.extname(filePath);
  const componentName = path.basename(filePath, fileExtension);

  fs.readFile(filePath, (error, component) => {
    handleError(error);
    onRead(componentName, component);

    readComponents(filePaths, onRead, onFinish);
  });
}

function replaceComponent(template, componentName, component) {
  return template.replace(`{{${componentName}}}`, component);
}

function buildStyleCss() {
  let styleCss = '';

  fs.readdir(sourceStylesDirectoryPath, (error, fileNames) => {
    handleError(error);

    const filePaths = toPaths(sourceStylesDirectoryPath, fileNames).filter(
      (filePath) => path.extname(filePath) === '.css',
    );

    readCssFiles(
      filePaths,
      (cssFileContent) => {
        styleCss += cssFileContent.toString();
      },
      () => fs.writeFile(targetStyleCssFilePath, styleCss, handleError),
    );
  });
}

function readCssFiles(filePaths, onRead, onFinish) {
  if (filePaths.length === 0) {
    onFinish();
    return;
  }

  const filePath = filePaths.pop();

  fs.readFile(filePath, (error, fileContent) => {
    handleError(error);
    onRead(fileContent);

    readCssFiles(filePaths, onRead, onFinish);
  });
}

function handleError(error) {
  if (error) {
    throw new Error(error);
  }
}

function toPaths(rootFilePath, fileNames) {
  return fileNames.map((fileName) => path.join(rootFilePath, fileName));
}
