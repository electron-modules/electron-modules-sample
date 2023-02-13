import { ipcMain, dialog } from 'electron';

export default class App {
  init() {
    this.isWin = process.platform === 'win32';
    require('./window-manager')(this);
    this.bindIPC();
  }

  alertWindows() {
    dialog.showErrorBox('error', 'only windows');
  }

  bindIPC() {
    const { isWin } = this;
    ipcMain.on('start-action', (_, action) => {
      if (action === 'electrom') {
        require('./electrom')(this);
      } else if (action === 'electron-windows') {
        require('./multi-windows')(this);
      } else if (action === 'electron-updator') {
        require('./updator')(this);
      } else if (action === 'electron-webview-schedule') {
        require('./webview-schedule')(this);
      } else if (action === 'electron-windows-titlebar') {
        if (isWin) {
          require('./windows-titlebar')(this);
          return;
        }
        this.alertWindows();
      } else if (action === 'network-interface') {
        if (isWin) {
          require('./network-interface')(this);
          return;
        }
        this.alertWindows();
      } else if (action === 'windows-verify-trust') {
        if (isWin) {
          require('./windows-verify-trust')(this);
          return;
        }
        this.alertWindows();
      }
    });
  }
}
