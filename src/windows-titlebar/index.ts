'use strict';

import url from 'url';
import path from 'path';
import _ from 'lodash';
import { ipcMain } from 'electron';
import windowTitleBar from 'electron-windows-titlebar';

module.exports = (app: any) => {
  const windowUrl = url.format({
    pathname: path.join(__dirname, 'renderer', 'main.html'),
    protocol: 'file:',
  });
  const loadingUrl = url.format({
    pathname: path.join(__dirname, 'renderer', 'loading.html'),
    protocol: 'file:',
  });

  const window = app.windowManager.create({
    name: Date.now(),
    loadingView: {
      url: loadingUrl,
    },
    browserWindow: {
      webPreferences: {
        nodeIntegration: true,
        webSecurity: true,
        webviewTag: true,
        preload: path.join(__dirname, 'renderer', 'preload.js'),
      },
    },
  });
  const hwnd = window?.getNativeWindowHandle();
  ipcMain.on('switch-theme-mode', (_, params) => {
    const { dark } = params;
    if (hwnd) {
      dark ? windowTitleBar.switchDarkMode(hwnd) : windowTitleBar.switchLightMode(hwnd);
    }
  });
  window.loadURL(windowUrl);
};
