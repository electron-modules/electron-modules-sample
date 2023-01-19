import url from 'url';
import WindowManager from 'electron-windows';
import { app as electronApp, dialog } from 'electron';
import { __i18n } from './preload';
import App from './app';

electronApp.whenReady()
  .then(() => {
    const app = new App();
    app.init();
  })
  .catch(() => {
    dialog.showErrorBox(__i18n('系统提示'), __i18n('启动失败'));
  });
