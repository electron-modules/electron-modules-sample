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

document.addEventListener('click', e => {
  const { target } = e;
  if (target.nodeName === 'A') {
    if (e.defaultPrevented) return;
    if (target.href) {
      e.preventDefault();
      shell.openExternal(target.href);
    }
  }
}, false);
