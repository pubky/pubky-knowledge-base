---
title: "Introduction"
aliases:
  - "../../Pubky-App/Client/Introduction"
---

# Pubky Client

![pubkey-client](Explore/images/pubky-header.png)

The Pubky client is the user-facing application for interacting with the Pubky social network. It is available as a progressive web app (PWA) and will eventually support desktop applications.

## Current Implementation

- **Live Application**: [pubky.app](https://pubky.app) - Production PWA currently operational
- **Backend**: Powered by [[PubkyNexus|Pubky Nexus]] indexing service using Synonym hosted infrastructure
- **Status**: The current client repository is deprecated and being replaced (see Development Status below)

## Development Status

The web client is live at [pubky.app](https://pubky.app).

**For Developers**:
- **Building Compatible Clients**: Use [pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) as the authoritative data model specification
- **Contributing**: Contributions welcome at [github.com/pubky/pubky-app](https://github.com/pubky/pubky-app)

Using the library analogy, the Pubky Client is like a personalized research assistant who takes the prepared documents from the librarian ([[Explore/PubkyApp/Backend/Introduction|backend]]) and creates a customized report just for you. This report is designed to be easy to read and understand, with all the relevant information presented in a clear and concise manner.

- Users are able to take control of the data and exit the Synonym hosted services and run their own without hampering discoverability ([[CredibleExit|credible exit]]).

- Pubky client uses the open [[Explore/PubkyCore/Introduction|Pubky Core]] for nearly all features, allowing users to avoid censorship by choosing self-hosting or alternate hosts without losing followers or integrity. 

- Pubky also includes support for **[[Paykit|paykit]]**, an open payment protocol (work in progress) for coordinating payments among peers supporting various methods. This allows users to potentially create payment flows for familiar experiences.

⚠️ **Note**: Paykit is currently **work in progress** and not production-ready. Integrations in Bitkit (iOS and Android) serve as testbeds for protocol development, not production features. The protocol specification, security model, and implementation are subject to significant changes.

**Planned Paykit Features** (WIP):
- **Pay to profiles**: Send payments to Pubky identities without requesting addresses/invoices
- **Method discovery**: Discover which payment methods someone accepts (onchain, Lightning)
- **Encrypted negotiation**: Private [[PubkyNoise|Pubky Noise]] channels for secure payment coordination
- **Subscriptions**: Cryptographically signed recurring payment agreements
- **Zero custody**: Users always control their keys and funds

Future Pubky app versions may leverage Paykit once it reaches production readiness to enable peer-to-peer data markets, creator monetization, and value exchange throughout the ecosystem.

- Communities facilitate moderation and discovery around shared interests.

