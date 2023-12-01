const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

const myEmitter = new EventEmitter();
let currentPath = '';

myEmitter.on('mkdir', (folderName) => {
    const folderPath = path.join(currentPath, folderName);
    
    fs.mkdir(folderPath, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Folder '${folderName}' created in '${currentPath}'`);
        }
    });
});

myEmitter.on('touch', (fileName, text) => {
    const filePath = path.join(currentPath, fileName);
    
    fs.writeFile(filePath, text, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`File '${fileName}' created in '${currentPath}' with content: ${text}`);
        }
    });
});

myEmitter.on('read', (fileName) => {
    const filePath = path.join(currentPath, fileName);
    
    fs.readFile(filePath, 'utf8', (error, content) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Content of '${fileName}' in '${currentPath}': ${content}`);
        }
    });
});

myEmitter.on('cd', (newPath) => {
    if (newPath === '..') {
        currentPath = path.dirname(currentPath);
    } else {
        currentPath = path.join(currentPath, newPath);
    }
    
    console.log(`Current path updated to: ${currentPath}`);
});

myEmitter.on('rm', (targetName) => {
    const targetPath = path.join(currentPath, targetName);
    
    fs.rm(targetPath, { recursive: true }, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Successfully removed '${targetName}' from '${currentPath}'`);
        }
    });
});


myEmitter.emit('mkdir', 'folder1');
myEmitter.emit('cd', 'folder1');
myEmitter.emit('mkdir', 'folder11');
myEmitter.emit('cd', 'folder11');
myEmitter.emit('touch', 'hello.txt', 'Hello, world!');
myEmitter.emit('cd', '..');
myEmitter.emit('cd', '..');
myEmitter.emit('mkdir', 'folder2');
myEmitter.emit('touch', 'salem.txt', 'Salem, alem!');