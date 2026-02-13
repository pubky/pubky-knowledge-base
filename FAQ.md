# Pubky Core - Frequently Asked Questions

## Overview & Philosophy

**Q1. What is Pubky, and why was it developed?**  
Pubky is a new kind of web built on public key domains instead of usernames or rented accounts. Your public key becomes your self-sovereign domain. Pubky uses PKDNS, which runs on the Mainline DHT.

Pubky introduces a semantic social graph driven by tags and trust, not ads and opaque feeds.  
It was created to counter:
- Poisoned algorithms
- Censorship
- Walled gardens and data harvesting

**Q2. Why is Pubky critical for a free-market society?**  
Because it removes gatekeepers by design. Identities are user-owned; hosting/indexing are interchangeable.

**Q3. What's the relationship between Pubky and Slashtags?**  
Slashtags was a previous Synonym project using Hypercore instead of PKDNS and homeservers. It shared similar goals.

**Q4. Is Pubky open source?**  
Yes. Under the MIT license. [View on GitHub](https://github.com/pubky/)

**Q5. What is Pubky Core?**  
[[Explore/PubkyCore/Introduction|Pubky Core]] is the foundational infrastructure for Pubky - an open protocol combining censorship-resistant public-key DNS (PKARR) with conventional web technologies. It includes the protocol specification, a production-ready homeserver implementation, and SDKs in multiple languages (Rust, JavaScript, iOS, Android). See the [[Explore/PubkyCore/Introduction|Pubky Core Overview]] for details.

**Q6. How do I start building on Pubky?**  
Install the [[Explore/PubkyCore/SDK|Pubky SDK]] for your platform (Rust: `cargo add pubky`, JavaScript: `npm install @synonymdev/pubky`), follow the [official documentation](https://pubky.github.io/pubky-core/), and explore the [examples in the repository](https://github.com/pubky/pubky-core/tree/main/examples). The SDK provides client libraries for authentication, data storage, and homeserver interaction.

---

## Architecture & Resolution (PKARR, PKDNS, DHT)

**Q7. What is PKARR?**  
"Public Key Addressable Resource Records" your signed DNS-like records published on the DHT.

**Q8. What is PKDNS?**  
[[PKDNS]] is a DNS server that resolves public key domains by fetching [[0.Introduction|PKARR]] records from the [[MainlineDHT|Mainline DHT]]. It enables self-sovereign, censorship-resistant domain names while still supporting traditional ICANN domains. Anyone can run a PKDNS server or use public instances to access the decentralized web. See [[PKDNS]] for setup guides and publishing instructions.

**Q9. How does Pubky compare to DNS?**  
Pubky replaces ICANN with your public key. You publish and resolve records yourself.

**Q10. What format does PKDNS use?**  
DNS-style RR, signed under your key, shared via the Mainline DHT.

**Q11. Does it support CNAME/SRV/HTTPS indirection?**  
Yes, with caveats, avoid deep/brittle recursion.

**Q12. Are DHTs part of the clearnet?**  
Yes, via UDP. Web browsers require bridges due to lack of raw UDP support.

**Q13. How can browsers interact with the DHT?**  
Via HTTP bridges, resolvers like PKDNS, or native helpers.

**Q14. Do others need PKDNS to connect to Pubky sites?**  
No special setup in the Pubky App. Other apps can use public [[PKDNS]] instances or self-hosted PKDNS resolvers. Many public DNS-over-HTTPS endpoints are available—see the [[PKDNS]] documentation for a list of hosted servers.

---

## Homeservers & Hosting

**Q15. What are homeservers?**  
Regular web servers that host your content. Anyone can run one.

**Q16. Can I run one at home?**  
Yes. You'll need port forwarding or tunneling if behind NAT.

**Q17. How can I explore data on a homeserver?**  
Use [[PubkyExplorer|Pubky Explorer]] ([explorer.pubky.app](https://explorer.pubky.app)), a web-based file browser for public Pubky data. Enter any public key or path (e.g., `pubky://your-key/pub/pubky.app/profile.json`) to browse files and directories stored on homeservers. Features include keyboard navigation, file preview, directory traversal, and shareable URLs.

**Q18. How can I run the complete Pubky stack locally for development?**  
Use [[PubkyDocker|Pubky Docker]], a Docker Compose orchestration that runs the entire Pubky Social stack with one command. It includes PKARR relay, homeserver (with PostgreSQL), Pubky Nexus (with Neo4j and Redis), and the Pubky App frontend—all preconfigured and ready to use. Clone the repository, configure `.env` for testnet or mainnet, and run `docker compose up -d`. Perfect for testing integrations, developing custom frontends, or learning how all components interact. See [[PubkyDocker|Pubky Docker]] for setup instructions.

**Q19. When should I use Pubky Docker vs SDK libraries?**  
Use the SDK libraries ([@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky) for JavaScript, [pubky](https://crates.io/crates/pubky) for Rust) when building applications that interact with Pubky. Only use [[PubkyDocker|Pubky Docker]] if you need to run the full stack locally to experiment with Pubky Nexus, test custom social frontends, debug cross-component issues, or learn the complete architecture. For most app development, the SDK libraries connected to public infrastructure are simpler and faster.

**Q20. How is redundancy handled?**  
Use mirrors in PKARR. Clients pick healthy ones.

**Q21. Does it support load balancing?**  
Yes, for reads. Writes go to a single primary.

**Q22. Can homeservers sign my data?**  
No. Signing is done by the client.

**Q23. How to self-host a homeserver?**
Deploy the package/container, configure HTTPS, publish in PKARR.

**Q24. What are the storage limits?**
Synonym's public homeserver currently has: 1GB per user, 10MB per file. These are temporary limits during beta. Self-hosted homeservers can configure their own limits.

**Q25. Can Pubky integrate with Tor?**  
Yes, via `.onion` endpoints, but it's not yet tested officially.

---

## Identity, Keys & Security

**Q25. How are keys managed?**  
With [[PubkyRing|Pubky Ring]], the identity manager app for Pubky. Pubky Ring is a native mobile app (iOS/Android) that securely manages your pubkys (public keys), handles device sessions, publishes identity via PKARR, and authorizes apps—all without accounts or passwords.

**Q26. Does Pubky support key rotation?**  
Not yet standardized, possible manually via PKARR fallback logic.

**Q27. What if my key is lost or hacked?**  
Migrate to a new key, update PKARR, and alert your graph.

**Q28. Can I use the same seed as Nostr?**  
Yes, but most users prefer separate secrets due to risk.

**Q29. How does identity trust work?**  
No global authority, trust is built through social graph, tags, and interaction.

---

## Publishing, Privacy & Moderation

**Q30. How do I publish content?**  
Host it on a homeserver and link it in your PKARR.

**Q31. Is Pubky suitable for private sharing?**  
Not yet. All current use assumes public content.

**Q32. Where does moderation happen?**  
At the homeserver and indexer level (e.g., [[PubkyNexus|Pubky Nexus]]).

**Q33. What is Pubky Nexus?**  
[[PubkyNexus|Pubky Nexus]] is the production indexing and aggregation service that powers Pubky App. It transforms data from multiple homeservers into a high-performance social graph API with sub-millisecond response times, enabling features like feeds, search, recommendations, and real-time notifications. [Explore the live API](https://nexus.pubky.app/swagger-ui/).

**Q34. Can I run my own Nexus instance?**  
Yes! Nexus is open source and can be self-hosted. This allows organizations to run custom instances with their own content filtering policies, moderation rules, and homeserver selections. See the [[PubkyNexus|Pubky Nexus]] documentation for deployment details.

**Q35. How does Pubky resist spam?**  
Via CAPTCHAs, rate-limits, invites, and graph distance rules.

**Q36. How does Paykit fit in?**
Paykit is a **payment protocol (work in progress)** built on Pubky that aims to enable payment discovery and coordination across multiple methods (Bitcoin, Lightning, etc.). See [[Explore/PubkyApp/Client/Introduction|Client Features]] for the full feature list.

⚠️ **Note**: Paykit is NOT production-ready and the protocol is subject to significant changes.

**Q37. Is Paykit ready for use?**  
No. Paykit is currently a work in progress under active development. The protocol specification, security model, and implementation are all subject to breaking changes. Do not use it for production applications.

**Q38. What payment methods will Paykit support?**  
The initial focus is on Bitcoin on-chain and Lightning Network. The protocol is designed to be extensible to other methods (Liquid, Fedimint, ecash, etc.), but these are not yet implemented or specified.

**Q39. Where is Paykit being tested?**  
Paykit is being integrated into Bitkit (iOS and Android) to validate the protocol design and identify issues before stabilization. These integrations serve as testbeds, not production features.

**Q40. When will Paykit be production-ready?**  
There is no set timeline. Significant work remains on protocol stabilization, security auditing, cross-platform testing, and interoperability validation before Paykit can be recommended for production use.

**Q41. Can Pubky do everything Nostr can?**  
Yes, and more. Pubky includes DHT-based discovery and semantic tagging.

---

## Interoperability, Ecosystem & Onboarding

**Q42. Pubky vs IPFS**  
Pubky is identity-first and mutable; IPFS is content-first and immutable.

**Q43. Pubky vs Nostr**  
Pubky uses homeservers and PKARR for hosting; Nostr uses relays. Pubky has semantic discovery.

**Q44. Pubky vs Bluesky**  
Pubky is key-native and decentralized. Bluesky relies on DID directories and centralized servers.

**Q45. Pubky vs Farcaster**  
Pubky = key-owned + off-chain. Farcaster = chain-anchored + relay-dependent.

**Q46. Will Pubky integrate with other protocols?**  
Bridges are possible, but not currently in development.

**Q47. Are there mobile apps?**  
Yes! 
- **[[PubkyRing|Pubky Ring]]**: Native mobile app (iOS/Android) - Your keychain for the Pubky ecosystem. Manages identities, authorizes apps, and handles sessions. Self-custodial with no accounts required.
- **[Pubky.app](https://pubky.app)**: Progressive Web App (PWA) - Social publishing application
- More apps welcome from the community!

**Q48. What is Pubky Ring?**  
[[PubkyRing|Pubky Ring]] is the key manager app for the Pubky ecosystem. It's a native mobile app (iOS/Android) that securely manages your pubkys (public keys), authorizes applications, manages sessions, and handles key derivation—all self-custodially with no accounts, passwords, or tracking. Think of it as your keychain for decentralized identity.

**Q49. How do users join Pubky App?**  
Homeservers can implement signup verification to prevent spam while preserving privacy. [[Homegate]] is an open-source service that provides two verification methods: SMS codes (rate-limited per phone number) and Lightning Network payments. Homeserver operators can use Homegate, implement custom verification, or allow open signups. See [[Homegate]] for deployment and integration details.

**Q50. Indexer vs Homeserver?**  
- Homeserver = stores user data  
- Indexer = enables search/feeds across homeservers

**Q51. How do I ensure my app is compatible with Pubky App?**  
Follow the [pubky-app-specs](https://github.com/pubky/pubky-app-specs) data model specification. This defines the structure and validation rules for users, posts, tags, bookmarks, follows, and feeds. The spec is available as an [npm package](https://www.npmjs.com/package/pubky-app-specs) (JavaScript/TypeScript) and Rust crates. Note: Currently v0.4.0 in rapid development; v1 will mark the first stable, long-term support version.

**Q52. What's the status of Pubky App development?**
The Pubky App client ([pubky.app](https://pubky.app)) is live and under active development at [github.com/pubky/pubky-app](https://github.com/pubky/pubky-app). Developers building compatible clients should use [pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) (or the [Rust crate](https://crates.io/crates/pubky-app-specs)) as the authoritative specification.

**Q53. Can I contribute to Pubky App?**
Yes! The [pubky-app repository](https://github.com/pubky/pubky-app) is under active development and welcomes contributions. If you want to build a compatible social client, use the [pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) specification as your foundation.

---

## Operations, Resilience & Scale

**Q54. How do I migrate providers?**  
Add mirror → update PKARR → let caches sync → retire old host.

**Q55. What if Synonym disappears?**  
Nothing breaks. Your key, data, and graph are yours.

**Q56. What if my ISP censors my homeserver?**  
Switch hosts, use Tor/VPN, republish PKARR.

**Q57. How often does PKARR update?**
Periodically, every few hours is typical. See [republishing research](https://github.com/pubky/pkarr-churn/blob/main/results-node_decay.md) for details.

**Q58. What if I spam the DHT?**  
You'll be rate-limited. Publish sensibly.

**Q59. Does DHT scale globally?**  
Yes. Mainline DHT already does, Pubky's usage is lightweight.

**Q60. Why do some say Nostr needs a DHT?**  
Because relay-only networks don't scale easily without coordination.

**Q61. What about private data in Pubky?**  
Short-term: [[PubkyNoise|Pubky Noise]]-based encrypted channels for private peer-to-peer communication.  
Long-term: Cryptree-style systems and further R&D.

**Q62. What is Pubky Noise?**  
Pubky Noise is a Noise Protocol implementation that provides encrypted communication channels for the Pubky ecosystem. It uses the IK handshake pattern for mutual authentication and forward secrecy. Currently used by [[Paykit]] for private payment negotiation, it can also support other applications requiring secure peer-to-peer communication. Work in progress - not production-ready yet.

**Q63. How does Pubky Noise differ from the Noise Protocol?**  
Pubky Noise is a specific implementation of the Noise Protocol Framework adapted for the Pubky ecosystem. It integrates with Pubky's Ed25519 identity system, derives X25519 encryption keys automatically, and publishes endpoints to homeserver directories for peer discovery. It provides platform-specific bindings (iOS, Android, Web, CLI) and handles session management.

---