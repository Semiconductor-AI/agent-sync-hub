const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { safeDirectoryNames, scanAgents } = require('../core/scanner');

test('missing directory is an empty inventory, not a failure', () => {
  assert.deepEqual(safeDirectoryNames(path.join(os.tmpdir(), `missing-${Date.now()}`)), []);
});

test('non-ENOENT scan errors are wrapped, not swallowed', () => {
  const file = path.join(os.tmpdir(), `agent-sync-hub-not-a-dir-${Date.now()}.txt`);
  fs.writeFileSync(file, 'x');
  try {
    assert.throws(() => safeDirectoryNames(file), /^Error: Cannot scan /);
  } finally { fs.rmSync(file, {force: true}); }
});

test('scanner lists directories only and ignores links', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-sync-hub-'));
  try {
    fs.mkdirSync(path.join(root, 'skill-b'));
    fs.mkdirSync(path.join(root, 'skill-a'));
    fs.writeFileSync(path.join(root, 'not-a-skill.txt'), 'x');
    assert.deepEqual(safeDirectoryNames(root), ['skill-a', 'skill-b']);
  } finally { fs.rmSync(root, {recursive: true, force: true}); }
});

test('top-level scanner always returns a complete schema', () => {
  const result = scanAgents();
  assert.ok(result.scannedAt);
  assert.ok(Array.isArray(result.agents));
  for (const agent of result.agents) {
    assert.equal(typeof agent.installed, 'boolean');
    assert.equal(agent.skillCount, agent.skills.length);
  }
});

