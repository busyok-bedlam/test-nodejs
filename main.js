const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const CPU = require('os').cpus().length;
const pipeline = promisify(stream.pipeline);
const { spawn } = require('child_process');

const inputFile = process.argv[2] || '';
const outputFile = 'file.txt';

const sendKeywordToWorker = async keywords => {
  try {
    const child = spawn('node', ['searchWorker', JSON.stringify(keywords)]);
    for await (const data of child.stdout) {
      console.log(`${data}`);
    };
  }
  catch(err) {
    throw err;
  }
}
const processQueue = async queue => {
  try {
    await Promise.all(queue.map(async item => {
     return sendKeywordToWorker(item)
    }));
  }
  catch(err) {
    throw err;
  }

}

const processStream = async readable => {
  try {
    let word = '';
    const wordsArray = [];
    const queue = [];
    for await (const chunk of readable) {
      if(chunk.indexOf('\n') === 0) {
        wordsArray.push(word);
        word = '';
        if(wordsArray.length === 100) {
          if(queue.length < CPU) {
            queue.push(wordsArray);
          } else if(queue.length > CPU) {
            queue.lenght = 0;
          } else if(queue.length === CPU) {
            await processQueue(queue);
            queue.length = 0;
          }
          wordsArray.length = 0;
        }
      } else {
        word += chunk;
      }
    }
    if(queue.length) {
      await processQueue(queue);
      queue.length = 0;
    }
    if(wordsArray.length) {
      await processQueue([wordsArray]);
      wordsArray.lenght = 0;
    }
  }
  catch(err) {
    debugger
    throw err;
  }
}

(async () => {
  try {
    fs.accessSync(inputFile, fs.constants.F_OK);
    const readStream = fs.createReadStream(inputFile);
    const unzip = zlib.createGunzip(readStream);
    const write = fs.createWriteStream(outputFile);
    await pipeline(
      readStream,
      unzip,
      write
    )

    const readUnzipStream = fs.createReadStream(outputFile, {
      encoding: 'utf8',
      highWaterMark: 1
    });
    await processStream(readUnzipStream);
  }
  catch(err) {
    console.log(err);
  }

})()

