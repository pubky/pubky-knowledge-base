---
aliases:
  - "../Pubky-Core/Authentication"
---

Pubky uses decentralized authentication where users control their own cryptographic keys. There are no central identity providers.

## Key Concepts

- **Authenticator**: Any software or hardware capable of [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) signing, such as [[PubkyRing|Pubky Ring]].
- **Capabilities**: Permissions defining what an app can access (e.g., `/pub/pubky.app/:rw` has read and write permissions for path `/pub/pubky.app`).
- **AuthToken**: A signed, time-limited token granting access to the [[Homeserver|Homeserver]]. Created by the Authenticator, processed by the [[SDK]], and verified by the Homeserver.

## Participants

- **Authenticator**: App holding user's keypair (e.g., [[PubkyRing|Pubky Ring]])
- **3rd Party App**: Application requesting access
- **[[HTTPRelay|HTTP Relay]]**: Forwards encrypted tokens between Ring and the app
- **[[Homeserver|Homeserver]]**: Verifies tokens and issues sessions

## User Flow with Pubky Ring

Apps display a QR code, the user scans it with [[PubkyRing|Pubky Ring]], reviews permissions, and approves. The [[HTTPRelay|HTTP Relay]] securely forwards the encrypted AuthToken back to the app via the `/inbox` endpoint, which then exchanges it with the [[Homeserver|Homeserver]] for a session. Auth tokens are valid for a 3-minute window to account for clock drift and slow connections.

The full protocol specification is documented in the [pubky-core GitHub repository](https://github.com/pubky/pubky-core/blob/main/docs/AUTH.md).

## Relay Security

The [[HTTPRelay|HTTP Relay]] encrypts tokens between the authenticator and the requesting app using a shared `client_secret`. The relay itself only sees encrypted blobs and cannot capture valid auth tokens. Messages are persisted for up to 5 minutes and deleted after retrieval. See [[SecurityModel|Security Model]] for the full trust analysis.

## Current Limitations

1. **Session Cookie Collision**: Currently, all sessions share a single authentication cookie. Logging into App B overwrites App A's session. This is unintended behavior, see [issue #122](https://github.com/pubky/pubky-core/issues/122).

2. **No Key Delegation**: AuthToken must be signed by the user's main key.

## Trust Assumptions

**Key management software must be trusted**: [[PubkyRing|Pubky Ring]] keeps keys out of third-party apps, but apps that handle keys directly must be fully trusted. This is inherent to any self-custody system.

## Session Management Rework (Planned)

The authentication system is being reworked to fix the cookie collision bug and improve multi-app support.
