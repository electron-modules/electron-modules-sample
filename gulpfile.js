'use strict';

const { task } = require('gulp');

const develop = require('./scripts/develop');

task('dev-app', develop.devApp);
