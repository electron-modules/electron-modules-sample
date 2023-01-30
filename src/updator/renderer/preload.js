'use strict';

const {
  ipcRenderer, shell,
  desktopCapturer, contextBridge,
} = require('electron');

contextBridge.exposeInMainWorld(
  '_electron_bridge',
  {
    send: (channel, args) => {
      ipcRenderer.send(channel, args);
    },
    invoke: ipcRenderer.invoke,
    on: (channel, listener) => {
      ipcRenderer.on(channel, listener);
    },
    desktopCapturer,
  },
);
