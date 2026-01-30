Pubky uses decentralized authentication where users control their own cryptographic keys. There are no central identity providers.

## Key Concepts

- **Authenticator**: Any software or hardware capable of [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519) signing, such as [Pubky Ring](https://github.com/pubky/pubky-ring).
- **Capabilities**: Permissions defining what an app can access (e.g., `/pub/pubky.app/:rw`).
- **AuthToken**: A signed, time-limited token granting access to the [[Homeservers|Homeserver]]. Created by the Authenticator, processed by the SDK, and verified by the Homeserver.

## User Flow with Pubky Ring

Apps display a QR code, the user scans it with Pubky Ring, reviews permissions, and approves. The full flow is documented in [AUTH.md](https://github.com/pubky/pubky-core/blob/main/docs/AUTH.md).

## Current Limitations

- **Single session per app**: Logging into App B overwrites App A's session. This is unintended behavior, see [issue #122](https://github.com/pubky/pubky-core/issues/122).
- **No key delegation**: AuthToken must be signed by the user's main key.
