'use strict';

window.indexedDBHelper = {
  deleteAllIndexedDB: async function () {
    const dbs = await window.indexedDB.databases();
    for (const db of dbs) {
      console.log('delete db start:', db);
      try {
        const res = await this.deleteDatabase(db.name);
        console.log('delete db success:', res);
      } catch (e) {
        console.log('delete db failed', e);
      }
    }
    return true;
  },
  deleteDatabase: (name) => {
    return new Promise(((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(name);
      request.onsuccess = (event) => {
        resolve(event);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
      request.onblocked = (event) => {
        reject(event.target.error);
      };
    }));
  },
  getObjectStore: (dbName, dbVersion = 1, storeName) => {
    return new Promise(((resolve, reject) => {
      const request = window.indexedDB.open(dbName, dbVersion);
      request.onerror = (event) => {
        reject(event.target.error);
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        console.log('onsuccess', db.version, db.objectStoreNames);
        const objectStore = db.transaction(storeName, 'readwrite')
          .objectStore(storeName);
        resolve(objectStore);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('onupgradeneeded', db.version, db.objectStoreNames);
        let objectStore;
        if (db.objectStoreNames.contains(storeName)) {
          objectStore = db.transaction(storeName, 'readwrite')
            .objectStore(storeName);
        } else {
          objectStore = db.createObjectStore(storeName, {
            autoIncrement: true,
          });
        }
        resolve(objectStore);
      };
    }));
  },
  addBatchTestData: (objectStore, count = 1000) => {
    return new Promise((resolve, reject) => {
      console.time('addBatchTestData');
      for (let i = 1; i <= count; i++) {
        const data = {
          index1: `index_${i}`,
          field1: new Array(100).fill('测试').join(''),
        };
        const request = objectStore.add(data);
        request.onerror = (event) => {
          console.error('Error adding data:', event);
        };
        request.onsuccess = () => {
          console.log('Data added successfully');
        };
      }
      objectStore.transaction.oncomplete = () => {
        console.log('Transaction completed');
        console.timeEnd('addBatchTestData');
        resolve(true);
      };
      objectStore.transaction.onerror = (event) => {
        console.error('Transaction failed:');
        reject(event.target.error);
      };
    });
  },
};
