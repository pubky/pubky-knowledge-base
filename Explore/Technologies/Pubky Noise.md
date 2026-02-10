# Pubky Noise: Encrypted Communication Protocol (Work in Progress)

> ⚠️ **NOTE**: Pubky Noise is currently under active development and is **NOT production-ready**. The protocol implementation is subject to changes and improvements.

## Overview

Pubky Noise is a Noise Protocol implementation designed specifically for the Pubky ecosystem. It provides encrypted, authenticated communication channels for peer-to-peer applications built on Pubky.

## What is the Noise Protocol?

The Noise Protocol Framework is a modern cryptographic framework for building secure communication protocols. It's used by WhatsApp, WireGuard, and other high-security applications.

**Key Properties:**
- Forward secrecy
- Mutual authentication
- Minimal round-trips
- Simple, auditable implementation
- Resistance to replay attacks

## Pubky Noise Implementation

Pubky Noise adapts the Noise Protocol for use with Pubky's [[Key Pair|Ed25519 identity keys]], providing seamless integration with the Pubky ecosystem.

### Handshake Pattern

Pubky Noise uses the **IK (Interactive, Known responder)** handshake pattern:

1. **Initiator → Responder**: Initiator's ephemeral key + encrypted static key
2. **Responder → Initiator**: Responder's ephemeral key + encrypted response
3. **Both**: Derive shared secret and establish encrypted channel

This three-step handshake provides:
- Mutual authentication (both parties verify each other)
- Forward secrecy (compromise of long-term keys doesn't reveal past messages)
- Minimal latency (only 1.5 round-trips)

### Key Features (Work in Progress)

**Cryptographic Primitives:**
- **X25519**: Elliptic curve Diffie-Hellman key exchange
- **ChaCha20-Poly1305**: Authenticated encryption with associated data (AEAD)
- **BLAKE2b**: Cryptographic hash function
- **HKDF**: Key derivation from Ed25519 to X25519

**Transport Support:**
- TCP connections for server/desktop applications
- WebSocket support for browser applications
- Platform-specific adapters (iOS, Android, Web, CLI)

**Session Management:**
- Persistent sessions with session IDs
- Reconnection support
- Session expiration handling
- Rate limiting per connection

**Integration:**
- Derives encryption keys from Pubky [[Key Pair|Ed25519 identities]]
- Publishes Noise endpoints to [[Homeserver|homeserver]] directories
- Automatic peer discovery via Pubky public keys
- Compatible with [[Paykit|Paykit]] payment protocol

### Security Properties

**Confidentiality:** All messages encrypted end-to-end with ChaCha20-Poly1305

**Authentication:** Both parties cryptographically verified using Pubky identities

**Forward Secrecy:** Ephemeral keys protect past communications

**Replay Protection:** Nonce-based message authentication

**Integrity:** Poly1305 MAC prevents message tampering

## Use Cases

### Payment Negotiation
[[Paykit|Paykit]] uses Pubky Noise for private payment coordination:
- Exchange payment requests securely
- Share sensitive payment details (invoices, addresses)
- Coordinate subscription agreements
- Receipt exchange and verification

### Private Messaging (Potential)
While not yet implemented, Pubky Noise could support:
- Direct messages between Pubky users
- Group messaging with multiple participants
- File transfer over encrypted channels
- Voice/video call signaling

### Secure Data Exchange (Potential)
- Private content sharing
- Encrypted file storage coordination
- API authentication and authorization
- Cross-device synchronization

## Architecture

### Endpoint Discovery

Noise endpoints are published to homeservers at:
```
/pub/paykit.app/v0/noise
```

This public endpoint contains:
- Host address (IP or domain)
- Port number
- Public key for encryption
- Transport type (TCP, WebSocket)

### Connection Flow

```
1. Client queries homeserver for recipient's Noise endpoint
2. Client initiates connection to endpoint
3. IK handshake establishes encrypted channel
4. Application-specific protocol runs over encrypted channel
5. Session maintained or closed per application needs
```

### Key Derivation

Pubky Noise derives X25519 encryption keys from Ed25519 identity keys (managed by [[Pubky Ring]]):

```
Ed25519 Identity Key (Pubky)
    ↓ (HKDF with context)
X25519 Encryption Key (Noise Protocol)
```

This allows users to use their existing Pubky identity for encrypted communications without managing separate keys. [[Pubky Ring]] handles this derivation automatically when apps request Noise keys.

## Platform Support

### iOS
- Native Swift bindings via UniFFI
- Keychain integration for key storage
- Background session support
- Network state handling

### Android
- Native Kotlin bindings via UniFFI
- EncryptedSharedPreferences for key storage
- Foreground service support
- Network change adaptation

### Web (WASM)
- WebAssembly compilation
- WebSocket transport
- Browser secure storage
- Service worker integration

### CLI/Server
- TCP transport
- File-based session storage
- Long-running server mode
- Comprehensive logging

## Current Status

**Work in Progress:**
- 🚧 Core protocol implementation under development
- 🚧 Platform bindings being refined
- 🚧 Session management improvements
- 🚧 Performance optimization ongoing
- 🚧 Security audit pending

**Testing Integrations:**
- Integrated in [[Paykit|Paykit]] for payment channels
- Testing in Bitkit iOS and Android
- Demo applications available
- Cross-platform compatibility validation

## Technical Specifications

### Message Format
```
[2 bytes: message length]
[N bytes: encrypted payload]
[16 bytes: authentication tag]
```

### Session State
- Sending nonce counter
- Receiving nonce counter
- Shared secret key (ChaCha20)
- Session ID
- Peer public key

### Transport Framing
Messages are length-prefixed and encrypted in sequence, maintaining order and preventing replay.

## Relationship to Pubky Core

Pubky Noise is a **communication layer** for Pubky:
- Uses Pubky identity system (Ed25519 keys)
- Publishes endpoints to [[Homeserver|homeservers]]
- Integrates with Pubky discovery mechanisms
- Enables private peer-to-peer protocols on top of public Pubky infrastructure

## Security Considerations

### Threat Model
- **Man-in-the-Middle**: Prevented by authenticated handshake
- **Replay Attacks**: Prevented by nonce counters
- **Eavesdropping**: Prevented by encryption
- **Impersonation**: Prevented by key authentication

### Not Protected Against
- **Traffic Analysis**: Connection metadata is visible
- **Denial of Service**: Rate limiting helps but doesn't fully prevent
- **Key Compromise**: If private keys are stolen, future communications are vulnerable

### Best Practices
- Rotate sessions periodically
- Use platform-native secure storage
- Implement rate limiting
- Monitor for unusual connection patterns
- Validate peer identities through Pubky social graph

## Future Development

- Enhanced session persistence
- Multi-party encrypted channels
- Transport protocol optimization
- Additional platform support
- Formal security audit
- Performance benchmarking

---

**⚠️ Important**: Do not use Pubky Noise in production applications yet. The implementation is a work in progress and subject to security review and potential breaking changes.

## Links

- **Repository (WIP)**: [https://github.com/BitcoinErrorLog/pubky-noise](https://github.com/BitcoinErrorLog/pubky-noise)
- **Noise Protocol Framework**: [https://noiseprotocol.org/](https://noiseprotocol.org/)

## Related Documentation

- [[Paykit|Paykit]] - Uses Pubky Noise for payment negotiation channels
- [[Pubky Ring|Pubky Ring]] - Manages Noise endpoints and sessions

