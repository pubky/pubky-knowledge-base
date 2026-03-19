---
title: "Homeserver"
aliases:
  - "../Pubky-Core/Homeserver"
---

The Pubky network allows multiple, independent data stores, known as "Homeservers." This improves [[Censorship|censorship-resistance]] and prevents any single entity from controlling the flow of information, or locking people & data in as a walled garden.

Homeservers are meant to represent a primary place to retrieve data from a specific [[0.Introduction|PKARR]] public key, but the user can redefine the location of their Homeserver at will by updating their [[0.Introduction|PKARR]] record in the [[MainlineDHT|Mainline DHT]].

## Architecture

The Homeserver implementation consists of several components: the main HTTP API server (supporting both ICANN HTTP and Pubky TLS), an admin server, a Prometheus metrics server, and republishers that keep user and server keys alive on the DHT.

See the [repository](https://github.com/pubky/pubky-core/tree/main/pubky-homeserver) for API details and configuration.

## Public vs Private Data

Current implementations only support public, unencrypted data. Encrypted data and guarded (access-controlled) data are planned — see [[SecurityModel|Security Model]] for the trust implications.

## Event Stream

Homeservers expose event streams for clients to sync data changes:

- `GET /events-stream` — SSE real-time stream with user and path filters. Primary event API, used by clients to subscribe to specific users on third-party homeservers without processing unwanted traffic
- `GET /events/` — Paginated event feed for all users on the homeserver (cursor-based, 1000 events per batch)


## Transport Security

Homeservers expose two endpoints: a PubkyTLS endpoint (TLS with Raw Public Keys, RFC 7250) and an ICANN HTTP endpoint intended to sit behind a reverse proxy with standard X.509 TLS.

Native Pubky clients connect via PubkyTLS; browsers and legacy clients connect via the ICANN domain. See [[SecurityModel#Transport Security|Transport Security]] for details.

## User Data Control and Credible Exit

- The current network is being bootstrapped by Synonym's first Homeserver — over time, more independent Homeserver operators and Pubky applications are needed for the network to fully decentralize
- Anyone can run their own Homeserver and set their own terms
- Homeserver operators can use [[Homegate]] for signup verification, implementing SMS or Lightning Network verification to prevent spam while preserving user privacy
- For true [[CredibleExit|credible exit]], users should maintain local backups via [[PubkyBackup|Pubky Backup]]. Homeserver mirroring is planned but not yet implemented
- Users can migrate to a new Homeserver at any time by moving their data and updating their [[0.Introduction|PKARR]] record

See [[SecurityModel|Security Model]] for the full trust analysis and failure recovery scenarios.

## Running a Homeserver

> **Note:** Production deployment guides are not yet available. Easy deployment packages (Umbrel, apt, docker, start9) are under development.

For local development and testing:

```bash
cargo run -p pubky-homeserver
```

To spin up an ephemeral testnet:

```bash
cargo run -p pubky-testnet
```

### Embedded Postgres

Since v0.7.0, the testnet supports an optional embedded Postgres mode via the `embedded-postgres` feature flag. This allows fully self-contained test environments without requiring an external database:

```bash
cargo run -p pubky-testnet --features embedded-postgres
```

The examples use embedded Postgres by default. For programmatic use:

```rust
use pubky_testnet::EphemeralTestnetBuilder;

let testnet = EphemeralTestnetBuilder::new()
    .with_embedded_postgres()
    .build()
    .await?;
```
