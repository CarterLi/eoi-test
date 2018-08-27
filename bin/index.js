#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
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
    constructor() {
    }

    $onInit() {
    }
}    
app.component('${filename}', {
    template: ${filenameCamelCase}Html,
    bindings: {
    },
    controller: ${filenameCamelCase}Controller,
});`
}
function generateHtml(filename) {
    const filenameCamelCase = getCamelCase(filename);
    return `<${filename}>${filenameCamelCase} is works</${filename}>`
}
function generateScss(filename) {
    return `${filename} {}`
}

function addComponent(filename, cmd) {
    const args = cmd.parent.rawArgs;
    const nodepath = args.splice(0, 1); // node run env
    const command = args.splice(0, 1); // the eoi compand 
    const curpath = args.splice(0, 1);
    const dcommand = args.splice(0, 1); // eoi compand detail
    args.forEach(item => {
        mkdirsync(item);
    });

}

function mkdirsync(dirpath) {
    const curpath = process.cwd()+ '/' + dirpath; // run node compand path   
    if( fs.existsSync( curpath ) ){
        console.log(dirpath + 'is extend');
    } else {
        fs.mkdir(curpath, function(err) {
            if(err) console.log(err);
            touchfile(dirpath, curpath);
        });
    }
}

function touchfile(filename, dirpath) {
    console.log(dirpath + '/' + filename);
    const fileDir = dirpath + '/' + filename;
    fs.writeFile( fileDir + '.js' , generateJs(filename),(err) => {
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
    .version('0.1.0');


program
  .command('g <filename>')
  .option('c, component')
  .action(function(filename, cmd) {
    addComponent(filename,cmd)
  })
program.parse(process.argv)