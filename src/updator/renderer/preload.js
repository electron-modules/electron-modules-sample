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
    desktopCapturer,
  },
);
