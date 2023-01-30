'use strict';

document.querySelector('#checkForUpdates').addEventListener('click', () => {
  window._electron_bridge.send('updator:checkForUpdates');
}, false);

document.querySelector('#downloadUpdate').addEventListener('click', () => {
  window._electron_bridge.send('updator:downloadUpdate');
}, false);

document.querySelector('#quitAndInstall').addEventListener('click', () => {
  window._electron_bridge.send('updator:quitAndInstall');
}, false);
