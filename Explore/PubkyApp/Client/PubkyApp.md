---
title: "pubky.app"
---

Web portal for the Pubky ecosystem — a publisher and social feed for the decentralized web.

> **Note:** This component is NOT part of Pubky Core. It is part of the Pubky social app stack (along with [[Explore/PubkyApp/Backend/PubkyNexus|Pubky Nexus]]).

## Overview

pubky.app is a social media-like web application built on top of [[Explore/PubkyCore/Introduction|Pubky Core]]. It serves as the flagship example of how to build applications using the Pubky [[SDK]] for authentication and data storage, combined with [[Explore/PubkyApp/Backend/PubkyNexus|Nexus]] for fast social feeds.

- **GitHub**: https://github.com/pubky/pubky-app
- **Platform**: Web (Next.js progressive web app)
- **Status**: Active development

The application follows a local-first architecture where writes commit to local IndexedDB immediately for instant UI feedback, then sync to the [[Homeserver|homeserver]] in the background.

## Tech Stack

- **Next.js 16 / React 19 / TypeScript** — Core framework
- **Tailwind CSS 4 / Shadcn UI / Radix UI** — Styling and components
- **Zustand** — Global state management
- **Dexie** — IndexedDB wrapper for local-first persistence
- **TanStack Query** — Data fetching with caching
- **@synonymdev/pubky** — WASM [[SDK]] for homeserver communication
- **[[AppSpecs|pubky-app-specs]]** — Shared data specifications

## Key Features

- **Social feeds** (home, hot/trending, search) via [[Explore/PubkyApp/Backend/PubkyNexus|Nexus]]
- **Profiles, posts, bookmarks, notifications**
- **QR Code Authentication** via [[PubkyRing|Pubky Ring]]
- **Offline support** — PWA with service worker caching and local-first writes

## Architecture

pubky.app uses a layered architecture with strict separation of concerns:

| Layer | Responsibility |
|-------|----------------|
| **Controllers** | Entry point for UI actions |
| **Coordinators** | System-initiated actions (polling, auth changes, TTL) |
| **Application** | Business logic orchestration |
| **Services** | IO boundaries (local, homeserver, nexus) |
| **Models** | Dexie-based IndexedDB persistence |
| **Stores** | UI state via Zustand |

### Data Flow
1. **Writes** go to [[Homeserver|homeserver]] via [[SDK]]
2. Homeserver notifies [[Explore/PubkyApp/Backend/PubkyNexus|Nexus]] of changes
3. Nexus indexes and aggregates data
4. **Reads** come from Nexus for performance
5. Local Dexie cache provides offline access

All user data is stored under `/pub/pubky.app/` on the homeserver following the [[AppSpecs|pubky-app-specs]] schema.

See the [repository](https://github.com/pubky/pubky-app) for routes, environment configuration, and development setup.
