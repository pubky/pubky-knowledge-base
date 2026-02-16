---
title: "Pubky Backup"
---

Desktop backup application for Pubky users to maintain local copies of all their published data from their [[Homeserver|homeserver]].

- **GitHub**: https://github.com/pubky/pubky-backup
- **Platforms**: Linux, macOS, Windows

A lightweight background process that continually keeps a Pubky user's local backup in-sync with their published data. Runs in the system tray and automatically polls for changes.

## Role in Credible Exit

Pubky Backup enables [[CredibleExit|credible exit]] by giving users a local copy of their data. With a backup, users can:

1. **Migrate**: Sign up with a new homeserver and restore their data
2. **Verify**: Compare local backup against homeserver to detect tampering
3. **Recover**: Restore data if homeserver becomes unavailable

See [[SecurityModel|Security Model]] for the full trust model and recovery scenarios.
## Core Features

- **Continuous Sync**: Polls the homeserver every 30 seconds for new events
- **Local Backup**: Stores all published data (`/pub/` resources) to a local directory
- **Snapshot Creation**: Timestamped ZIP archives for point-in-time recovery
- **Multi-Pubky Support**: Backup multiple pubky keys, each in its own directory
- **System Tray**: Background operation with sync status indicator
- **Force Sync**: Manual trigger for immediate sync

## How It Works

1. User enters their pubky (app validates format)
2. Uses [[PKDNS]] to discover the homeserver
3. Fetches events from the homeserver's `/events/` endpoint with cursor-based pagination
4. Processes PUT events (download data) and DELETE events (remove local files)
5. Polls every 30 seconds, persisting cursor for restart continuity

## Tech Stack

Built with Rust (Tauri backend) and TypeScript (Vite frontend). Uses the `pubky` crate for homeserver communication and OpenDAL for filesystem abstraction.

See the [repository](https://github.com/pubky/pubky-backup) for build instructions, storage layout, and API reference.
