---
title: "HTTP Relay"
---

HTTP relay service for forwarding encrypted AuthTokens during Pubky [[Authentication|authentication]] flows. Implements the [httprelay.io](https://httprelay.io/) link channel specification.

- **Location**: [`pubky-core/http-relay/`](https://github.com/pubky/pubky-core/tree/main/http-relay)
- **License**: MIT
- **Language**: Rust

## Why a Relay?

In the Pubky Auth flow, a third-party app needs to receive an AuthToken from the user's authenticator ([[PubkyRing|Pubky Ring]]). The challenge:
- The app may be a web page with no backend
- The authenticator is a mobile app
- They need to exchange data without direct connectivity

The relay solves this by providing a temporary rendezvous point where encrypted tokens can be deposited and retrieved.

## How It Works

1. **App generates a client secret** and subscribes to a relay channel (long-poll GET)
2. **App shows QR code** containing `pubkyauth:///?relay=...&secret=...&caps=...`
3. **Ring scans QR**, signs AuthToken, encrypts it with `client_secret`
4. **Ring POSTs** encrypted blob to the relay channel
5. **Relay forwards** to the waiting app, which decrypts using `client_secret`

The relay only ever sees encrypted blobs — it cannot capture valid auth tokens.

See the [pubky-core GitHub docs](https://github.com/pubky/pubky-core/blob/main/docs/AUTH.md) for the full protocol spec and [[Authentication]] for an overview.

## Self-Hosting

The relay is designed to be self-hostable for reduced latency, privacy, and reliability:

```bash
cargo run -p http-relay
```

Apps can specify a custom relay URL via the [[SDK]].

## Known Issues

### Mobile Browser Background Timeout

On mobile browsers, HTTP long-poll connections get cut when the app is backgrounded (e.g., when user switches to camera to scan QR), causing login to hang or fail intermittently.

**Proposed fix**: Reduce long-poll timeout to 25 seconds maximum with continuous client retry. This is a top priority fix.

## Related Components

- **[[PubkyRing|Pubky Ring]]**: The authenticator that sends tokens through the relay
- **[[SDK|Pubky SDK]]**: Client library that subscribes to relay channels
- **[[Homeserver|Pubky Homeserver]]**: Verifies tokens and issues sessions
