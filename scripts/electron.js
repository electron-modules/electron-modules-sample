'use strict';

const path = require('path');
const nodemon = require('gulp-nodemon');

function startElectron(done) {
  const stream = nodemon({
    script: path.resolve(__dirname, 'launcher.js'),
    ext: 'ts js json html',
    ignore: [],
    watch: [
      'src',
      'package.json',
    ],
    done,
    delay: '5000',
  });
  stream
    .on('restart', files => {
      console.log('App restarted due to: ', files);
    })
    .on('crash', () => {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10);
    });
}

startElectron.displayName = 'start-electron';

exports.start = startElectron;