'use strict';

const url = require('url');
const path = require('path');
const _ = require('lodash');
const { ipcMain, screen, BrowserWindow } = require('electron');

const getRandomPostion = () => {
  const { workAreaSize } = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = workAreaSize;
  const x = parseInt(_.random(screenWidth / 16, screenWidth / 2), 10);
  const y = parseInt(_.random(screenHeight / 16, screenHeight / 2), 10);
  return {
    x,
    y,
  };
};

module.exports = (app: any) => {
  const windowUrl = url.format({
    pathname: path.join(__dirname, 'renderer', 'window.html'),
    protocol: 'file:',
  });
  const loadingUrl = url.format({
    pathname: path.join(__dirname, 'renderer', 'loading.html'),
    protocol: 'file:',
  });

  const postion = getRandomPostion();
  const window = app.windowManager.create({
    name: Date.now(),
    loadingView: {
      url: loadingUrl,
    },
    browserWindow: {
      x: postion.x,
      y: postion.y,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: true,
        webviewTag: true,
        preload: path.join(__dirname, 'renderer', 'preload.js'),
      },
    },
  });
  window.loadURL(windowUrl);
  ipcMain.on('close-window', (_) => {
    const window = BrowserWindow.fromWebContents(_.sender);
    window.close();
  });

  ipcMain.on('blur-window', (_) => {
    const window = BrowserWindow.fromWebContents(_.sender);
    window.blur();
  });

  ipcMain.on('open-devtools', (_) => {
    const window = BrowserWindow.fromWebContents(_.sender);
    window.openDevTools();
  });
};
