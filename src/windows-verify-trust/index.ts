'use strict';

import { isLibExist, getLibPath, verifyTrust } from 'windows-verify-trust';


module.exports = (app: any) => {
  const targetFileName = 'wlanapi.dll';
  console.log('isLibExist: %b', isLibExist(targetFileName));
  console.log('getLibPath: %s', getLibPath(targetFileName));
  console.log('verifyTrust: %s', verifyTrust(targetFileName));
};
