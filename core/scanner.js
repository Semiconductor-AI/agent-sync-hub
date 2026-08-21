const fs = require('node:fs');
const path = require('node:path');
const { agents, platform } = require('./registry');

function safeDirectoryNames(directory) {
  try {
    return fs.readdirSync(directory, {withFileTypes: true})
      .filter(entry => entry.isDirectory() && !entry.isSymbolicLink())
      .map(entry => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    if (error && error.code === 'ENOENT') return [];
    throw new Error(`Cannot scan ${path.basename(directory)}: ${error.message}`);
  }
}

function scanAgents() {
  const rows = agents.map(agent => {
    const installed = agent.homes.some(folder => fs.existsSync(folder));
    const skills = [...new Set(agent.skills.flatMap(safeDirectoryNames))];
    return {key: agent.key, label: agent.label, color: agent.color, installed,
      skillCount: skills.length, skills};
  });
  return {platform, arch: process.arch, scannedAt: new Date().toISOString(), agents: rows};
}

module.exports = { safeDirectoryNames, scanAgents };

