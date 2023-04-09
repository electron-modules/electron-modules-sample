'use strict';

class MainApp {
  constructor() {
    this.perfboardElemContainer = document.querySelector('#perf-board');
    this.SQLiteLogsContainer = document.querySelector('#SQLiteLogs');
    this.IndexedDBLogsContainer = document.querySelector('#IndexedDBLogs');
    this.runOptions = {
      IndexedDB: 'Default',
      SQLite: 'ElectronNative',
    };
    this.logs = {
      IndexedDB: [],
      SQLite: [],
    };
    this.runnerConfig = {
      count: 10 * 10000,
    };
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
      } else if (target.nodeName === 'BUTTON') {
        const type = e.target.getAttribute('data-type');
        this.run(type);
      }
    }, false);
    document.querySelectorAll('form')
      .forEach(form => {
        form.addEventListener('change', (e) => {
          this.runOptions[e.target.name] = e.target.value;
        }, false);
      });
  }

  run(type) {
    const method = `run${type}${this.runOptions[type]}`;
    this.log(type, `type: ${type} options: ${this.runOptions[type]}`);
    this.log(type, `start run: ${method}`);
    this[method]?.(type);
  }

  async runIndexedDBDefault(type) {
    await window.indexedDBHelper.deleteAllIndexedDB();
    const storeName = 'myData1';
    const objectStore = await window.indexedDBHelper.getObjectStore('myDatabase1', 10, storeName);
    const { count } = this.runnerConfig;
    const startTime = Date.now();
    this.log(type, `start time: ${startTime}, count: ${count}`);
    await window.indexedDBHelper.addBatchTestData(objectStore, count);
    const endTime = Date.now();
    this.log(type, `end time: ${endTime}, use ${((endTime - startTime) / 1000).toFixed(2)}s`);
  }

  async runIndexedDBDexie(type) {
    await window.indexedDBHelper.deleteAllIndexedDB();
    const storeName = 'myData1';
    const db = new window.Dexie('myDatabase2');
    db.version(1).stores({
      [storeName]: 'index1, field1',
    });
    const { count } = this.runnerConfig;
    const startTime = Date.now();
    this.log(type, `start time: ${startTime}, count: ${count}`);
    for (let i = 0; i < count; i++) {
      await db[storeName].add({
        index1: `index_${i}`,
        field1: new Array(100).fill('测试').join(''),
      });
      console.log('Data added successfully');
    }
    const endTime = Date.now();
    this.log(type, `end time: ${endTime}, use ${((endTime - startTime) / 1000).toFixed(2)}s`);
  }

  async runSQLiteElectronNative(type) {
    const { count } = this.runnerConfig;
    const startTime = Date.now();
    this.log(type, `start time: ${startTime}, count: ${count}`);
    for (let i = 0; i < count; i++) {
      await window._electron_bridge.addTestData({
        index1: `index_${i}`,
        field1: new Array(100).fill('测试').join(''),
      });
      console.log('Data added successfully');
    }
    const endTime = Date.now();
    this.log(type, `end time: ${endTime}, use ${((endTime - startTime) / 1000).toFixed(2)}s`);
  }

  log(type, content = '') {
    this.logs[type].unshift(content);
    this[`${type}LogsContainer`].innerHTML = this.logs[type].join('\n');
  }
}

window.mainApp = new MainApp();
