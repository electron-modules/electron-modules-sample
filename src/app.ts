import url from 'url';
import WindowManager from 'electron-windows';
import { app as electronApp, dialog } from 'electron';
import { __i18n } from './preload';

electronApp.whenReady()
  .then(() => {
  })
  .catch(() => {
    dialog.showErrorBox(__i18n('系统提示'), __i18n('启动失败'));
  });
