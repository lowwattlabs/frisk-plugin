# Frisk

Pre-install security audit and vulnerability scanner for ClawHub skills — scan by slug or local path, 9 threat intel sources, 7 checks.

## Tools

| Tool | Description |
|------|-------------|
| `frisk` | Run security audit on a ClawHub skill slug or local path |

## Requirements

- Frisk CLI: install via `npm i -g @lowwattlabs/frisk` or download from [GitHub Releases](https://github.com/lowwattlabs/frisk/releases)
- Default binary path: `/usr/local/bin/frisk`

## Network Disclosures

- Threat intel sync (`frisk sync`) connects to external feeds (CISA KEV, Feodo, EPSS, etc.) over the internet. Blocked by default unless `allowExternal: true` is set in config.
- Remote repo cloning (`--slug`) clones public Git repositories. Blocked by default unless `allowExternal: true` is set.
- Binary resolved from absolute path, not PATH, to prevent hijacking.

## Configuration

```json
{
  "frisk": {
    "binaryPath": "/usr/local/bin/frisk",
    "allowExternal": true
  }
}
```

## Who is this for?

Anyone installing skills or plugins from ClawHub who wants to vet them before running. Frisk catches malware, dependency vulnerabilities, credential leaks, hidden instructions, and supply-chain risks — 9 intel sources, 7 autonomous checks, one command.
