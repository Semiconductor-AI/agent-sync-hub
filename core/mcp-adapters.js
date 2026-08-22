'use strict';

// MCP is a protocol, not a common configuration-file format.  This module is
// deliberately fail-closed: callers must render through a target adapter and
// must never copy a native entry directly between agents.
class McpAdapterError extends Error {}

const KNOWN = new Set([
  'type', 'transport', 'command', 'args', 'env', 'cwd', 'url', 'headers',
  'http_headers', 'env_http_headers', 'bearer_token_env_var',
  'startup_timeout_sec', 'tool_timeout_sec', 'timeout', 'description',
  'disabled', 'enabled', 'enable', 'configured', 'builtin', 'trust'
]);

function transportOf(config) {
  let value = String(config.transport || config.type || '').toLowerCase().replaceAll('_', '-');
  if (!value) value = config.command ? 'stdio' : config.url ? 'http' : '';
  if (value === 'streamable-http') return 'http';
  if (['stdio', 'http', 'sse'].includes(value)) return value;
  throw new McpAdapterError(`Unsupported MCP transport: ${value || 'missing'}`);
}

function canonicalize(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new McpAdapterError('MCP config must be a non-empty object');
  }
  const unknown = Object.keys(config).filter((key) => !KNOWN.has(key));
  if (unknown.length) throw new McpAdapterError(`No safe conversion for fields: ${unknown.sort().join(', ')}`);
  const transport = transportOf(config);
  const out = {transport};
  for (const key of ['command', 'args', 'env', 'cwd', 'url', 'description']) {
    if (Object.hasOwn(config, key)) out[key] = structuredClone(config[key]);
  }
  const headers = structuredClone(config.headers || config.http_headers || {});
  for (const [name, envName] of Object.entries(config.env_http_headers || {})) headers[name] = `\${${envName}}`;
  if (config.bearer_token_env_var) {
    if (headers.Authorization) throw new McpAdapterError('Conflicting bearer_token_env_var and Authorization header');
    headers.Authorization = `Bearer \${${config.bearer_token_env_var}}`;
  }
  if (Object.keys(headers).length) out.headers = headers;
  if (Object.hasOwn(config, 'startup_timeout_sec')) out.startupTimeoutSec = config.startup_timeout_sec;
  if (Object.hasOwn(config, 'tool_timeout_sec')) out.toolTimeoutSec = config.tool_timeout_sec;
  if (Object.hasOwn(config, 'timeout')) out.timeoutMs = config.timeout;
  if (transport === 'stdio' && !out.command) throw new McpAdapterError('stdio config is missing command');
  if (transport !== 'stdio' && !out.url) throw new McpAdapterError(`${transport} config is missing url`);
  return out;
}

function rejectEnvHeaders(canonical, target) {
  if (Object.values(canonical.headers || {}).some((value) => String(value).includes('${'))) {
    throw new McpAdapterError(`${target} does not have verified request-header environment expansion`);
  }
}

function adaptMcpConfig(target, config) {
  const c = canonicalize(config);
  const out = {};
  for (const key of ['command', 'args', 'env', 'cwd', 'url', 'description']) {
    if (Object.hasOwn(c, key)) out[key] = structuredClone(c[key]);
  }

  if (target === 'codex') {
    const literal = {}, envHeaders = {};
    for (const [name, value] of Object.entries(c.headers || {})) {
      const bearer = /^Bearer \$\{([A-Za-z_][A-Za-z0-9_]*)\}$/i.exec(String(value));
      const env = /^\$\{([A-Za-z_][A-Za-z0-9_]*)\}$/.exec(String(value));
      if (name.toLowerCase() === 'authorization' && bearer) out.bearer_token_env_var = bearer[1];
      else if (env) envHeaders[name] = env[1];
      else literal[name] = value;
    }
    if (Object.keys(literal).length) out.http_headers = literal;
    if (Object.keys(envHeaders).length) out.env_http_headers = envHeaders;
    if (c.startupTimeoutSec !== undefined) out.startup_timeout_sec = c.startupTimeoutSec;
    if (c.toolTimeoutSec !== undefined) out.tool_timeout_sec = c.toolTimeoutSec;
    return out;
  }

  if (target === 'grok') {
    if (c.headers) out.headers = structuredClone(c.headers);
    if (c.startupTimeoutSec !== undefined) out.startup_timeout_sec = c.startupTimeoutSec;
    if (c.toolTimeoutSec !== undefined) out.tool_timeout_sec = c.toolTimeoutSec;
    return out;
  }

  if (target === 'qoder') {
    out.type = c.transport === 'stdio' ? 'stdio' : c.transport === 'sse' ? 'sse' : 'streamable-http';
    rejectEnvHeaders(c, target);
    if (c.headers) out.headers = structuredClone(c.headers);
    if (c.startupTimeoutSec !== undefined) throw new McpAdapterError('qoder has no startup_timeout_sec equivalent');
    if (c.toolTimeoutSec !== undefined) out.timeout = Number(c.toolTimeoutSec) * 1000;
    else if (c.timeoutMs !== undefined) out.timeout = c.timeoutMs;
    return out;
  }

  if (['claude', 'workbuddy', 'minimax', 'zcode', 'kimi'].includes(target)) {
    if (target !== 'claude') rejectEnvHeaders(c, target);
    if (target === 'kimi') {
      if (c.transport !== 'stdio') out.transport = c.transport;
    } else {
      out.type = c.transport === 'http' && target === 'minimax' ? 'streamable-http' : c.transport;
    }
    if (c.headers) out.headers = structuredClone(c.headers);
    if (c.startupTimeoutSec !== undefined || c.toolTimeoutSec !== undefined) {
      throw new McpAdapterError(`${target} has no verified equivalent for Codex timeouts`);
    }
    if (c.timeoutMs !== undefined && target === 'minimax') out.timeout = c.timeoutMs;
    return out;
  }
  throw new McpAdapterError(`No MCP adapter registered for target: ${target}`);
}

const toggleField = Object.freeze({
  claude: null, codex: 'enabled', workbuddy: 'disabled', qoder: 'disabled',
  minimax: 'enabled', zcode: 'enable', grok: 'enabled', kimi: null
});

module.exports = {McpAdapterError, canonicalize, adaptMcpConfig, toggleField};

