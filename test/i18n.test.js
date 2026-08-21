const test = require('node:test');
const assert = require('node:assert/strict');
const { normalize, translate } = require('../src/i18n');

test('normalizes Chinese locales and defaults other locales to English', () => {
  assert.equal(normalize('zh-Hans-CN'), 'zh-CN');
  assert.equal(normalize('en-US'), 'en');
});

test('provides equivalent dynamic status messages in both languages', () => {
  assert.equal(translate('en', 'agentsDetected', 3), '3 agents detected');
  assert.equal(translate('zh-CN', 'agentsDetected', 3), '已发现 3 个 Agent');
});
