'use strict';

const { contextBridge, ipcRenderer } = require('electron');
const sqlite3 = require('@journeyapps/sqlcipher').verbose();

let dbInstance;
function initDB(dbFilePath) {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(dbFilePath);
  }
  return dbInstance;
}

contextBridge.exposeInMainWorld('_electron_bridge', {
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  },
  // browserWin -> renderer 进程执行 sqlite 操作
  runSql: async (...args) => {
    if (dbInstance) {
      dbInstance.serialize(() => {
        dbInstance.run(...args);
      });
    }
    return 'ok';
  },
  connectSql: async () => {
    // 初始化
    dbInstance = initDB('./src/local-storage/sqlite/test-renderer.db');

    return 'ok';
  },
  closeSql: async () => {
    dbInstance?.close();
    return 'ok';
  },
});
