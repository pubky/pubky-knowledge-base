---
title: "HTTP Relay"
---

HTTP relay service for forwarding encrypted AuthTokens during Pubky [[Authentication|authentication]] flows.

- **GitHub**: [`pubky/pubky-http-relay`](https://github.com/pubky/pubky-http-relay)
- **Default endpoint**: `https://httprelay.pubky.app/inbox`
- **License**: MIT
- **Language**: Rust

## Why a Relay?

In the Pubky Auth flow, a third-party app needs to receive an AuthToken from the user's authenticator ([[PubkyRing|Pubky Ring]]). The challenge:
- The app may be a web page with no backend
- The authenticator is a mobile app
- They need to exchange data without direct connectivity

The relay solves this by providing a temporary rendezvous point where encrypted tokens can be deposited and retrieved.

## How It Works

Since v0.7.0, the relay uses the `/inbox` endpoint (replacing the previous `/link` channel):

1. **App generates a client secret** and starts long-polling the relay inbox channel
2. **App shows QR code** containing `pubkyauth:///?relay=...&secret=...&caps=...`
3. **Ring scans QR**, signs AuthToken, encrypts it with `client_secret`
4. **Ring POSTs** encrypted blob to the relay inbox
5. **App retrieves** the message via long-poll GET, decrypts using `client_secret`, and acknowledges via DELETE

The `/inbox` endpoint persists messages server-side for up to 5 minutes. The producer can verify delivery via `/ack` and `/await` sub-endpoints.

The relay only ever sees encrypted blobs — it cannot capture valid auth tokens.

See the [pubky-core GitHub docs](https://github.com/pubky/pubky-core/blob/main/docs/AUTH.md) for the full protocol spec and [[Authentication]] for an overview.

### Migration from /link to /inbox

The previous `/link` channel used synchronous producer/consumer pairing. The new `/inbox` channel is more reliable and fixes connectivity issues reported by users. The SDK auto-dispatches: if a relay URL ends with `/link`, the old approach is used; otherwise the `/inbox` approach is used.

## Self-Hosting

The relay is designed to be self-hostable for reduced latency, privacy, and reliability. Use the [`pubky-http-relay`](https://github.com/pubky/pubky-http-relay) crate as a dependency in your Rust project.

Apps can specify a custom relay URL via the [[SDK]].

## Related Components

- **[[PubkyRing|Pubky Ring]]**: The authenticator that sends tokens through the relay
- **[[SDK|Pubky SDK]]**: Client library that subscribes to relay channels
- **[[Homeserver|Pubky Homeserver]]**: Verifies tokens and issues sessions
