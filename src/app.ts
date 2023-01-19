import url from 'url';
import path from 'path';
import WindowManager from 'electron-windows';

export default class App {
  windowManager = new WindowManager();

  init() {
    this.initWindows();
  }

  initWindows() {
    const rendererDir = path.resolve(__dirname, 'renderer');
    const loadingUrl = url.format({
      pathname: path.resolve(rendererDir, 'loading.html'),
      protocol: 'file:',
    });
    const mainUrl = url.format({
      pathname: path.resolve(rendererDir, 'main.html'),
      protocol: 'file:',
    });
    const preload = path.resolve(rendererDir, 'preload.js');

    const mainWindow = this.windowManager.create({
      name: 'main',
      loadingView: {
        url: loadingUrl,
      },
      browserWindow: {
        webPreferences: {
          enableRemoteModule: false,
          nodeIntegration: false,
          webSecurity: true,
          webviewTag: true,
          preload,
        },
      },
      openDevTools: false,
    });
    mainWindow.loadURL(mainUrl);
  }
}
