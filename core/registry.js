const os = require('node:os');
const path = require('node:path');

const home = os.homedir();
const platform = process.platform;
const homePath = (...parts) => path.join(home, ...parts);

const agents = [
  {key: 'claude', label: 'Claude Code', color: '#d97757', homes: [homePath('.claude')], skills: [homePath('.claude', 'skills')]},
  {key: 'codex', label: 'Codex', color: '#7c6cff', homes: [homePath('.codex')], skills: [homePath('.codex', 'skills')]},
  {key: 'agents', label: 'Shared Agents', color: '#32c991', homes: [homePath('.agents')], skills: [homePath('.agents', 'skills')]},
  {key: 'qoder', label: 'Qoder', color: '#38bdf8', homes: [homePath('.qoder')], skills: [homePath('.qoder', 'skills')]},
  {key: 'workbuddy', label: 'WorkBuddy', color: '#f0b429', homes: [homePath('.workbuddy')], skills: [homePath('.workbuddy', 'skills')]}
];

module.exports = { agents, platform };

