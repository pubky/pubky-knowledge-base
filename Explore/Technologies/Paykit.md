# Paykit: Decentralized Payment Protocol (Work in Progress)

> ⚠️ **NOTE**: Paykit is currently under active development and is **NOT production-ready**. The protocol and implementation are subject to significant changes. Integration work in Bitkit serves as a testbed for protocol development.

## Overview

Paykit is a payment protocol (work in progress) built on Pubky that aims to enable payment discovery, negotiation, and coordination across multiple payment methods (Bitcoin onchain, Lightning Network, and potentially others).

## Core Concept

Paykit abstracts payment complexity behind a single, static **Pubky public key**. Your public key becomes a universal payment identifier - recipients would discover your available payment methods by querying your [[Homeserver|homeserver]]'s public directory at `/pub/paykit.app/v0/`.

This enables applications where users pay directly to profiles, offering an intuitive experience when multiple payment methods are possible.

## Proposed Architecture (Under Development)

### Three-Layer System

1. **Public Directory Layer** (`paykit-lib`)
   - Publish payment methods to Pubky homeservers
   - Discover methods from other users' public keys
   - Public read access for discovery

2. **Interactive Payment Layer** (`paykit-interactive`)
   - Encrypted channels using **[[PubkyNoise|Pubky Noise]]** for private negotiation
   - Receipt exchange and payment coordination
   - End-to-end encrypted communication

3. **Subscription & Automation Layer** (`paykit-subscriptions`)
   - Recurring payment agreements with cryptographic signatures
   - Auto-pay rules with spending limits
   - Payment request system with expiration

## Key Features (In Development)

### Payment Method Discovery
Query any Pubky identity to discover their available payment methods (onchain, Lightning, or custom).

### Encrypted Payment Negotiation
Private channels for payment coordination using **[[PubkyNoise|Pubky Noise]]**, a Noise Protocol (IK pattern) implementation built for the Pubky ecosystem. This avoids revealing payment details publicly.

**Pubky Noise** provides:
- End-to-end encrypted communication channels
- Three-step IK handshake for secure connections
- WebSocket and TCP transport support
- Integration with Pubky identity system

### Subscriptions & Recurring Payments
- Cryptographically signed subscription agreements
- Flexible billing frequencies (daily, weekly, monthly, yearly)
- Auto-pay with configurable spending limits
- Replay protection via nonce tracking

### Security Model (Evolving)
**Sealed Blob v1 Encryption**: Sensitive data on public Pubky paths is encrypted:
- Payment requests encrypted to recipient's Noise public key
- Subscription proposals/agreements encrypted per-party
- X25519 ECDH + HKDF-SHA256 + ChaCha20-Poly1305
- Prerequisite: Noise endpoint published at `/pub/paykit.app/v0/noise`

See **[[PubkyNoise|Pubky Noise]]** for details on the encrypted channel implementation.

## Current Implementation Status

**Current Version**: 1.0.1 (Work in Progress)
- 🚧 Core library under development
- 🚧 Interactive protocol (WIP)
- 🚧 Subscription system (WIP)
- 🚧 Security model evolving
- 🚧 Protocol specification in flux
- 🚧 Integration testing in Bitkit (iOS/Android)

### Demo Applications
- **CLI**: Command-line reference implementation (WIP)
- **Web**: WebAssembly browser demo
- **iOS Demo**: SwiftUI prototype with Keychain storage
- **Android Demo**: Jetpack Compose prototype

### Testing Integrations
- **Bitkit iOS**: Protocol testing integration (~80 files)
- **Bitkit Android**: Protocol testing integration (~97 files)
- **[[PubkyRing|Pubky Ring]]**: Identity and key management integration

## Potential Use Cases (Future)

### Direct Peer Payments
Pay directly to profiles using Pubky identity without requesting addresses or invoices.

### Content Monetization
- Paywalls for content
- Tip jars for creators
- Micropayments for API access

### Subscription Services
- Magazine subscriptions
- SaaS billing
- Recurring donations

### E-Commerce
- Online store checkouts
- Marketplace payments
- Service bookings

## Technical Details (Subject to Change)

### Storage Paths
- Payment methods: `/pub/paykit.app/v0/{methodId}` (public)
- Noise endpoint: `/pub/paykit.app/v0/noise` (public)
- Payment requests: `/pub/paykit.app/v0/requests/{id}` (encrypted)
- Subscriptions: `/pub/paykit.app/v0/subscriptions/*` (encrypted)

### Supported Payment Methods (Planned)
- **onchain**: Bitcoin on-chain addresses
- **lightning**: BOLT11 invoices, LNURL-pay, Lightning addresses
- **Custom**: Extensible to other methods (under consideration)

### Key Management
- **Ed25519**: Identity signing and verification
- **X25519**: Noise Protocol key exchange
- Derived from same seed via HKDF ([[PubkyRing|Pubky Ring]] integration)

## Relationship to Pubky Core

Paykit is designed as a **layer 2 protocol** on top of Pubky Core:
- Uses Pubky homeservers for storage
- Leverages Pubky's public key identity system
- Integrates with Pubky's DHT-based discovery
- Extends Pubky with payment-specific functionality

## Development Status & Roadmap

- ⏳ Protocol specification stabilization
- ⏳ Security audit and hardening
- ⏳ Cross-platform testing and validation
- ⏳ Production deployment planning
- ⏳ Interoperability testing
- ⏳ Performance optimization

## Related Research

**Atomicity Protocol** - Peer-to-peer mutual credit system research exploring trust-based payment routing using Pubky's [[SemanticSocialGraph|Semantic Social Graph]]. Designed as settlement infrastructure for credit issuance and transfer across economic scales from peer-to-peer to institutional banking. Currently in research phase.

## Resources

- **Repository (WIP Fork)**: [github.com/BitcoinErrorLog/paykit-rs](https://github.com/BitcoinErrorLog/paykit-rs)
- **Documentation**: [paykit-rs/docs/](https://github.com/BitcoinErrorLog/paykit-rs/tree/main/docs) (In development)
- **Protocol Spec**: [PAYKIT_PROTOCOL_V0.md](https://github.com/BitcoinErrorLog/paykit-rs/blob/main/docs/PAYKIT_PROTOCOL_V0.md) (Draft)
- **Bitkit iOS (WIP Testing)**: [github.com/BitcoinErrorLog/bitkit-ios](https://github.com/BitcoinErrorLog/bitkit-ios)
- **Bitkit Android (WIP Testing)**: [github.com/BitcoinErrorLog/bitkit-android](https://github.com/BitcoinErrorLog/bitkit-android)
- **[[PubkyRing|Pubky Ring]] (Identity Manager)**: See dedicated page for identity and key management

---

**⚠️ Important**: Do not use Paykit for production applications. The protocol is a work in progress and subject to breaking changes.
