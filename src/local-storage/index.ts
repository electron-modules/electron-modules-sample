'use strict';

const url = require('url');
const path = require('path');
require('@electron/remote/main').initialize();

module.exports = (app) => {
  const mainUrl = url.format({
    pathname: path.join(__dirname, 'renderer', 'main.html'),
    protocol: 'file:',
  });
  const loadingUrl = url.format({
    pathname: path.join(__dirname, 'renderer', 'loading.html'),
    protocol: 'file:',
  });
  const windowSize = {
    width: 1280,
    height: 800,
  };
  const window = app.windowManager.create({
    name: 'local-storage',
    loadingView: {
      url: loadingUrl,
    },
    browserWindow: {
      ...windowSize,
      title: 'NoSQL Storage',
      show: true,
      acceptFirstMouse: true,
      webPreferences: {
        enableRemoteModule: false,
        nodeIntegration: false,
        webSecurity: true,
        webviewTag: true,
        preload: path.join(__dirname, 'renderer', 'preload.js'),
      },
    },
    openDevTools: true,
  });
  window.loadURL(mainUrl);
};
