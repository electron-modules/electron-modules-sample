'use strict';

document.querySelector('#checkForUpdates').addEventListener('click', () => {
  window._electron_bridge.send('updator:checkForUpdates');
}, false);
