# Agent Sync Hub

[English](README.md) | [简体中文](README.zh-CN.md)

Agent Sync Hub is a local-first desktop control plane for discovering and, in later releases, safely synchronizing skills, MCP servers, hooks, and shared memory across coding agents.

The public `0.1.x` line is intentionally read-only. It scans known agent directories on the user's computer and builds a local availability matrix. Nothing is uploaded, and it never edits agent configuration.

The desktop interface automatically follows the system language and can be switched between English and Simplified Chinese at any time.

## Downloads

Tagged releases are built by GitHub Actions for:

- Windows x64 — NSIS `.exe`
- Windows ARM64 — NSIS `.exe`
- macOS Intel — `.dmg` and `.zip`
- macOS Apple Silicon — `.dmg` and `.zip`

Unsigned preview builds may trigger operating-system warnings. Code signing and notarization are tracked separately because they require maintainer certificates.

## Run from source

Requirements: Node.js 22 or newer.

```bash
npm ci
npm start
```

Run the tests and syntax checks:

```bash
npm run check
```

## Security model

- Read-only inventory in the first public release.
- Electron renderer runs with context isolation, sandboxing, and no Node integration.
- A strict Content Security Policy blocks remote scripts and network connections.
- Symbolic-link directories are not traversed by the scanner.
- Runtime state, backups, environment files, and signing keys are excluded from Git.
- Empty or malformed scanner results fail visibly; no silent `{}` fallback represents success.

See [SECURITY.md](SECURITY.md), [PRIVACY.md](PRIVACY.md), and [ROADMAP.md](ROADMAP.md).

## Contributing

Bug reports, adapter proposals, documentation improvements, and platform testing are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT License. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
