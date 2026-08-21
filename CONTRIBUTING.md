# Contributing

Thank you for helping improve Agent Sync Hub.

1. Search existing issues before opening a new one.
2. For a new agent adapter or write capability, open a design issue first.
3. Create a focused branch and include tests for success and failure paths.
4. Run `npm run check` before opening a pull request.
5. Never include local configuration, API keys, access tokens, absolute personal paths, cache files, or captured prompts.

Pull requests that add write behavior must document containment checks, ownership rules, backup format, validation, and rollback. Empty responses, invalid JSON, missing required fields, and partial failures must be surfaced explicitly.

By contributing, you agree that your contribution is licensed under MIT.
