#!/usr/bin/env node

import * as program from 'commander';
import { promises as fs } from 'fs';
import * as path from "path";

function getCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (_, i) => i.toUpperCase());
}

function generateJs(filename: string) {
  const filenameCamelCase = getCamelCase(filename);
  const filenamePascalCase = filenameCamelCase[0].toUpperCase() + filenameCamelCase.slice(1);
  return `import ${filenamePascalCase}Html from './${filename}.html';
import app from 'App';
import './${filenameCamelCase}.scss';

class ${filenamePascalCase}Controller {
  constructor($scope, $uibModal, $timeout, SplService, Notifier) {
    this.services = { $scope, $uibModal, $timeout, SplService };
  }


  $onInit() {
    const { $scope } = this.services;
  }
}

${filenamePascalCase}Controller.$inject = ['$scope', '$uibModal', '$timeout', 'SplService', 'Notifier'];
app.component('${filename}', {
  template: ${filenamePascalCase}Html,
  bindings: {
  },
  controller: ${filenamePascalCase}Controller,
});`
}
function generateHtml(filename: string) {
  const filenameCamelCase = getCamelCase(filename);
  return `<main class="main-content">${filenameCamelCase} works!</main>`
}
function generateScss(filename: string) {
  return `${filename} {

}`
}

async function addComponent(cmd) {
  for (const filename of cmd.parent.args) {
    const cdir = await createDirectory(filename, cmd);
    await createFiles(filename, cdir);
  }
}

async function createDirectory(filename, cmd) {
  const cdir = path.resolve(cmd.cpath, filename);
  try {
    await fs.mkdir(cdir);
  } catch {
    // Directory already exists
  }
  return cdir;
}

async function createFiles(filename, dirpath) {
  const fileDir = path.resolve(dirpath, filename);
  await fs.writeFile(fileDir + '.js' , generateJs(filename));
  await fs.writeFile(fileDir + '.scss', generateScss(filename));
  await fs.writeFile(fileDir + '.html', generateHtml(filename));
}


program
  .version('0.1.3')
  .command('gen <dir> [name]')
  .alias('g')
  .description('')
  .option('-c, --component', 'generate a component')
  .action((cpath: string, filename: string, cmd) => {
    if (cmd.component) {
      // 挂载解析好的路径
      cmd.cpath = path.resolve(process.cwd(), cpath);
      addComponent(cmd);
    } else {
      console.error('Argument "--component" required');
    }
  })
  .on('--help', () => {
    console.log('  Example:');
    console.log();
    console.log('  $ eoi run -c <dir> [name]');
    console.log('  $ eoi run --component <dir> [name]');
    console.log();
  })
  .parse(process.argv);

