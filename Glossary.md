# Glossary

Quick reference for terms used throughout the Pubky ecosystem.

---

## A

**Aggregator**
A service that collects and organizes data from multiple [[Homeserver|homeservers]] to enable search, feeds, and discovery features. See [[Explore/PubkyApp/Backend/Aggregator|Aggregator]].

**Authentication**
The process of proving ownership of a public key through cryptographic signatures, enabling secure access to homeservers without passwords. See [[Authentication|details]].

## C

**Capability Token**
A cryptographically signed token that grants third-party applications limited access to a user's data on their homeserver, similar to OAuth access tokens.

**Censorship Resistance**
The property of being difficult or impossible to block, censor, or control by any single authority. Pubky achieves this through decentralized [[MainlineDHT|Mainline DHT]] and distributed [[Homeserver|homeservers]].

**[[CredibleExit|Credible Exit]]**
The ability to leave a service provider (homeserver, app, etc.) without losing your data, identity, or social connections. A core principle of Pubky's architecture.

## D

**[[DHT|Distributed Hash Table (DHT)]]**
A decentralized key-value storage system distributed across many nodes. Pubky uses [[MainlineDHT|Mainline DHT]] for storing [[PKARR]] records.

**[[DNS|Domain Name System (DNS)]]**
Traditional system for translating domain names to IP addresses. [[PKDNS]] extends this to support public key domains.

**[[DoH|DNS over HTTPS (DoH)]]**
Protocol for encrypting DNS queries using HTTPS, preventing surveillance and tampering.

## H

**[[Homeserver|Homeserver]]**
A web server that stores user data in a key-value format. Users can run their own or choose any provider. Data is stored per public key and accessed via HTTP/HTTPS.

**[[Homegate]]**
A signup verification service for homeservers, providing SMS and Lightning Network payment verification to prevent spam while preserving privacy.

## I

**Indexer**
See **Aggregator**. A service that crawls and indexes data from homeservers to provide search and discovery features.

## J

**[[JebPubkyAIBot|Jeb]]**
AI-powered bot for the Pubky social network, providing post summaries and fact-checking capabilities using LLMs and web search.

## K

**[[KeyPair|Key Pair]]**
A pair of cryptographic keys (public and private) used for identity, authentication, and encryption. In Pubky, your public key IS your identity.

## M

**[[MainlineDHT|Mainline DHT]]**
The Distributed Hash Table used by BitTorrent, with 10+ million nodes globally. Pubky uses it to store [[PKARR]] records, providing censorship-resistant discovery.

## N

**[[Explore/PubkyApp/Backend/PubkyNexus|Nexus]]** (Pubky Nexus)
Production-grade indexing and aggregation service for Pubky App. Provides high-performance social graph API, search, and real-time notifications.

**[[Explore/Technologies/PubkyNoise|Noise]]** (Pubky Noise)
Noise Protocol implementation for encrypted peer-to-peer communication in the Pubky ecosystem (work in progress).

## P

**[[Explore/Technologies/Paykit|Paykit]]**
Payment protocol built on Pubky for payment discovery and coordination across Bitcoin, Lightning, and other methods (work in progress).

**[[0.Introduction|PKARR]]** (Public Key Addressable Resource Records)
Self-issued, signed DNS-like records published to the Mainline DHT. Each record is tied to a public key and contains information like homeserver locations.

**[[PKDNS]]**
DNS server that resolves public key domains by fetching PKARR records from the Mainline DHT, bridging traditional DNS with decentralized identity.

**Public Key**
The public half of a cryptographic key pair. In Pubky, this serves as your permanent, self-sovereign identity (often called a "pubky").

**Pubky**
1. The decentralized web protocol and ecosystem
2. A user's public key identity (e.g., "my pubky is z4e8s...")

**[[Explore/PubkyApp/Introduction|Pubky App]]**
Social media application demonstrating Pubky Core capabilities. Live at [pubky.app](https://pubky.app).

**[[Explore/PubkyCLI|Pubky CLI]]**
Command-line tool for interacting with Pubky homeservers, providing user operations, admin functions, and testing utilities.

**[[Explore/PubkyCore/Introduction|Pubky Core]]**
The foundational protocol, homeserver implementation, and SDK for building decentralized applications on Pubky.

**[[Explore/Technologies/PubkyDocker|Pubky Docker]]**
Docker Compose orchestration for running the complete Pubky Social stack locally with one command.

**[[Explore/Technologies/PubkyExplorer|Pubky Explorer]]**
Web-based file browser for exploring public data on Pubky homeservers. Available at [explorer.pubky.app](https://explorer.pubky.app).

**[[Explore/Technologies/PubkyRing|Pubky Ring]]**
Mobile key manager app (iOS/Android) for securely managing pubkys, authorizing applications, and handling sessions.

**pubky-app-specs**
Formal data model specifications for Pubky App, defining structures for users, posts, tags, and other social features. Ensures interoperability between different client implementations.

## R

**Recovery File**
Encrypted backup of a user's private key and identity information, protected by a passphrase. Used for key recovery and migration between devices.

## S

**[[Explore/PubkyCore/SDK|SDK]]** (Software Development Kit)
Client libraries for building Pubky applications, available in Rust, JavaScript/WASM, and native mobile (iOS/Android).

**Self-Sovereign Identity**
Identity that is fully controlled by the individual, not dependent on any centralized authority or service provider. Pubky implements this via cryptographic key pairs.

**[[SemanticSocialGraph|Semantic Social Graph]]**
A social network where relationships are tagged with meaningful metadata, enabling personalized content filtering, trust-based discovery, and user-controlled feeds.

**Session**
A time-limited authentication state that allows a client to access a homeserver without repeatedly signing requests with the private key.

## T

**Tag**
User-defined label attached to posts, files, or other users to add semantic meaning and enable filtering/discovery in the [[SemanticSocialGraph|Semantic Social Graph]].

## W

**Web of Trust**
Traditional model where trust propagates through social connections. Pubky extends this with the [[SemanticSocialGraph|Semantic Social Graph]], adding semantic context to trust relationships.

---

## Quick Links

- **[[index|Main Documentation]]**: Full knowledge base
- **[[GettingStarted|Getting Started]]**: Get started with Pubky
- **[[FAQ]]**: Frequently asked questions
- **[[Comparisons]]**: How Pubky compares to alternatives
- **[[TheVisionOfPubky|Vision]]**: Why we're building Pubky

