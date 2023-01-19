'use strict';

const { series } = require('gulp');

function devApp(done) {
  done();
}

devApp.displayName = 'dev-app-scripts';

exports.devApp = series(
  devApp,
  require('./electron').start,
);
