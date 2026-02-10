---
title: "Pubky Knowledge Base"
---

## Welcome to the Pubky Knowledge Base

This is a knowledge base for the Pubky platform, which includes [[Explore/Pubky Core/Introduction|Pubky Core]], [[0.Introduction|PKARR]] and [[Explore/Pubky App/Introduction|Pubky App]]. These documents are a work in progress, much like Pubky's protocols and applications!

## What is Pubky?

Pubky attempts to unlock the web by realizing our vision for a key-based, self-regulating web that puts users in control.

So far, Pubky does this by combining practical decentralized routing & identity ([[0.Introduction|PKARR]]), with simple interoperable hosting ([[Homeserver|Homeservers]]) that allow for [[Censorship|censorship]] resistance and a [[Credible Exit|credible exit]], as well as a publishing application, Pubky App, that facilitates the creation of a [[Semantic Social Graph|Semantic Social Graph]], which can be used for filtering, discovery, matching and coordination.

Learn more about the overall vision here: [[The vision of Pubky|The Vision of Pubky]]

## Quick Start

- **[[TLDR]]**: 30-second overview of the entire ecosystem
- **[[Getting Started]]**: Complete guide for users and developers
- **[[Glossary]]**: Quick reference for key terms
- **[[Comparisons]]**: How Pubky compares to other protocols
- **[[FAQ|Frequently Asked Questions (FAQ)]]**: 63+ questions answered

## For Users

### Try Pubky

1. **[[Explore/Technologies/Pubky Ring|Pubky Ring]]** - Download the mobile key manager app (iOS/Android)
2. **[Pubky.app](https://pubky.app)** - Try the social media application
3. **[[Explore/Technologies/Pubky Explorer|Pubky Explorer]]** - Browse your data at [explorer.pubky.app](https://explorer.pubky.app)

### Identity Management

🔐 **[[Explore/Technologies/Pubky Ring|Pubky Ring]]** is the key manager app for the Pubky ecosystem. Native mobile app (iOS/Android) for managing your pubkys, authorizing apps, and controlling sessions.

- [[Explore/Technologies/Pubky Ring|Pubky Ring Overview]] - Your keychain for decentralized identity
- [Official Repository](https://github.com/pubky/pubky-ring) - React Native mobile app

## For Developers: Pubky Core

🏗️ **[[Explore/Pubky Core/Introduction|Pubky Core]]** is the open protocol and infrastructure for building censorship-resistant web applications.

### Core Documentation

- [[Explore/Pubky Core/Introduction|Pubky Core Overview]] - Protocol, homeserver, and SDK
- [[Explore/Pubky Core/SDK|SDK Documentation]] - Client libraries (Rust, JavaScript, iOS, Android)
- [[Explore/Pubky Core/API|API Reference]] - RESTful HTTP API specification
- [[Architecture|Architecture Overview]] - System design and data flow
- [[Homeserver|Homeserver Documentation]] - Deploy and configure homeservers

### Infrastructure

- [[Homegate|Homegate]] - Signup verification service for homeservers (SMS + Lightning)
- [[PKDNS|PKDNS]] - DNS server for resolving public key domains
- [[Explore/Pubky App/Backend/Pubky Nexus|Pubky Nexus]] - Production indexing service

### Resources

- [Official Repository](https://github.com/pubky/pubky-core) - MIT licensed
- [Official Docs](https://pubky.github.io/pubky-core/) - Complete documentation
- [Rust API Docs](https://docs.rs/pubky) - Rust crate documentation
- [NPM Package](https://www.npmjs.com/package/@synonymdev/pubky) - JavaScript/TypeScript bindings

## Developer Tools

🛠️ **Pubky Ecosystem Tools** - Utilities for development, debugging, and exploration:

- **[[Explore/Technologies/Pubky Docker|Pubky Docker]]** - One-click Docker stack for running the complete Pubky Social environment locally
- **[[Explore/Technologies/Pubky Explorer|Pubky Explorer]]** - Web-based file browser for homeserver data ([explorer.pubky.app](https://explorer.pubky.app))
- **[[Explore/Technologies/Pubky CLI|Pubky CLI]]** - Command-line tool for homeserver management and testing
- **PKDNS Digger** - Web-based DNS record lookup tool for PKARR domains ([github.com/pubky/pkdns-digger](https://github.com/pubky/pkdns-digger))
- **[[Jeb - Pubky AI Bot|Jeb AI Bot]]** - AI-powered bot for summaries and fact-checking on Pubky social network

## Pubky App: Social Application

**[[Explore/Pubky App/Introduction|Pubky App]]** is a decentralized social media application built on Pubky Core.

### Current Status

- **Live Application**: [https://pubky.app](https://pubky.app) - Production PWA currently operational
- **Current Repository**: [github.com/pubky/pubky-app](https://github.com/pubky/pubky-app) - **⚠️ Deprecated** (MVP codebase)
- **New Development**: [github.com/pubky/franky](https://github.com/pubky/franky) - **Work in Progress** (next-gen client, expected summer 2025)
- **Data Model Specification**: [pubky-app-specs](https://github.com/pubky/pubky-app-specs) - Formal schema definitions for interoperability

### Backend Infrastructure

🚀 **[[Explore/Pubky App/Backend/Pubky Nexus|Pubky Nexus]]** is the production indexing and aggregation service that powers Pubky App's social features.

- [[Explore/Pubky App/Backend/Pubky Nexus|Pubky Nexus Overview]] - Real-time social graph aggregation and high-performance API
- [Official Repository](https://github.com/pubky/pubky-nexus) - Open source Rust implementation
- [Live API](https://nexus.pubky.app/swagger-ui/) - Production REST API with Swagger UI
- [Staging API](https://nexus.staging.pubky.app/swagger-ui/) - Latest development version

## Key Concepts

Understand the fundamental ideas behind Pubky:

- **[[Semantic Social Graph]]** - Tagged relationships and user-controlled filtering
- **[[Censorship|Censorship Resistance]]** - Why centralized platforms fail
- **[[Credible Exit]]** - Freedom to switch providers without losing data
- **[[0.Introduction|PKARR]]** - Public key addressable resource records
- **[[Mainline DHT]]** - Distributed hash table for discovery

## Work in Progress: Payment Protocol

⚠️ **[[Explore/Technologies/Paykit|Paykit]]** is a payment protocol (work in progress) built on Pubky for payment discovery and coordination. Not production-ready.

- [[Explore/Technologies/Paykit|Paykit Overview]] - Current state and architecture (WIP)
- [Fork Repository (WIP)](https://github.com/BitcoinErrorLog/paykit-rs) - BitcoinErrorLog fork
- [Complete Documentation](https://github.com/BitcoinErrorLog/paykit-rs/tree/main/docs) - Repository docs (work in progress)

## Work in Progress: Encrypted Communication

⚠️ **[[Explore/Technologies/Pubky Noise|Pubky Noise]]** is a Noise Protocol implementation (work in progress) for encrypted peer-to-peer communication in the Pubky ecosystem. Not production-ready.

- [[Explore/Technologies/Pubky Noise|Pubky Noise Overview]] - Encrypted channels for private communication (WIP)
- [Repository (WIP)](https://github.com/BitcoinErrorLog/pubky-noise) - BitcoinErrorLog fork

## Community & Support

- **[[Getting Started]]** - Complete onboarding guide
- **[[FAQ]]** - Frequently asked questions
- **[[Troubleshooting]]** - Common issues and solutions
- **[[Contributing]]** - How to contribute to Pubky
- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **GitHub**: [github.com/pubky](https://github.com/pubky)

---

**Ready to get started? Check out the [[Getting Started]] guide or dive into [[Explore/Pubky Core/Introduction|Pubky Core]]!**
