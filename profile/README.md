# cyber-uni

Agent plugins that work across harnesses. Each plugin installs on Claude Code,
Cursor, Codex, and GitHub Copilot CLI from one package.

| Plugin | Does |
| --- | --- |
| `cyberfleet` | Directs the work: ships, missions, and the Council view. |
| `cyberlegion` | Runs agent sessions and lets them reach each other, with no server. |
| `cyber-mux` | Drives terminal multiplexer panes. |
| `sdd` (repo `cyber-sdd`, also ships `aced` and `quill`) | Spec-driven development: a change process that keeps each repository settled. |
| `cyber-agentkit` | Harness detection and queries, plugin dependency checks, layered reference documents, and worktree leases. |
| `cyber-asana`, `cyber-figma` | Connectors to the tools a team already uses. |
| `research-workbench` | Structured, multi-source research. |
| `universal-plugin` | Builds one plugin for every harness from one manifest. |

Install from the marketplace: `/plugin marketplace add cyber-uni/marketplace`, then
`/plugin install <plugin>@cyber-uni`.

**Moving in.** The plugins keep their names. `cyber-agentkit` already lives in
[cyber-uni](https://github.com/cyber-uni); the rest are moving here from
[cyberuni](https://github.com/cyberuni) and keep shipping from their old home until each one lands.

**Read more:** [cyber-uni.github.io](https://cyber-uni.github.io) covers the
architecture, each component's status, and the
[decisions](https://cyber-uni.github.io/decisions/) behind this organization.
