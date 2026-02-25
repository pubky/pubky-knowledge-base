---
title: "HTTP Relay"
---

HTTP relay service for forwarding encrypted AuthTokens during Pubky [[Authentication|authentication]] flows. Implements the [httprelay.io](https://httprelay.io/) link channel specification.

- **GitHub**: [`pubky/http-relay`](https://github.com/pubky/http-relay)
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

The relay is designed to be self-hostable for reduced latency, privacy, and reliability. Use the [`http-relay`](https://github.com/pubky/http-relay) crate as a dependency in your Rust project:

```rust
#[tokio::main]
async fn main() {
    let http_relay = http_relay::HttpRelay::builder()
        .http_port(15412)
        .run()
        .await
        .unwrap();

    println!(
        "Running http relay {}",
        http_relay.local_link_url().as_str()
    );

    tokio::signal::ctrl_c().await.unwrap();

    http_relay.shutdown().await.unwrap();
}
```

Apps can specify a custom relay URL via the [[SDK]].

## Related Components

- **[[PubkyRing|Pubky Ring]]**: The authenticator that sends tokens through the relay
- **[[SDK|Pubky SDK]]**: Client library that subscribes to relay channels
- **[[Homeserver|Pubky Homeserver]]**: Verifies tokens and issues sessions
