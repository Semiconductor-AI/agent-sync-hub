# MCP adapter compatibility

MCP defines a wire protocol, not one portable configuration-file schema.
Agent Sync Hub must parse a source entry into a canonical model and render it
with a target-specific adapter. Native entries must never be copied verbatim
between different agents.

| Agent | Native location / shape | HTTP discriminator | Toggle field |
| --- | --- | --- | --- |
| Claude Code | `~/.claude.json` → `mcpServers` | `type: "http"` | none per entry |
| Codex | `~/.codex/config.toml` → `mcp_servers` | URL implies HTTP | `enabled` |
| Qoder CLI | `~/.qoder/settings.json` → `mcpServers` | `http` / `streamable-http` | `disabled` |
| ZCode | `~/.zcode/cli/config.json` → `mcp.servers` | `http` / `sse` | `enable` |
| Grok | `~/.grok/config.toml` → `mcp_servers` | URL implies remote | `enabled` (local client) |
| Kimi Code CLI | `~/.kimi/mcp.json` → `mcpServers` | `transport: "http"` | none documented |
| MiniMax Code | `~/.minimax/mcp/mcp.json` → `mcpServers` | `streamable-http` | `enabled` |
| WorkBuddy | client-specific JSON | portable core only | `disabled` (local client) |

Primary references:

- [Claude Code MCP](https://code.claude.com/docs/en/mcp)
- [Codex configuration reference](https://developers.openai.com/codex/config-reference/)
- [Qoder CLI MCP reference](https://docs.qoder.com/cli/mcp-reference)
- [ZCode MCP](https://zcode.z.ai/cn/docs/mcp-services)
- [Grok MCP servers](https://docs.x.ai/build/features/mcp-servers)
- [Kimi Code CLI MCP](https://moonshotai.github.io/kimi-code/en/customization/mcp.html)
- [MiniMax Code plugins](https://github.com/MiniMax-AI/MiniMax-Code-Plugins)

WorkBuddy does not currently publish a stable standalone MCP file schema. Its
adapter is intentionally restricted to the portable fields verified in the
installed client. Unsupported fields and unknown targets fail loudly; callers
must record the failure and leave the destination unchanged.

