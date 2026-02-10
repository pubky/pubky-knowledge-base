---
title: "Pubky Nexus"
aliases:
  - "../../Pubky-App/Backend/Pubky-Nexus"
---

# Pubky Nexus

**Pubky Nexus** is the production-grade indexing and aggregation service that powers Pubky App's social features. It transforms decentralized data from multiple [[Homeserver|homeservers]] into a high-performance social graph API, enabling real-time social media experiences at scale.

## Overview

Nexus serves as the central bridge between Pubky homeservers and social clients, implementing the [[Aggregator|aggregator]], [[Indexer|indexer]], and [[WebServer|web server]] components of the [[4.CustomBackend|custom backend architecture]]. By aggregating events from homeservers into a rich social graph, Nexus provides the infrastructure needed for features like feeds, search, recommendations, and real-time notifications.

> ⚠️ **Note**: The Nexus API is currently in active development. The service uses the `/v0` route prefix to indicate API instability, and breaking changes may occur as the system evolves toward stability.

## Key Features

### Real-time Social Graph Aggregation
Nexus continuously ingests events from multiple Pubky homeservers, building and maintaining a structured social graph in real time. This enables features like:
- Following relationships and friend networks
- Post interactions (likes, replies, mentions)
- Tag-based content discovery
- User muting and moderation

### Full-Content Indexing
Rather than requiring clients to locate and query individual homeservers for content, Nexus indexes and serves content directly. This dramatically improves latency and user experience while still maintaining the decentralized nature of the underlying data. Clients can optionally verify content authenticity directly with homeservers when needed.

### High Performance & Scalability
Built in Rust with carefully optimized data structures, Nexus is designed for speed:
- **Sub-millisecond response times**: Most requests are served in less than 1ms
- **Constant time complexity**: Query performance doesn't degrade as user base grows
- **Efficient caching**: Redis-based caching layer accelerates common queries
- **Horizontal scalability**: Architecture supports distributed deployment

### Social Semantic Graph (SSG)
Nexus supports Social Semantic Graph-based interactions, enabling:
- Web-of-trust relationship mapping
- Content filtering based on social connections
- Personalized feed ranking and recommendations
- Community detection and trust inference

### Graph-Enhanced Search & Recommendations
Leveraging Neo4j for graph database operations, Nexus provides:
- Deep relationship queries across the social graph
- Recommendation algorithms based on network topology
- Tag and content discovery through graph traversal
- Influencer and community identification

### Flexible Caching Architecture
A sophisticated Redis caching layer ensures optimal performance:
- Common queries cached for instant retrieval
- Incremental cache updates on new events
- Minimal database load for read-heavy workloads
- Cache invalidation synchronized with graph updates

## Architecture

Nexus is composed of several specialized components working together:

### Components

1. **nexus-watcher**: The event aggregator that monitors Pubky homeservers
   - Subscribes to homeserver event streams
   - Filters and validates incoming events
   - Translates events into social graph updates
   - Handles retry logic for failed operations

2. **nexus-webapi**: The REST API server (formerly nexus-service)
   - Serves client requests via HTTP/REST endpoints
   - Implements OpenAPI/Swagger specification
   - Handles authentication and rate limiting
   - Returns formatted responses to Pubky App frontend

3. **nexus-common**: Shared library for common functionality
   - Database connectors (Redis, Neo4j)
   - Data models and schemas
   - Query builders and utilities
   - Configuration management

4. **nexusd**: Service orchestration daemon
   - Manages component lifecycle
   - Performs database migrations
   - Handles reindexing operations
   - Provides CLI for administration

### Data Flow

1. **Event Ingestion**: The watcher monitors multiple homeservers, receiving events as they occur (new posts, follows, likes, etc.)

2. **Event Processing**: Events are validated, filtered based on configured rules, and transformed into graph operations

3. **Indexing**: Processed events update both the Redis cache (for fast queries) and Neo4j graph database (for complex relationships)

4. **API Responses**: Client requests hit the web API, which serves data from the optimized indexes with sub-millisecond latency

### Technology Stack

- **Language**: Rust (for performance and safety)
- **Graph Database**: Neo4j (for relationship queries and graph algorithms)
- **Cache Layer**: Redis (for high-speed access to common queries)
- **API Framework**: Axum (Rust web framework)
- **Observability**: OpenTelemetry integration (optional)

## API Endpoints

Nexus provides a comprehensive REST API for social features:

### Live API Access

- **Staging** (latest): [https://nexus.staging.pubky.app/swagger-ui/](https://nexus.staging.pubky.app/swagger-ui/)
- **Production** (stable): [https://nexus.pubky.app/swagger-ui/](https://nexus.pubky.app/swagger-ui/)

Explore the full API specification, test queries, and view response schemas directly through the Swagger UI.

### Key Endpoint Categories

- **User endpoints**: Profile data, follower/following relationships, user search
- **Post endpoints**: Post creation/retrieval, replies, mentions, bookmarks
- **Feed endpoints**: Timeline generation, filtered streams, personalized feeds
- **Tag endpoints**: Tag-based discovery, trending tags, tag streams
- **Search endpoints**: Full-text search across users and content
- **Graph endpoints**: Relationship queries, web-of-trust calculations
- **Notification endpoints**: Real-time notification delivery

## Observability & Monitoring

Nexus provides rich observability features for operators:

### Database Exploration
- **Redis Insight**: Inspect cached data structures in real-time at `http://localhost:8001/redis-stack/browser` (local dev)
- **Neo4j Browser**: Visualize and query the social graph at `http://localhost:7474/browser/` (local dev)

### Telemetry Integration
Optional OpenTelemetry integration for production monitoring:
- Distributed tracing across components
- Performance metrics and latency tracking
- Error rate monitoring and alerting
- Integration with tools like Signoz, Jaeger, or Prometheus

## Development & Deployment

### Prerequisites
- Rust toolchain (latest stable)
- Docker and Docker Compose (for databases)
- Neo4j (graph database)
- Redis (caching layer)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/pubky/pubky-nexus
cd pubky-nexus

# Set up databases via Docker
cd docker
cp .env-sample .env
docker compose up -d

# Run the service (uses default config)
cargo run -p nexusd

# Or run components individually
cargo run -p nexusd -- watcher  # Run event watcher
cargo run -p nexusd -- api      # Run API server
```

### Configuration

Nexus uses a TOML configuration file (default location: `$HOME/.pubky-nexus/config.toml`). Custom config paths can be specified:

```bash
cargo run -p nexusd -- --config-dir="custom/config/folder"
```

### Testing & Benchmarking

```bash
# Load mock data for testing
cargo run -p nexusd -- db mock

# Run unit tests
cargo nextest run -p nexus-common --no-fail-fast
cargo nextest run -p nexus-watcher --no-fail-fast
cargo nextest run -p nexus-webapi --no-fail-fast

# Run benchmarks
cargo bench -p nexus-webapi
cargo bench -p nexus-webapi --bench user  # Specific endpoint
```

## Data Migration System

Nexus includes a sophisticated migration manager for handling breaking changes to data structures:

### Migration Phases

1. **Dual Write**: New writes go to both old and new data sources simultaneously
2. **Backfill**: Historical data is migrated from old to new source
3. **Cutover**: Reads switch to the new data source
4. **Cleanup**: Old data sources are safely removed

### Managing Migrations

```bash
# Create a new migration
cargo run -p nexusd -- db migration new MigrationName

# Run pending migrations
cargo run -p nexusd -- db migration run

# Clear database (use with caution)
cargo run -p nexusd -- db clear
```

## Use Cases

Nexus enables a variety of social features for applications built on Pubky:

### Social Feeds
- Chronological and algorithmic timelines
- Filtered feeds by tags, authors, or topics
- Personalized recommendations based on social graph
- Real-time updates without polling

### Discovery & Search
- Full-text search across posts and users
- Tag-based content discovery
- Trending topics and hot tags
- User recommendations based on network proximity

### Moderation & Filtering
- User muting and blocking
- Community-based filtering
- Spam detection and prevention
- Custom content policies per instance

### Analytics & Insights
- User reach and influence metrics
- Content engagement tracking
- Network growth analysis
- Community detection and clustering

## Deployment Options

### Self-Hosted Instance
Organizations can run their own Nexus instance with custom:
- Content filtering and moderation policies
- Event source selection (which homeservers to index)
- Caching strategies and database configuration
- API rate limits and access controls

### Public Instances
The Pubky team operates public instances:
- **Production**: [https://nexus.pubky.app](https://nexus.pubky.app)
- **Staging**: [https://nexus.staging.pubky.app](https://nexus.staging.pubky.app)

### Hybrid Approaches
Clients can use a combination of:
- Public Nexus instances for general discovery
- Private instances for specialized communities
- Direct homeserver queries for verification

## Future Enhancements

The Nexus roadmap includes several planned improvements:

- **Light-weight mode**: Return homeserver URIs instead of full content
- **Federation protocols**: Inter-Nexus communication for global discovery
- **Advanced ML models**: Improved recommendation algorithms
- **Real-time WebSocket API**: Push-based updates for clients
- **Content delivery optimization**: Edge caching and CDN integration
- **Enhanced privacy controls**: Encrypted graph operations

## Contributing

Nexus is open source and welcomes contributions:

1. Fork the [repository](https://github.com/pubky/pubky-nexus)
2. Create a feature branch
3. Write tests for new functionality
4. Submit a pull request with clear description

All contributions should include tests and benchmarks where applicable.

## Resources

- **Repository**: [https://github.com/pubky/pubky-nexus](https://github.com/pubky/pubky-nexus)
- **Swagger UI** (Staging): [https://nexus.staging.pubky.app/swagger-ui/](https://nexus.staging.pubky.app/swagger-ui/)
- **Swagger UI** (Production): [https://nexus.pubky.app/swagger-ui/](https://nexus.pubky.app/swagger-ui/)
- **Issue Tracker**: [https://github.com/pubky/pubky-nexus/issues](https://github.com/pubky/pubky-nexus/issues)

## Building Clients for Nexus

If you're building a social client application to consume the Nexus API:

- **Data Model Specification**: Use [pubky-app-specs](https://www.npmjs.com/package/pubky-app-specs) as your authoritative reference for data structures and validation rules
- **Client Reference**: The current web client at [pubky.app](https://pubky.app) is operational but its [codebase](https://github.com/pubky/pubky-app) is deprecated (not recommended for learning)
- **Next-Generation Client**: [Franky](https://github.com/pubky/franky) is under development as the production-quality reference implementation (expected summer 2025)
- **API Exploration**: Use the [Swagger UI](https://nexus.pubky.app/swagger-ui/) to explore available endpoints and test queries

## See Also

- [[Aggregator|Aggregators]] - Event collection and filtering
- [[Indexer|Indexers]] - Data normalization and transformation
- [[WebServer|Web Servers]] - API serving layer
- [[4.CustomBackend|Custom Backend Architecture]] - Overall architecture pattern
- [[Homeserver|Homeservers]] - Data source and storage layer

