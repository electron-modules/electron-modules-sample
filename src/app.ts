import { ipcMain } from 'electron';

export default class App {
  init() {
    this.initWindowsManager();
    this.bindIPC();
  }

  initWindowsManager() {
    require('./window-manager')(this);
  }

  initElectrom() {
    require('./electrom')(this);
  }

  bindIPC() {
    ipcMain.on('start-action', (_, action) => {
      if (action === 'electrom') {
        this.initElectrom();
      } else if (action === 'electron-windows') {

      } else if (action === 'electron-updator') {
        require('./updator')(this);
      }
    });
  }
}
