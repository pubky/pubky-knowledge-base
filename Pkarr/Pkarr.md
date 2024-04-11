## Public-Key Addressable Resource Records

Pkarr is a revolutionary system that bridges the gap between the Domain Name System ([[DNS]]) and peer-to-peer overlay networks. It allows self-issued public keys to function as sovereign, publicly addressable domains. This means that anyone with a private key can have a domain that is accessible to everyone.

The core idea is to streamline the process of publishing and resolving resource records for keys, leveraging the Distributed Hash Table ([[DHT]]) for efficient and scalable data distribution.

## Key Features

- **Simplicity**: Pkarr streamlines the integration between [[DNS]] and peer-to-peer networks.
- **Sovereignty**: Public keys can be used as domains, enabling users to maintain control over their digital identities.
- **Accessibility**: The system is designed to be accessible to anyone capable of maintaining a private key.
- **Scalability and Resilience**: Designed with scalability and resilience in mind, using the [[Mainline DHT]] for storing ephemeral data, and employing caching strategies to minimize [[DHT]] traffic.
- **Compatibility with Existing Applications**: Supports existing applications through [[DNS]] over [[HTTPS]] ([[DoH]]) queries to Pkarr servers, ensuring broad compatibility.

## How It Works

1. **Publishing Records**: To publish resource records for a key, create a small encoded [[DNS]] packet (<= 1000 bytes), sign it, and publish it on the DHT. This can be done directly or through a relay if necessary.
2. **Resolving Records**: To find resources associated with a key, applications can query the [[DHT]] directly or through a relay, verifying the signature themselves.
3. **Fallback for Existing Applications**: Applications unaware of Pkarr can make normal [[DNS]] Queries over [[HTTPS]] (DoH) to Pkarr servers, ensuring accessibility.
4. **Caching and Republishing**: Both clients and Pkarr servers cache records extensively to improve scalability. The [[DHT]] drops records after a few hours, necessitating periodic republishing to keep records alive.

For more technical details on Pkarr's architecture and how it works, refer to the [[Architecture]] note.

## Getting Started

[To start using Pkarr](Getting%20Started%20with%20Pkarr.md), you can visit the [web app demo](https://app.pkarr.org) or explore the Rust examples provided in [Pkarr repository](https://github.com/Nuhvi/pkarr/).
