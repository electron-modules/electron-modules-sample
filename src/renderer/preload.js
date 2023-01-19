'use strict';

import { ipcRenderer, desktopCapturer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld(
  '_electron_bridge',
  {
    send: (channel, args) => {
      ipcRenderer.send(channel, args);
    },
    desktopCapturer,
  }
);
