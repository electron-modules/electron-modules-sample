'use strict';

const {
  ipcRenderer,
  desktopCapturer, contextBridge,
} = require('electron');

contextBridge.exposeInMainWorld('_electron_bridge', {
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  },
  desktopCapturer,
});
