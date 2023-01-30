'use strict';

document.querySelector('#checkForUpdates_available').addEventListener('click', () => {
  window._electron_bridge.send('updator:checkForUpdates:available');
}, false);

document.querySelector('#checkForUpdates_notAvailable').addEventListener('click', () => {
  window._electron_bridge.send('updator:checkForUpdates:notAvailable');
}, false);

document.querySelector('#downloadUpdate').addEventListener('click', () => {
  window._electron_bridge.send('updator:downloadUpdate');
}, false);

document.querySelector('#quitAndInstall').addEventListener('click', () => {
  window._electron_bridge.send('updator:quitAndInstall');
}, false);
