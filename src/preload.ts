'use strict';

import locale from 'easy-i18n-cli/src/locale';
import enObj from '../en-US';

export const __i18n = locale({
  en: enObj,
  useEn: () => true,
});
