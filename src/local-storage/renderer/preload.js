'use strict';

const { contextBridge, ipcRenderer } = require('electron');
const sqlite3 = require('@journeyapps/sqlcipher').verbose();
const db = new sqlite3.Database('test.db');

contextBridge.exposeInMainWorld('_electron_bridge', {
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  },
  addTestData: async () => {
    const res = await db.all('');
    return res;
  },
});
