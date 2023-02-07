'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  },
});

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('switch-dark-mode').addEventListener('click', () => {
    ipcRenderer.send('switch-theme-mode', {
      dark: true,
    });
  });

  document.getElementById('switch-light-mode').addEventListener('click', () => {
    ipcRenderer.send('switch-theme-mode', {
      dark: false,
    });
  });
});