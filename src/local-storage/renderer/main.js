'use strict';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

class MainApp {
  constructor() {
    this.perfboardElemContainer = document.querySelector('#perf-board');
    this.SQLiteLogsContainer = document.querySelector('#SQLiteLogs');
    this.IndexedDBLogsContainer = document.querySelector('#IndexedDBLogs');
    this.runOptions = {
      IndexedDB: 'Default',
      SQLite: 'ElectronNativeInRenderer',
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

  async runIndexedDBLoveField(type) {
    await window.indexedDBHelper.deleteAllIndexedDB();

    const schemaBuilder = lf.schema.create('todo', 1);
    schemaBuilder.createTable('Item')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('description', lf.Type.STRING)
      .addPrimaryKey(['id']);

    const db = await schemaBuilder.connect();
    db.getSchema().table('Item');

    const { count } = this.runnerConfig;
    const startTime = Date.now();
    this.log(type, `start time: ${startTime}, count: ${count}`);
    for (let i = 0; i < count; i++) {
      const item = db.getSchema().table('Item');
      const row = item.createRow({
        id: i,
        description: new Array(100).fill('测试').join(''),
      });

      await db.insertOrReplace().into(item).values([row]).exec();

      console.log('Data added successfully');
    }
    const endTime = Date.now();
    this.log(type, `end time: ${endTime}, use ${((endTime - startTime) / 1000).toFixed(2)}s`);
  }

  async runSQLiteWASM(type) {
    const sqlPromise = initSqlJs({
      // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
      // You can omit locateFile completely when running in node
      locateFile: () => '../../../node_modules/sql.js/dist/sql-wasm.wasm',
    });

    const dataPromise = fetch('../../../test.sqlite').then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    const db = new SQL.Database(new Uint8Array(buf));

    db.run('DROP TABLE IF EXISTS todo;');
    db.run('CREATE TABLE todo (id int, description varchar);');

    const { count } = this.runnerConfig;
    const startTime = Date.now();
    this.log(type, `start time: ${startTime}, count: ${count}`);
    for (let i = 0; i < count; i++) {
      db.run('INSERT INTO todo VALUES (?,?)', [i, new Array(100).fill('测试').join('')]);
      console.log('Data added successfully');
    }
    const endTime = Date.now();
    this.log(type, `end time: ${endTime}, use ${((endTime - startTime) / 1000).toFixed(2)}s`);
  }

  async runSQLiteWASMInWorker(type) {
    const worker = new Worker('../../../node_modules/sql.js/dist/worker.sql-wasm.js');

    worker.onmessage = () => {
      console.log('Database opened');
      worker.onmessage = event => {
        console.log('Data added successfully');
        if (event.data?.id === 'end') {
          const endTime = Date.now();
          this.log(type, `end time: ${endTime}, use ${((endTime - startTime) / 1000).toFixed(2)}s`);
        }
      };

      worker.postMessage({
        id: 'drop',
        action: 'exec',
        sql: 'DROP TABLE IF EXISTS todo_worker;',
      });

      // create table
      worker.postMessage({
        id: 'init',
        action: 'exec',
        sql: 'CREATE TABLE todo_worker (id int, description varchar);',
      });

      const { count } = this.runnerConfig;
      const startTime = Date.now();
      this.log(type, `start time: ${startTime}, count: ${count}`);
      for (let i = 0; i < count; i++) {
        worker.postMessage({
          id: i,
          action: 'exec',
          sql: 'INSERT INTO todo_worker VALUES ($id, $description)',
          params: { $id: i, $description: new Array(100).fill('测试').join('') },
        });
      }

      // 以 count 结束
      worker.postMessage({
        id: 'end',
        action: 'exec',
        sql: 'select count(*) from todo_worker',
      });
    };

    worker.onerror = e => console.log('Worker error: ', e);

    const buf = await fetch('../../../test.sqlite')
      .then(res => res.arrayBuffer());

    worker.postMessage({
      id: 'open',
      action: 'open',
      buffer: buf,
    });
  }

  async runSQLiteElectronNativeInRenderer(type) {
    const { count } = this.runnerConfig;
    const startTime = Date.now();
    this.log(type, `start time: ${startTime}, count: ${count}`);
    await window._electron_bridge.sqlConnect();
    await window._electron_bridge.sqlExec(
      'run',
      'DROP TABLE IF EXISTS todo_electron_native;',
    );
    await window._electron_bridge.sqlExec(
      'run',
      'CREATE TABLE todo_electron_native (id int, description varchar);',
    );

    for (let i = 0; i < count; i++) {
      await window._electron_bridge.sqlExec(
        'run',
        'INSERT INTO todo_electron_native VALUES (?,?)',
        [i, new Array(100).fill('测试').join('')],
      );
      console.log('Data added successfully');
    }

    // 轮训等待写入完成
    let cnt;
    while (cnt !== count) {
      const res = await window._electron_bridge.sqlExec(
        'get',
        'SELECT count(*) as cnt FROM todo_electron_native',
      );
      if (res.cnt === count) {
        break;
      } else {
        await sleep(50);
      }
    }

    const endTime = Date.now();
    this.log(type, `end time: ${endTime}, use ${((endTime - startTime) / 1000).toFixed(2)}s`);
    // await window._electron_bridge.sqlClose();
  }

  async runSQLiteElectronIPCToMain(type) {
    const { count } = this.runnerConfig;
    const startTime = Date.now();
    this.log(type, `start time: ${startTime}, count: ${count}`);

    await this.connectIpcRenderAsync('sqlite:operate', 'connect', {
      action: 'connect',
    });

    await this.connectIpcRenderAsync('sqlite:operate', 'drop', {
      action: 'exec',
      sqlArgs: ['DROP TABLE IF EXISTS todo_electron_ipc;'],
    });

    await this.connectIpcRenderAsync('sqlite:operate', 'init', {
      action: 'exec',
      sqlArgs: ['CREATE TABLE todo_electron_ipc (id int, description varchar);'],
    });

    for (let i = 0; i < count; i++) {
      // 无法确保已经写入成功，只能发送消息成功
      await this.connectIpcRenderAsync('sqlite:operate', `insert${i}`, {
        action: 'exec',
        sqlArgs: [
          'INSERT INTO todo_electron_ipc VALUES (?,?)',
          [i, new Array(100).fill('测试').join('')],
        ],
      });

      console.log('Data added successfully');
    }

    // 轮训等待写入完成
    let cnt;
    while (cnt !== count) {
      const res = await this.connectIpcRenderAsync('sqlite:operate', 'select_total', {
        action: 'exec',
        operator: 'get',
        sqlArgs: [
          'SELECT count(*) as cnt FROM todo_electron_ipc',
        ],
      }, { needRes: true });
      if (res.cnt === count) {
        break;
      } else {
        await sleep(50);
      }
    }

    const endTime = Date.now();
    this.log(type, `end time: ${endTime}, use ${((endTime - startTime) / 1000).toFixed(2)}s`);

    // await this.connectIpcRenderAsync('sqlite:operate', 'close', {
    //   action: 'close',
    // });
  }

  async connectIpcRenderAsync(channel, msgId, args, options = { needRes: false }) {
    // 直接发送
    if (!options.needRes) {
      window._electron_bridge.ipcRenderer.send(channel, {
        ...args,
        id: msgId,
      });
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      window._electron_bridge.ipcRenderer.on(`${channel}:reply`, (event, { id, result, status, cause }) => {
        if (msgId === id) {
          if (status === 'success') {
            resolve(result);
          } else {
            reject(new Error(cause));
          }
        }
      });

      window._electron_bridge.ipcRenderer.send('sqlite:operate', {
        ...args,
        id: msgId,
      });
    });
  }

  log(type, content = '') {
    this.logs[type].unshift(content);
    this[`${type}LogsContainer`].innerHTML = this.logs[type].join('\n');
  }
}

window.mainApp = new MainApp();
