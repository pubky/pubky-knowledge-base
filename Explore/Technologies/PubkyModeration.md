---
title: "Pubky Moderation"
---

Content moderation service for the Pubky ecosystem, designed to protect [[Homeserver|Homeserver]] operators and users from harmful content. Monitors events from Homeservers and [[Explore/PubkyApp/Backend/PubkyNexus|Nexus]], sends content to [Checkstep](https://www.checkstep.com/) for moderation, and enforces policy decisions.

- **Repository**: https://github.com/pubky/pubky-moderation
- **Language**: Rust

## Philosophy

- **Per-homeserver/indexer only**: Actions affect a single Homeserver's content, not identity or data on other Homeservers.
- **Operator choice**: Each Homeserver decides whether to run moderation services.
- **Replaceable**: Anyone can run their own moderation stack with different policies.

## Moderation Flows

1. **Homeserver moderation**: Raw media content at `<public key>/` (except `pubky.app/`). Syncs Homeserver `/events/`, resolves pubky resources to HTTPS URLs, and submits to Checkstep. Enforces decisions via Homeserver admin API.

2. **Nexus moderation**: Social content at `<public key>/pubky.app/`. Syncs [[Explore/PubkyApp/Backend/PubkyNexus|Nexus]] `/v0/events`, parses social entities (profiles, posts, tags, threads), and sends to Checkstep with partial content support. Enforces via moderation bot tagging and Homeserver admin API.

## Architecture

Both flows are implemented as a Rust workspace with multiple long-running services and a shared PostgreSQL database:

```
Homeserver/Nexus Events -> Sync Services -> PostgreSQL -> Request Service -> Checkstep API
                                                                            |
Homeserver Admin API <- Response Service (webhook) <- Checkstep Decision
```

Each sync service runs with cursor-based pagination, exponential backoff, and graceful shutdown handling.

## Resources

- [Repository with workspace layout and setup](https://github.com/pubky/pubky-moderation)
- [Checkstep documentation](https://docs.checkstep.com/standard/)
