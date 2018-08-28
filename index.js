#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
var path = require("path");
function getCamelCase( str ) {
    return str.replace( /-([a-z])/g, function( all, i ){
        return i.toUpperCase();
    } )
}

function generateJs(filename) {
    const filenameCamelCase = getCamelCase(filename);
    return `import ${filenameCamelCase}Html from './${filename}.html';
import app from 'App';
import './${filenameCamelCase}.scss';
    
class ${filenameCamelCase}Controller {
    constructor($scope, $uibModal, $timeout, SplService, Notifier) {
        this.services = { $scope, $uibModal, $timeout, SplService };
    }
    

    $onInit() {
        const { $scope } = this.services;
    }
}    

${filenameCamelCase}Controller.$inject = ['$scope', '$uibModal', '$timeout', 'SplService', 'Notifier'];
app.component('${filename}', {
    template: ${filenameCamelCase}Html,
    bindings: {
    },
    controller: ${filenameCamelCase}Controller,
});`
}
function generateHtml(filename) {
    const filenameCamelCase = getCamelCase(filename);
    return `<main class="main-content">${filenameCamelCase} is working !</main>`
}
function generateScss(filename) {
    return `${filename} {

}`
}

function addComponent(cmd) {
    const args = cmd.parent.args;
    args.forEach( item => {
        mkdirsync(item, cmd);
    });

}

function mkdirsync(filename, cmd) {
    const cdir = cmd.cpath + '/' + filename;
    if( fs.existsSync( cdir ) ){
        console.log(cdir + 'is extend');
    } else {
        fs.mkdir(cdir, function(err) {
            if(err) {
                console.log(err);
            } else {
                touchfile(filename, cdir);
            }
        });
    }
}

function touchfile(filename, dirpath) {
    const fileDir = dirpath + '/' + filename;
    fs.writeFile(fileDir + '.js' , generateJs(filename),(err) => {
        if(err) console.log(err);
    });
    fs.writeFile(fileDir + '.scss', generateScss(filename), (err) => {
        if(err) console.log(err);
    });
    fs.writeFile(fileDir + '.html', generateHtml(filename), (err) => {
        if(err) console.log(err);
    });
}



program
    .version('0.1.3');


program
  .command('run <dir> [name]', '')
  .alias('r')
  .description('')
  .option('-c, --component', 'generate a component')
  .action((cpath, filename, cmd) => {
      if (cmd.component) {
        // 挂载解析好的路径
        cmd.cpath = path.resolve(process.cwd(), cpath)
        addComponent(cmd)
      } else {
          console.log('please input parameter')
      }
  }).on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('  $ eoi run -c <dir> [name]');
    console.log('  $ eoi run --component <dir> [name]');
    console.log();
  })
program.parse(process.argv)