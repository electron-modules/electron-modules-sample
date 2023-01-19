'use strict';

document.querySelectorAll('[data-action]').forEach(elem => {
  elem.addEventListener('click', () => {
    const action = elem.getAttribute('data-action');
    window._electron_bridge.send('start-action', action);
  });
});
