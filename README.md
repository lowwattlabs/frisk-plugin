# Frisk — OpenClaw Plugin

Pre-install security audit and vulnerability scanner for ClawHub skills.

## Install

```bash
npm i -g @lowwattlabs/frisk
openclaw plugins install clawhub:@lowwattlabs/frisk-audit
```

## Tools

- **frisk** — Run security audit on a ClawHub skill slug or local path

## Requirements

- Frisk CLI binary (`frisk`) — install via npm or download from [GitHub Releases](https://github.com/lowwattlabs/frisk/releases)
- Default binary path: `/usr/local/bin/frisk`

## Configuration

```json
{
  "frisk": {
    "binaryPath": "/usr/local/bin/frisk",
    "allowExternal": true
  }
}
```

- `binaryPath`: Absolute path to the frisk binary. Defaults to `/usr/local/bin/frisk` (not PATH-resolved).
- `allowExternal`: Allow network operations (threat intel sync, remote repo cloning). Default: `false`.

## Network Disclosures

- `frisk sync` connects to external threat intel feeds (CISA KEV, Feodo, EPSS, etc.). Blocked unless `allowExternal: true`.
- `frisk --slug <slug>` clones public Git repositories. Blocked unless `allowExternal: true`.
- Binary is resolved from absolute path to prevent PATH hijacking.

## Links

- **GitHub**: https://github.com/lowwattlabs/frisk
- **npm**: https://www.npmjs.com/package/@lowwattlabs/frisk
- **ClawHub**: https://clawhub.ai/lowwattlabs/frisk-audit

## License

MIT-0
