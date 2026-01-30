# How Pubky Compares to Other Protocols

Understanding how Pubky differs from other decentralized and federated protocols.

---

## Quick Comparison Table

| Feature | Pubky | Nostr | Bluesky | Farcaster | IPFS |
|---------|-------|-------|---------|-----------|------|
| **Identity Model** | Self-sovereign keys (Ed25519) | Self-sovereign keys (Schnorr) | DIDs + handles | Ethereum addresses | Content-addressed |
| **Storage** | Homeservers (HTTP) | Relays (WebSocket) | Personal Data Servers | Hubs (P2P) | IPFS nodes (DHT) |
| **Discovery** | Mainline DHT (10M+ nodes) | Relay lists | DID directory (centralized) | On-chain registry | IPFS DHT |
| **Data Mutability** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No (content-addressed) |
| **Censorship Resistance** | 🟢 High | 🟡 Medium | 🔴 Low | 🟡 Medium | 🟢 High |
| **Blockchain Requirement** | ❌ No | ❌ No | ❌ No | ✅ Yes (Optimism) | ❌ No |
| **Transaction Fees** | ❌ None | ❌ None | ❌ None | ✅ Gas fees | ❌ None |
| **Always-Online Requirement** | 🟡 Partial (homeservers) | 🟡 Partial (relays) | ❌ No (PDSs) | 🟡 Partial (hubs) | ✅ Yes (for hosting) |
| **Mobile-Friendly** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | 🟡 Limited |
| **Data Portability** | ✅ Full | ✅ Full | 🟡 Partial | 🟡 Partial | ✅ Full |
| **Maturity** | 🚧 Beta | ✅ Production | ✅ Production | ✅ Production | ✅ Production |

Legend: ✅ Yes | ❌ No | 🟡 Partial | 🟢 High | 🔴 Low | 🚧 Work in Progress

---

## Detailed Comparisons

### Pubky vs Nostr

**What They Have in Common:**
- Self-sovereign cryptographic identity
- No blockchain or transaction fees
- Data portability through key ownership
- Open protocol and implementations

**Key Differences:**

| Aspect | Pubky | Nostr |
|--------|-------|-------|
| **Storage Model** | Homeservers (HTTP/HTTPS) | Relays (WebSocket) |
| **Discovery** | Mainline DHT (15+ years proven) | Relay lists (client-configured) |
| **Data Structure** | Key-value store (files) | Event stream (signed messages) |
| **Homeserver Discovery** | Automatic via PKARR → DHT | Manual relay configuration |
| **Always-Online** | Not required (homeservers) | Relays must stay online |
| **Semantic Tagging** | Built-in (Semantic Social Graph) | Application-level |
| **API Protocol** | RESTful HTTP | WebSocket subscriptions |
| **Scalability** | Proven DHT infrastructure | Relay-dependent |

**When to Choose Pubky:**
- Need censorship-resistant discovery (DHT-based)
- Want familiar HTTP/REST APIs
- Building apps requiring mutable file storage
- Need semantic social graph features

**When to Choose Nostr:**
- Want real-time event streaming
- Prefer WebSocket-based architecture
- Ecosystem maturity matters (more clients/relays)
- Simpler relay model appeals to you

---

### Pubky vs Bluesky (AT Protocol)

**What They Have in Common:**
- User data portability
- Federation-capable architecture
- Personal data servers
- Social media focus

**Key Differences:**

| Aspect | Pubky | Bluesky |
|--------|-------|---------|
| **Identity** | Public keys (truly self-sovereign) | DIDs + DNS handles (hybrid) |
| **Discovery** | Mainline DHT (decentralized) | DID directory (centralized) |
| **Account Portability** | Automatic (update PKARR) | Requires DID transfer |
| **Handle System** | Optional vanity names | DNS-based handles required |
| **Infrastructure Control** | User chooses homeserver | Bluesky PBC controls directory |
| **Censorship Resistance** | High (DHT-based) | Low (centralized components) |
| **Data Format** | Flexible key-value | Lexicon-based schemas |
| **Current State** | Beta | Production |

**Key Concern with Bluesky:**
- **Centralization**: DID directory (plc.directory) is controlled by Bluesky PBC
- **Single point of failure**: If the directory is compromised, identity resolution breaks
- **Governance**: Protocol changes controlled by one entity

**When to Choose Pubky:**
- True self-sovereignty is critical
- No dependence on centralized services
- Prefer proven DHT technology
- Building for censorship-resistant use cases

**When to Choose Bluesky:**
- Want production-ready ecosystem now
- Large existing user base matters
- Familiar with ActivityPub/federation
- DNS-based handles are important

---

### Pubky vs Farcaster

**What They Have in Common:**
- Decentralized social protocol
- User-controlled data
- Multiple client support

**Key Differences:**

| Aspect | Pubky | Farcaster |
|--------|-------|-----------|
| **Identity** | Off-chain (key pairs) | On-chain (Ethereum addresses) |
| **Registration** | Free (generate keys) | Paid (on-chain transaction) |
| **Storage** | Homeservers (HTTP) | Hubs (P2P gossip) |
| **Fees** | None | Gas fees on Optimism |
| **Blockchain** | None | Optimism L2 required |
| **Scalability** | HTTP server scale | Hub network scale |
| **Discovery** | Mainline DHT | On-chain registry |
| **Complexity** | Simpler (no chain) | More complex (chain + hubs) |

**Trade-offs:**

**Pubky Advantages:**
- No blockchain dependency
- No transaction fees
- Simpler architecture
- Faster onboarding (instant key generation)

**Farcaster Advantages:**
- On-chain identity verification
- Ethereum ecosystem integration
- Stronger identity guarantees
- Production maturity

**When to Choose Pubky:**
- Want to avoid blockchain complexity
- No transaction fees requirement
- Prefer HTTP-based architecture
- Need fastest possible onboarding

**When to Choose Farcaster:**
- Ethereum integration is valuable
- On-chain verification important
- Already in crypto ecosystem
- Production maturity required

---

### Pubky vs IPFS

**What They Have in Common:**
- Decentralized data storage
- Content distribution
- No central authority

**Key Differences:**

| Aspect | Pubky | IPFS |
|--------|-------|------|
| **Primary Focus** | Mutable identity + data | Immutable content distribution |
| **Addressing** | Identity-first (public keys) | Content-first (CIDs) |
| **Mutability** | Native (update anytime) | Requires IPNS or external pointers |
| **Use Case** | Applications with identity | Content delivery and archival |
| **Data Model** | Key-value (per user) | Merkle DAG (content) |
| **Discovery** | Mainline DHT (identity) | IPFS DHT (content) |
| **Always-Online** | No (homeservers persist) | Yes (to host your content) |
| **Update Mechanism** | Direct (PUT/DELETE) | Republish with new CID |

**Complementary Technologies:**
Pubky and IPFS can work together:
- Store large immutable content on IPFS
- Reference IPFS CIDs in Pubky homeserver data
- Use Pubky for identity, IPFS for content delivery

**When to Choose Pubky:**
- Building identity-centric applications
- Need mutable user data
- Want simple HTTP APIs
- Social/collaboration apps

**When to Choose IPFS:**
- Content immutability is critical
- Building CDN or archival system
- Deduplication important
- Large file distribution

---

## Architecture Comparison

### Data Flow Comparison

**Pubky:**
```
User Key → PKARR (DHT) → Homeserver → HTTP API → Apps
```

**Nostr:**
```
User Key → Relay List → Relays (WebSocket) → Apps
```

**Bluesky:**
```
DID → Directory → PDS → Lexicon API → Apps
```

**Farcaster:**
```
Ethereum Address → On-chain Registry → Hubs (P2P) → Apps
```

### Trust Model Comparison

| Protocol | Trust Requirement |
|----------|------------------|
| **Pubky** | Trust homeserver for availability (not integrity) |
| **Nostr** | Trust relays for availability (not integrity) |
| **Bluesky** | Trust Bluesky PBC for DID directory |
| **Farcaster** | Trust Optimism L2 and hub operators |
| **IPFS** | Trust no one (content-addressed) |

---

## Migration Paths

### Moving to Pubky From...

**From Nostr:**
- Export event history
- Convert to Pubky data format
- Publish to homeserver
- Update discovery to PKARR

**From Bluesky:**
- Export PDS data
- Generate Pubky keys
- Migrate posts/profile
- Publish PKARR record

**From Centralized Platforms:**
- Export data (if available)
- Create Pubky identity
- Import and republish content
- Announce migration

---

## Ecosystem Maturity

| Protocol | Launch Year | Status | Notable Apps |
|----------|-------------|--------|--------------|
| **Pubky** | 2024 | Beta | Pubky App |
| **Nostr** | 2020 | Production | Damus, Amethyst, Primal |
| **Bluesky** | 2023 | Production | Bluesky Social |
| **Farcaster** | 2021 | Production | Warpcast |
| **IPFS** | 2015 | Production | Brave, Opera, many apps |

---

## Common Misconceptions

### "Pubky is just another Nostr"
**False**: While both use keys for identity, Pubky uses HTTP homeservers and Mainline DHT for discovery, not relays and manual configuration.

### "Bluesky is decentralized like Pubky"
**Partial**: Bluesky has decentralized data servers but centralized identity (DID directory controlled by Bluesky PBC).

### "Farcaster is more secure because it uses blockchain"
**Nuanced**: Blockchain provides different guarantees, not inherently more security. Pubky's cryptographic signatures provide strong integrity without fees.

### "IPFS can do everything Pubky does"
**False**: IPFS is content-addressed and immutable. Pubky is identity-addressed and mutable. Different use cases.

---

## Bottom Line: Choose Based on Your Needs

**Choose Pubky if:**
- ✅ Self-sovereignty without compromise is critical
- ✅ Censorship resistance is a top priority
- ✅ You want proven, scalable infrastructure (Mainline DHT)
- ✅ No blockchain dependency is important
- ✅ HTTP/REST APIs are preferred
- ✅ Building social/collaborative applications
- ✅ Fast-growing ecosystem

**Choose Nostr if:**
- ✅ Real-time event streaming is core to your app
- ✅ Existing ecosystem maturity matters now
- ✅ WebSocket-based architecture fits your needs
- ✅ Want maximum client/relay options today

**Choose Bluesky if:**
- ✅ Need production-ready ecosystem immediately
- ✅ Federation model familiar from Mastodon
- ✅ DNS-based handles are important
- ✅ Okay with some centralized components

**Choose Farcaster if:**
- ✅ Ethereum ecosystem integration valuable
- ✅ On-chain verification important
- ✅ Transaction fees acceptable
- ✅ Already in crypto ecosystem

**Choose IPFS if:**
- ✅ Content immutability is required
- ✅ Building CDN or archival system
- ✅ Content-addressed data model fits
- ✅ Deduplication is valuable

---

## See Also

- **[[index|Main Documentation]]**: Complete Pubky knowledge base
- **[[Getting Started]]**: Get started with Pubky
- **[[FAQ]]**: Frequently asked questions
- **[[The vision of Pubky|Vision]]**: Why we're building Pubky
- **[[Explore/Pubky Core/Introduction|Pubky Core]]**: Technical overview

