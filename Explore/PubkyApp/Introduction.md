---
title: "Introduction"
aliases:
  - "../Pubky-App/Introduction"
---

![Pubky App interface screenshot showing decentralized social media application built on Pubky Core](Explore/images/pubky-app.png)

> Synonym will be initially hosting: [[Homeserver|homeserver]] and [[Explore/PubkyApp/Introduction|Pubky App]]

## Overview

Pubky App is a decentralized social media application built on [[Explore/PubkyCore/Introduction|Pubky Core]]. It serves as a working reference implementation demonstrating how to build social applications on the Pubky protocol.

The data models and validation rules are formally specified in the [pubky-app-specs](https://github.com/pubky/pubky-app-specs) repository, which defines structures for users, posts, tags, bookmarks, follows, and feeds. This specification ensures interoperability between different Pubky App implementations.

### Live Application & Development Status

- **Live Demo**: [https://pubky.app](https://pubky.app) - Production instance currently operational
- **Repository**: [github.com/pubky/pubky-app](https://github.com/pubky/pubky-app) — Reference implementation and source code
- **Build Compatible Clients**: Use [pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) as the authoritative specification

## Key aspects

- **Data Ownership**: Users have full autonomy over their data, hosting it on **independent [[Homeserver|homeservers]]** that are decentralized and distributed across the network. This approach enables users to maintain **control** and **ownership** of their data, while also ensuring **data sovereignty** and **privacy**. 
- **Profiles**: The system employs a **decentralized data storage** approach, where **post**, **comment**, and **like** data are stored in association with **user profiles**.
- [[Aggregator|Aggregators]] collecting social graphs
- Feeds of followings' activities
- [[Search|Searching]] profiles and posts
- Notification delivery through [[Explore/PubkyApp/Backend/Introduction|application backends]] 
- Distributed moderation through user blocking

## Components

The Pubky App is a complex system that can be broken down into two main components: the [[Explore/PubkyApp/Backend/Introduction|backend]] and the [[Explore/PubkyApp/Client/Introduction|client]]. These two pieces work together to provide a seamless user experience.

##### Backend: The Data Organizer

It collects and organizes data from various sources, processing it into a usable format.

##### Client: The User Interface

It is the part of the Pubky App that you interact with directly. It's responsible for taking the organized data from the Backend and presenting it to you in a visually appealing and easy-to-understand way.

## MVP Architecture

The early versions of Pubky app take some shortcuts over the [[Explore/PubkyCore/Introduction|Pubky Core]] design. The MVP app is centralized, therefore we saved time and complexity by aggregating functionality into fewer components. The main two components are the `Homeserver` and the `Indexer`

- The [[Homeserver|homeservers]] fulfils the function of `data stores`, republishing users keys to [[0.Introduction|PKARR]] and it acts also as an identity-provider (Oauth-like sign-in). Users maintain a trust relationship with the homeserver.
- The `Indexer` fulfils the function of the [[Explore/PubkyApp/Backend/Introduction|backend]] for the Pubky App. [[PubkyNexus|Pubky Nexus]] is the production implementation of this indexer, providing real-time social graph aggregation, high-performance search, and a comprehensive REST API.
