---
title: "App Specs"
---

Shared data model specifications for the Pubky social app ecosystem, with [[Explore/PubkyApp/Client/PubkyApp|pubky.app]] as the reference implementation.

> **Note:** This component is NOT part of Pubky Core. It is part of the Pubky social app stack.

## Overview

`pubky-app-specs` defines the canonical data schemas for social application data stored on Pubky [[Homeserver|homeservers]]. It provides validation rules, serialization logic, and type definitions used by both *Pubky apps* and the [[Explore/PubkyApp/Backend/PubkyNexus|Pubky Nexus]] indexer to ensure interoperability with [[Explore/PubkyApp/Client/PubkyApp|pubky.app]].

- **Repository**: https://github.com/pubky/pubky-app-specs
- **License**: MIT
- **Platforms**: Rust (native), WASM, JavaScript (npm: `pubky-app-specs`)

## Data Models

All data is stored under `/pub/pubky.app/` on the user's homeserver. Key models include:

- **PubkyAppUser** — User profile (name, bio, image, links, status)
- **PubkyAppPost** — Posts with content, kind, parent, embed, attachments
- **PubkyAppFile** — File metadata (name, src, content_type, size)
- **PubkyAppTag** — Tags on URIs (label + target)
- **PubkyAppBookmark** — Bookmarked URIs
- **PubkyAppFollow / PubkyAppMute** — Social relationships

See the [repository](https://github.com/pubky/pubky-app-specs) for the full schema reference, ID generation rules, validation constraints, and supported post types (short text, long-form, image, video, link, etc.).

## Role in Ecosystem

```
Compatible apps ──write──> homeserver (/pub/pubky.app/...)
                                │
                                ▼ events
Pubky Nexus (indexer) ──reads──> indexes to Redis/Neo4j

Both use pubky-app-specs for schema validation
```
