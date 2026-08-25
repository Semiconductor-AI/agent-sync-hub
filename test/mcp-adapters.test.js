const test = require('node:test');
const assert = require('node:assert/strict');
const {adaptMcpConfig, toggleField} = require('../core/mcp-adapters');

test('Qoder receives its native streamable-http spelling', () => {
  const result = adaptMcpConfig('qoder', {
    type: 'streamable_http', url: 'https://example.test/mcp', disabled: true
  });
  assert.equal(result.type, 'streamable-http');
  assert.equal(Object.hasOwn(result, 'disabled'), false);
});

test('Codex receives native HTTP auth fields and no type discriminator', () => {
  const result = adaptMcpConfig('codex', {
    type: 'http', url: 'https://example.test/mcp',
    headers: {Authorization: 'Bearer ${MCP_TOKEN}'}
  });
  assert.equal(result.bearer_token_env_var, 'MCP_TOKEN');
  assert.equal(Object.hasOwn(result, 'type'), false);
});

test('unsafe Codex-only auth conversion to Qoder fails closed', () => {
  assert.throws(() => adaptMcpConfig('qoder', {
    url: 'https://example.test/mcp', bearer_token_env_var: 'MCP_TOKEN'
  }), /verified request-header environment expansion/);
});

test('unknown targets never receive raw configuration', () => {
  assert.throws(() => adaptMcpConfig('unknown-agent', {command: 'demo'}),
    /No MCP adapter registered/);
});

test('a timeout with no verified target field is rejected, not dropped', () => {
  for (const target of ['claude', 'workbuddy', 'zcode', 'kimi']) {
    assert.throws(() => adaptMcpConfig(target, {
      type: 'http', url: 'https://example.test/mcp', timeout: 30000
    }), /has no verified equivalent for timeout/, `${target} should fail closed`);
  }
});

test('minimax keeps the timeout it has a verified field for', () => {
  const result = adaptMcpConfig('minimax', {
    type: 'http', url: 'https://example.test/mcp', timeout: 30000
  });
  assert.equal(result.timeout, 30000);
});

test('toggle fields are target-specific', () => {
  assert.equal(toggleField.zcode, 'enable');
  assert.equal(toggleField.codex, 'enabled');
  assert.equal(toggleField.qoder, 'disabled');
  assert.equal(toggleField.claude, null);
});

