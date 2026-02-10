---
title: "Pubky Docker"
aliases:
  - "Pubky-Docker"
---

# Pubky Docker

**Pubky Docker** is a Docker Compose orchestration that provides a one-click local development environment for running the complete Pubky Social (App) stack. It's designed for developers who want to experiment with the full Pubky ecosystem or test components in an isolated environment.

## Overview

Pubky Docker orchestrates the following components:

1. **Pkarr Relay** - DHT relay for public key-addressable records
2. **Pubky Homeserver** - Decentralized data storage instance
3. **Pubky Nexus** - Social media indexer and aggregator
4. **Pubky App** - Social media client frontend

The orchestration includes all necessary supporting infrastructure (PostgreSQL, Neo4j, Redis) and is configurable for both testnet and mainnet environments.

## When to Use Pubky Docker

### ✅ Use Pubky Docker When:
- Experimenting with the complete Pubky Social stack
- Developing or testing Pubky Nexus integrations
- Building custom social media frontends
- Testing homeserver configurations
- Learning how all Pubky components interact
- Debugging cross-component issues

### ❌ Don't Use Pubky Docker When:
- Building applications using Pubky Core (use SDK libraries instead)
- Developing simple Pubky integrations (use official client libraries)
- Just testing basic read/write operations

For application development, use the official client libraries:
- **JavaScript**: [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky)
- **Rust**: [pubky](https://crates.io/crates/pubky)

## Quick Start

### Using Public Docker Images

This is the fastest way to get started. All images are available on [Docker Hub](https://hub.docker.com/u/synonymsoft).

1. Clone the repository:
```bash
git clone https://github.com/pubky/pubky-docker.git
cd pubky-docker
```

2. Configure environment:
```bash
cp .env-sample .env
# Edit .env to set NETWORK=mainnet or NETWORK=testnet
```

3. Start the stack:
```bash
docker compose up -d
```

### Building From Source

If you need to modify components or build custom versions:

1. Clone all required repositories at the same directory level:
```bash
# Create a workspace directory
mkdir pubky-workspace && cd pubky-workspace

# Clone all repositories
git clone https://github.com/pubky/pubky-docker.git
git clone https://github.com/pubky/pkarr.git
git clone https://github.com/pubky/pubky-core.git
git clone https://github.com/pubky/pubky-nexus.git
git clone https://github.com/pubky/pubky-app.git
```

2. Configure and start:
```bash
cd pubky-docker
cp .env-sample .env
# Edit .env as needed
docker compose up
```

The directory structure must be:
```
pubky-workspace/
├── pubky-docker/
├── pkarr/
├── pubky-core/
├── pubky-nexus/
└── pubky-app/
```

## Stack Components

### 1. Pkarr Relay (Port 6882)
Local DHT relay for public key-addressable resource records. Enables domain resolution for Pubky identities.

**Configuration**: `pkarr.config.toml`

### 2. Pubky Homeserver (Ports 6287-6288, 15411-15412)
Local instance of a Pubky homeserver with PostgreSQL backend.

**Configuration**: `homeserver.config.toml`

**Database**: PostgreSQL (Port 5432)

**Endpoints**:
- `6287`: Primary HTTP API
- `6286`: Admin API
- `6288`: Metrics
- `15411-15412`: HTTP relay

### 3. Pubky Nexus (Ports 8080-8081)
Social media indexer and aggregator with graph database and search capabilities.

**Configuration**: `pubky-nexus-config-{testnet|mainnet}.toml`

**Dependencies**:
- Neo4j graph database (Ports 7474, 7687)
- Redis search index (Ports 6379, 8001)

**Endpoints**:
- `8080`: Main API
- `8081`: Admin/metrics

### 4. Pubky App (Port 4200)
Next.js-based social media frontend configured to use the local stack.

**Access**: http://localhost:4200

## Configuration

### Environment Variables

The `.env` file controls key configuration:

```bash
# Network Selection
NETWORK=testnet  # or mainnet

# Image Tags (when using public images)
REGISTRY=synonymsoft
PUBKY_APP_TAG=latest
PUBKY_NEXUS_TAG=latest
HOMESERVER_TAG=latest
PKARR_TAG=latest

# Database
POSTGRES_USER=homeserver
POSTGRES_PASSWORD=homeserver
POSTGRES_DB=homeserver

# Frontend Configuration
NEXT_PUBLIC_HOMESERVER=8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo
NEXT_PUBLIC_NEXUS=http://localhost:8080
NEXT_PUBLIC_TESTNET=true
HTTP_RELAY=http://localhost:15412/link/
NEXT_PUBLIC_PKARR_RELAYS=["https://pkarr.pubky.app","https://pkarr.pubky.org"]
```

### Network Configuration

The stack uses a custom Docker bridge network (`172.18.0.0/16`) with static IPs:

| Service | IP | External Ports |
|---------|------|---------------|
| Pkarr | 172.18.0.2 | 6882 |
| Nexus | 172.18.0.3 | 8080, 8081 |
| Homeserver | 172.18.0.4 | 6286-6288, 15411-15412 |
| Neo4j | 172.18.0.5 | 7474, 7687 |
| Redis | 172.18.0.6 | 6379, 8001 |
| Client | 172.18.0.7 | 4200 |
| Postgres | 172.18.0.9 | 5432 |

## Usage Examples

### Start the Full Stack
```bash
docker compose up -d
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f homeserver
docker compose logs -f nexusd
```

### Stop the Stack
```bash
docker compose down
```

### Rebuild After Code Changes
```bash
docker compose build
docker compose up -d
```

### Reset All Data
```bash
docker compose down -v
rm -rf .storage/
```

## Development Workflows

### Testing Homeserver Changes

1. Modify code in `../pubky-core/`
2. Rebuild homeserver:
```bash
docker compose build homeserver
docker compose up -d homeserver
```

### Testing Nexus Changes

1. Modify code in `../pubky-nexus/`
2. Rebuild nexus:
```bash
docker compose build nexusd
docker compose up -d nexusd
```

### Testing Frontend Changes

1. Modify code in `../pubky-app/`
2. Rebuild client:
```bash
docker compose build client
docker compose up -d client
```

### Access Monitoring Tools

- **Neo4j Browser**: http://localhost:7474
- **Redis Insight**: http://localhost:8001
- **Pubky App**: http://localhost:4200

## Data Persistence

All data is stored in the `.storage/` directory:

```
.storage/
├── pkarr/          # Pkarr relay cache
├── postgres/       # Homeserver database
├── neo4j/          # Nexus graph data
├── redis/          # Nexus search index
└── static/         # Nexus static files
```

This directory is gitignored. To reset your environment, simply delete it.

## Troubleshooting

### Containers Won't Start

Check if ports are already in use:
```bash
# Check port availability
lsof -i :4200 -i :6882 -i :8080
```

### Database Connection Errors

Ensure PostgreSQL is healthy:
```bash
docker compose ps postgres
docker compose logs postgres
```

### Nexus Can't Connect to Homeserver

Verify homeserver is running and accessible:
```bash
curl http://localhost:6287/
docker compose logs homeserver
```

### Reset a Specific Service

```bash
# Stop service
docker compose stop nexusd

# Remove its data
rm -rf .storage/neo4j .storage/redis

# Restart
docker compose up -d nexusd
```

## Architecture

The Pubky Docker stack demonstrates the full architecture of a Pubky Social application:

```
┌─────────────────────────────────────────────────────┐
│                   Browser                           │
│              (localhost:4200)                       │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                Pubky App (Client)                   │
│            Next.js Frontend                         │
└────────────┬──────────────────────┬─────────────────┘
             │                      │
    ┌────────▼─────────┐   ┌────────▼──────────┐
    │  Pubky Nexus     │   │ Pubky Homeserver  │
    │  (Social API)    │   │  (User Storage)   │
    │  - Neo4j Graph   │   │  - PostgreSQL     │
    │  - Redis Search  │   │  - File Storage   │
    └────────┬─────────┘   └────────┬──────────┘
             │                      │
             └──────────┬───────────┘
                        │
                 ┌──────▼───────┐
                 │ Pkarr Relay  │
                 │ (DHT/DNS)    │
                 └──────────────┘
```

## Links

- **Repository**: https://github.com/pubky/pubky-docker
- **Upstream**: https://github.com/pubky/pubky-docker
- **Docker Hub**: https://hub.docker.com/u/synonymsoft

## Related Documentation

- [Pubky Core](/explore/pubky-core/introduction) - Core protocol and SDK
- [Pubky Nexus](/explore/pubky-app/backend/pubky-nexus) - Social media indexer
- [Pubky App](/explore/pubky-app/introduction) - Frontend application
- [Pubky Homeservers](/explore/pubky-core/homeservers) - Homeserver architecture
- [PKARR](/explore/pubky-core/pkarr/0-introduction) - Public key addressable records

