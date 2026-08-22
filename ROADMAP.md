# Roadmap

## 0.1 — Safe inventory

- Cross-platform desktop shell and installers.
- Local agent and skill discovery.
- Read-only skill availability matrix.
- CI, release automation, privacy and security documentation.

## 0.2 — Adapter contracts

- Versioned adapter interface: discover, status, plan, apply, rollback, audit.
- Target-aware MCP schema conversion is implemented as a fail-closed contract;
  native entries must never be copied verbatim between different agents.
- The current syntax matrix and primary references are documented in
  [`docs/mcp-adapter-compatibility.md`](docs/mcp-adapter-compatibility.md).
- MCP and hook inventory with secret redaction.
- Capability labels: immediate, next call, next session, restart, unverifiable.

## 0.3 — Transactional synchronization

- Server-generated plans and dry-run by default.
- Ownership proof, path containment, overlap and symlink defenses.
- Atomic backups, manifests, validation, rollback, and durable incident reports.

## 1.0 — Stable public control plane

- Signed installers and macOS notarization.
- Documented compatibility matrix.
- Import/export format with integrity hashes and provenance.
- Accessibility, localization, and external adapter SDK.

Roadmap items are proposals, not promises. Decisions should be discussed in public issues.

