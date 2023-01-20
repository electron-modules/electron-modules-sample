import { ipcMain } from 'electron';

export default class App {
  init() {
    require('./window-manager')(this);
    this.bindIPC();
  }

  bindIPC() {
    ipcMain.on('start-action', (_, action) => {
      if (action === 'electrom') {
        require('./electrom')(this);
      } else if (action === 'electron-windows') {
        require('./multi-windows')(this);
      } else if (action === 'electron-updator') {
        require('./updator')(this);
      } else if (action === 'electron-webview-schedule') {
        require('./webview-schedule')(this);
      }
    });
  }
}
