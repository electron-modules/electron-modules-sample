'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('_electron_bridge', {
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  },
});
