# Context for Knowledge Base Updates

## Primary Reference
- **Braindump**: https://github.com/pubky/pubky-core-braindump-jan2026/
  - Contains up-to-date technical documentation for all pubky-core components
  - Use this as the source of truth for current implementation details

## Roadmap
- **2026 Roadmap**: `/home/gcom/Downloads/Pubky-Core-Roadmap-2026.csv`

## Repository References
When not confident, consult these repositories:

| Repository | Purpose |
|------------|---------|
| https://github.com/pubky/pubky-core | Core repo (homeserver, SDK, http-relay, pkarr-republisher) |
| https://github.com/pubky/workshop | Workshop based on newest pubky SDK |
| https://github.com/pubky/franky | Newest version of pubky.app |
| https://github.com/pubky/pubky-ring | Mobile app for identity management and key storage |
| https://github.com/pubky/pubky-nexus | Indexer that indexes homeservers for pubky.app |
| https://github.com/pubky/pubky-explorer | A pubky app |
| https://github.com/pubky/pubky-docker | Docker deployments |
| https://github.com/pubky/pubky-moderation | Moderation for pubky.app |
| https://github.com/pubky/homegate | Anti-bot measure for homeserver protection |
| https://github.com/pubky/pubky-app-specs | Data model specifications |
| https://github.com/pubky/mainline | Interface to mainline DHT |
| https://github.com/pubky/pubky-crypto | Crypto utilities |
| https://github.com/pubky/pubky-locks | New project (not very relevant for now) |
| https://github.com/pubky/paykit-rs | New project (not very relevant for now) |
| https://github.com/pubky/pubky-cli | CLI for interacting with homeservers |
| https://github.com/pubky/pkdns | DNS server for public key domains |
| https://github.com/pubky/pubky-tls-proxy | TLS proxy |

## Key Documentation Links
- **Authentication spec**: https://github.com/pubky/pubky-core/blob/main/docs/AUTH.md
- **PKARR churn research**: https://github.com/pubky/pkarr-churn/blob/main/results-node_decay.md

## Guidelines
- Prefer linking over duplicating documentation
- Use Quartz wiki-link syntax: `[[Page|Display Text]]`
- Always use "the Mainline DHT" with article
- Verify claims against actual source code when uncertain
