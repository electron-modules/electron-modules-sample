'use strict';

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

function Console() {
  this.textarea = document.createElement('textarea');
  this.log = function(txt, type) {
    if (type) this.textarea.value += type + ' ';
    this.textarea.value += txt + '\n';
  };
  this.error = function(txt) {
    this.log(txt, 'ERROR');
  };
}
window.console = new Console();
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('consoleArea').appendChild(console.textarea);
});

document.querySelector('#add-database').addEventListener('click', () => {
  const dbname = `db-${Date.now()}`;
  const db = new window.Dexie(dbname);
  // Define Database Schema
  db.version(1).stores({
    items: '++id,name,age',
  });
  // Interact With Database
  db.transaction('rw', db.items, async () => {
    // Let's add some data to db:
    await db.items.add({
      name: 'foo',
      age: 25,
    });
    await db.items.add({
      name: 'foo',
      age: 20,
    });
    await db.items.add({
      name: 'bar',
      age: 25,
    });
    const res = await db.items
      .where({
        name: 'foo',
      })
      .toArray();

    console.log('list: ' + JSON.stringify(res));
  }).catch((err) => {
    console.error(err.stack || err);
  });
}, false);

window.Dexie.getDatabaseNames(async (databaseNames = []) => {
  console.log('getDatabaseNames' + JSON.stringify(databaseNames, null, 2));
  for (const dbName of databaseNames) {
    const db = new window.Dexie(dbName);
    console.log(`open db: ${dbName}`);
    await db.open();
    const res = await db.table('items').where(['name']).toArray();
    console.log(res);
  }
});
