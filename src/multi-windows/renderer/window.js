'use strict';

document.querySelector('#close').addEventListener('click', () => {
  window._electron_bridge.send('close-window');
}, false);

document.querySelector('#blur').addEventListener('click', () => {
  window._electron_bridge.send('blur-window');
}, false);

document.querySelector('#write').addEventListener('click', () => {
  const data = 'write local file successfully';
  const fileName = 'file.txt';
  window._electron_bridge.writeFile(fileName, data, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(window._electron_bridge.readFileSync(fileName, 'utf8'));
    }
  });
}, false);

document.querySelector('#debug').addEventListener('click', () => {
  window._electron_bridge.send('open-devtools');
}, false);

document.addEventListener('click', e => {
  const { target } = e;
  if (target.nodeName === 'A') {
    if (e.defaultPrevented) return;
    if (target.href) {
      e.preventDefault();
      window._electron_bridge.ipcRenderer.send('openExternal', target.href);
    }
  }
}, false);
