'use strict';

const url = require('url');
const path = require('path');
const { ipcMain } = require('electron');
require('@electron/remote/main').initialize();

let dbInstance: null | any = null;
function initDB(dbFilePath: string) {
  if (!dbInstance) {
    const sqlite3 = require('@journeyapps/sqlcipher').verbose();
    dbInstance = new sqlite3.Database(dbFilePath);

    // dbInstance.serialize(() => {
    //   // This is the default, but it is good to specify explicitly:
    //   dbInstance.run('PRAGMA cipher_compatibility = 4');

    //   dbInstance.run("PRAGMA key = 'mysecret'");
    //   dbInstance.run('CREATE TABLE lorem (info TEXT)');
    // });
  }
  return dbInstance;
}

module.exports = (app: any) => {
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

  // browserWin -> renderer -> main 进程执行 sqlite 操作
  ipcMain.on('sqlite:operate', (_, data) => {
    const { action, operator = 'run', id, sqlArgs } = data as any;
    if (action === 'connect') {
      dbInstance = initDB('./src/local-storage/sqlite/test-main.db');
    }

    if (action === 'exec') {
      if (dbInstance) {
        dbInstance.serialize(() => {
          dbInstance[operator](...sqlArgs, (err: Error, row: any) => {
            if (err) {
              window.webContents.send('sqlite:operate:reply', {
                id,
                status: 'failed',
                cause: err?.message,
              });
              return;
            }

            window.webContents.send('sqlite:operate:reply', {
              id,
              result: row,
              status: 'success',
            });
          });
        });
      }
    }

    if (action === 'close') {
      if (dbInstance) {
        dbInstance.close();
      }
    }
  });
};
