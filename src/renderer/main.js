'use strict';

document.querySelectorAll('[data-action]').forEach(elem => {
  elem.addEventListener('click', () => {
    const action = elem.getAttribute('data-action');
    window._electron_bridge.ipcRenderer.send('start-action', action);
  });
});

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
