---
title: "Homeserver"
aliases:
  - "../Pubky-Core/Homeserver"
---

The Pubky network allows multiple, independent data stores, known as "Homeservers." This improves [[Censorship|censorship-resistance]] and prevents any single entity from controlling the flow of information, or locking people & data in as a walled garden.

Homeservers are meant to represent a primary place to retrieve data from a specific [[0.Introduction|PKARR]] public key, but the user can redefine the location of their homeserver at will by updating their [[0.Introduction|PKARR]] record in the [[MainlineDHT|Mainline DHT]].

## Architecture

The homeserver implementation consists of several components: the main HTTP API server (supporting both ICANN HTTP and Pubky TLS), an admin server, a Prometheus metrics server, and republishers that keep user and server keys alive on the DHT.

See the [repository](https://github.com/pubky/pubky-core/tree/main/pubky-homeserver) for API details and configuration.

## Public vs Private Data

Current implementations only support public, unencrypted data. Encrypted data and guarded (access-controlled) data are planned — see [[SecurityModel|Security Model]] for the trust implications.

## Event Stream

Homeservers expose event streams for clients to sync data changes:

- `GET /events/` — Paginated event feed (cursor-based, 1000 events per batch)
- `GET /events-stream` — Server-Sent Events (SSE) real-time stream

Used by clients like [[PubkyBackup|Pubky Backup]] to stay in sync. Note: the SSE broadcast channel is per-instance, so horizontal scaling requires architectural changes (e.g., Redis pub/sub).

## Transport Security

Pubky hosts use **PubkyTLS** for transport security (TLS with Raw Public Keys, RFC 7250). ICANN hosts use standard X.509 TLS. See [[SecurityModel|Security Model]] for details.

## User Data Control and Credible Exit

- The current network is being bootstrapped by Synonym's first Homeserver — over time, more independent homeserver operators and Pubky applications are needed for the network to fully decentralize
- Anyone can run their own homeserver and set their own terms
- Homeserver operators can use [[Homegate]] for signup verification, implementing SMS or Lightning Network verification to prevent spam while preserving user privacy
- For true [[CredibleExit|credible exit]], users should maintain local backups via [[PubkyBackup|Pubky Backup]]. Homeserver mirroring is planned but not yet implemented
- Users can migrate to a new homeserver at any time by moving their data and updating their [[0.Introduction|PKARR]] record

See [[SecurityModel|Security Model]] for the full trust analysis and failure recovery scenarios.

## Running a Homeserver

> **Note:** Production deployment guides are not yet available. Easy deployment packages (Umbrel, apt, docker, start9) are planned.

For local development and testing:

```bash
cargo run -p pubky-homeserver
```

To spin up an ephemeral testnet:

```bash
cargo run -p pubky-testnet
```
