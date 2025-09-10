const assert = require('assert');
const translations = require('../en-US.js');

describe('en-US translations', function() {
  it('should have correct translation for "启动失败"', function() {
    assert.strictEqual(translations['启动失败'], 'failed');
  });

  it('should have correct translation for "系统提示"', function() {
    assert.strictEqual(translations['系统提示'], 'System infomation');
  });
});
