'use strict';

import networkInterface from 'network-interface';

module.exports = (app: any) => {
  networkInterface.addEventListener('wlan-status-changed', (error, data) => {
    if (error) {
      throw error;
      return;
    }
    console.log('event fired: wlan-status-changed');
    console.log(data);
  });
};
