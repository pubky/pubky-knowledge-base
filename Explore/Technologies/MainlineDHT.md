---
title: "Mainline DHT"
aliases:
  - "Mainline-DHT"
---

Mainline [[DHT]] is a standard Distributed Hash Table (DHT) implementation widely used in the BitTorrent network, based on the [Kademlia](https://en.wikipedia.org/wiki/Kademlia) protocol. This decentralized system allows for efficient data storage and retrieval across a vast network of nodes, making it highly resilient and scalable.

Pubky uses Mainline DHT as the foundation for [[0.Introduction|PKARR]] (Public Key Addressable Resource Records), enabling decentralized identity and discovery without central authorities.

## Key Features

- **Decentralization**: It operates without a central authority, enhancing its resilience against failures and [[Censorship|censorship]].
- **Scalability**: It can easily scale to accommodate more data and users by adding more nodes to the network.
- **Efficiency**: By distributing data across multiple nodes, Mainline DHT provides fast access to data without the need for a central server.
- **Proven Track Record**: 15+ years of production use in the BitTorrent network with an estimated 10 million nodes worldwide
- **Ephemeral Storage**: Records stored via [BEP44](https://www.bittorrent.org/beps/bep_0044.html) are temporary and require periodic republishing
- **Security Extensions**: Implements [BEP42](https://www.bittorrent.org/beps/bep_0042.html) security measures and Sybil attack resistance

## How Pubky Uses Mainline DHT

### Identity Resolution
When you access a public key domain (e.g., `pubky://o4dksfbqk85ogzdb5osziw6befigbuxmuxkuxq8434q89uj56uyy`):
1. [[PKDNS]] queries Mainline DHT for that public key
2. DHT returns signed [[0.Introduction|PKARR]] records
3. Records contain homeserver URLs and other DNS-style resource records
4. Your client can now connect to the user's homeserver

### Data Lifecycle
- **Publishing**: Users sign DNS packets and publish to DHT (directly or via relay)
- **Caching**: Clients and relays cache records extensively to minimize DHT traffic
- **Republishing**: Records [expire after a few hours](https://github.com/pubky/pkarr-churn/blob/main/results-node_decay.md) and must be republished by users, friends, or service providers
- **Discovery**: Popular records may be kept alive by DNS servers as they receive queries

## Technical Implementation

Pubky's Mainline DHT client is implemented in Rust with:
- **Client Mode**: Query and store values without accepting incoming requests
- **Server Mode**: Act as a routing/storing node, contributing to network capacity
- **Adaptive Mode**: Start as client, upgrade to server after 15 minutes if publicly accessible

### Supported BEPs (BitTorrent Enhancement Proposals)
- **[BEP 5](https://www.bittorrent.org/beps/bep_0005.html)**: Core DHT Protocol
- **[BEP 42](https://www.bittorrent.org/beps/bep_0042.html)**: DHT Security Extension
- **[BEP 43](https://www.bittorrent.org/beps/bep_0043.html)**: Read-only DHT Nodes
- **[BEP 44](https://www.bittorrent.org/beps/bep_0044.html)**: Storing Arbitrary Data in the DHT

## Applications

- **BitTorrent Network**: Mainline DHT adds tracker capabilities to each peer in the BitTorrent network, enhancing its resilience and reducing dependency on centralized trackers.
- **Pubky Identity System**: Enables self-sovereign public key domains without DNS registrars
- **[[PKDNS]]**: DNS resolution for public key domains via DHT lookups
- **Peer-to-Peer File Sharing**: Beyond BitTorrent, DHTs like Mainline are used for instant messaging, name resolution, and other peer-to-peer applications.

## Why Mainline DHT?

From the PKARR project's perspective, Mainline DHT was chosen because:
1. **Proven at Scale**: Largest DHT in existence with ~10 million nodes
2. **Battle-Tested**: 15 years facilitating trackerless torrents worldwide
3. **Generous Retention**: Mutable data retention reduces republishing frequency
4. **Wide Support**: Implementations in most languages, well-understood by experts
5. **No Bootstrap Required**: Leverage existing infrastructure instead of building new networks

## Security Considerations

- **Not a Storage Platform**: Records are ephemeral and will be dropped without regular republishing
- **Not Realtime**: Records are heavily cached; updates may take time to propagate
- **Sybil Resistance**: Implementation includes measures against Vertical Sybil Attacks
- **Rate Limiting**: Server operators should implement custom rate limiting for DoS protection

## Links

- **Implementation**: [github.com/pubky/mainline](https://github.com/pubky/mainline) - Rust DHT client/server
- **API Documentation**: [docs.rs/mainline](https://docs.rs/mainline/latest/mainline/)
- **Examples**: [github.com/pubky/mainline/tree/main/examples](https://github.com/pubky/mainline/tree/main/examples)
- **Wikipedia**: [Mainline DHT](https://en.wikipedia.org/wiki/Mainline_DHT)
- **Kademlia Protocol**: [Wikipedia](https://en.wikipedia.org/wiki/Kademlia)

## Related Documentation

- [[0.Introduction|PKARR]] - Public Key Addressable Resource Records built on Mainline DHT
- [[PKDNS]] - DNS server that resolves public key domains via DHT queries
- [[DHT]] - General Distributed Hash Table concepts
