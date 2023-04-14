'use strict';

class MainApp {
  constructor() {
    this.perfboardElemContainer = document.querySelector('#perf-board');
    this.init();
  }

  init() {
    this.initPFSBoard();
    this.bindEvents();
  }

  initPFSBoard() {
    const { Timer, FPSBoard, MemoryStats } = window.monitor;
    const stats = new MemoryStats({
      containerWidth: 120,
    });
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';
    this.perfboardElemContainer.appendChild(stats.domElement);
    const fpsBoard_1 = new FPSBoard({
      container: this.perfboardElemContainer,
      containerStyles: {
        position: 'absolute',
        right: 120,
      },
    });
    const timer = new Timer();
    timer.update(() => {
      fpsBoard_1.tick();
      stats.update();
    });
    timer.start();
  }

  bindEvents() {
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
  }
}

window.mainApp = new MainApp();
