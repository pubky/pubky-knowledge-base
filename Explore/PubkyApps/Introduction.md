---
title: "Introduction"
aliases:
  - "../Pubky-App/Introduction"
  - "Explore/PubkyApp/Introduction"
---

![Pubky Apps architecture overview](Explore/images/pubky-app.svg)

## Overview

Pubky Apps are decentralized applications built on [[Explore/PubkyCore/Introduction|Pubky Core]]. Each app defines its own data models and stores data on a user's [[Homeserver|Homeserver]] (e.g., `/pub/myapp/...`). The flagship example is [pubky.app](https://pubky.app), an operational social media platform that serves as a reference implementation demonstrating how to build (social) applications on the Pubky protocol.

## Components

At its core, a Pubky App consists of the [[Explore/PubkyApps/ReferenceApp/Introduction|application]] itself and a [[Homeserver|Homeserver]] for data persistence. The application reads and writes data directly to the user's Homeserver — that alone is enough to build a functional [[Explore/PubkyApps/AppArchitectures/2.ClientHomeserver|Homeserver-only]] Pubky App.

[[Explore/PubkyApps/IndexingAndAggregation/Introduction|Indexing & Aggregation]] is an optional but powerful addition. It becomes valuable when an application needs to combine data from many Homeservers or across different data sets within the same Homeserver — think social feeds, search, or notifications. It's up to the developer to decide whether their application benefits from an indexing layer, though in practice most non-trivial apps do.

##### Indexing & Aggregation: The Data Organizer

Collects and organizes data from various sources, processing it into a usable format. This layer handles crawling Homeservers, normalizing data, and serving it via APIs.

## Key aspects

- **Data Ownership**: Users have full autonomy over their data, hosting it on **independent [[Homeserver|Homeservers]]** that are decentralized and distributed across the network. This approach enables users to maintain **control** and **ownership** of their data, while also ensuring **data sovereignty** and **[[Explore/Technologies/PubkyNoise|privacy]]**.
- [[Explore/PubkyApps/IndexingAndAggregation/Introduction|Indexers and aggregators]] subscribe to [[Homeserver|Homeserver]] event streams to build social graphs, power feeds, enable [[Search|search]], and deliver real-time notifications
- **Multi-layered moderation**: Users filter content through [[Explore/PubkyApps/ReferenceApp/Features/Tags|tags]], web-of-trust reach, and [[Explore/PubkyApps/ReferenceApp/Features/Perspectives|perspectives]], while [[Homeserver|Homeserver]] operators and [[Explore/PubkyApps/IndexingAndAggregation/Introduction|indexers]] enforce their own content policies — no single authority controls what is visible across the network

## Reference app: pubky.app

[pubky.app](https://pubky.app) is the reference implementation of a Pubky App. It uses an indexing and aggregation layer to present social data in a rich, real-time interface.

### pubky.app — Operational Product & Reference Implementation

- **Live Platform**: [https://pubky.app](https://pubky.app) — An operational social media product built on the Pubky protocol, demonstrating decentralized social networking in production
- **Repository**: [github.com/pubky/pubky-app](https://github.com/pubky/pubky-app) — Source code for the reference implementation
- **Data Model**: Posts, comments, tags, and other social data are stored on each user's [[Homeserver|Homeserver]] in association with their profile
- **Indexing & Aggregation**: [[PubkyNexus|Nexus]] is the aggregator and indexer for pubky.app, providing real-time social graph aggregation, high-performance search, and a comprehensive REST API

## Interoperability with pubky.app

If an application wants to read, write, or interact with the data that **pubky.app** uses — profiles, posts, tags, bookmarks, follows, and feeds stored under `/pub/pubky.app/` — it should follow the [pubky-app-specs](https://github.com/pubky/pubky-app-specs) specification. That repository also provides ready-made libraries ([npm](https://www.npmjs.com/package/pubky-app-specs), [Rust crate](https://github.com/pubky/pubky-app-specs/tree/main/src)) with validation and type definitions, so developers can integrate directly rather than implementing the spec from scratch.

> **Open questions (WIP):** Many conventions around cross-app data sharing are not yet defined. For example:
> - Should an app write tags into its own directory (`/pub/myapp/tags/...`) or into pubky.app's directory (`/pub/pubky.app/tags/...`)?
> - Should other apps treat the pubky.app profile (`/pub/pubky.app/profile.json`) as a shared identity baseline (name, avatar, bio), or should each app maintain its own? And when a user updates their profile from a different app, should the write land in `/pub/pubky.app/` — propagating to every app that reads from there — or in the app's own directory as a local override?
> - How do you build your own indexer for a new Pubky App? There are no guides, templates, or standardized conventions for this yet.
>
> These questions are actively being worked on. Developers building Pubky Apps today should expect these conventions to evolve and are encouraged to reach out to the Pubky team ([Telegram](https://t.me/pubkycore), [GitHub](https://github.com/pubky)) if clarification is needed.

