---
title: "Jeb: Pubky AI Bot"
aliases:
  - "Jeb---Pubky-AI-Bot"
---

**Jeb** is an AI-powered bot for the [[Explore/PubkyApp/Introduction|Pubky]] decentralized social network. Affectionately named "Jeb," this bot automatically responds to mentions with intelligent summaries, fact-checking, and other AI-powered capabilities, demonstrating how AI can enhance decentralized social experiences without compromising user sovereignty.

## Overview

Jeb operates as an autonomous agent on the Pubky network, monitoring mentions and providing helpful AI-generated responses. Unlike centralized social media bots that collect user data, Jeb operates transparently on the decentralized Pubky infrastructure, with all interactions stored on [[Homeserver|homeservers]] under user control.

### Key Characteristics

- **AI-Powered**: Supports multiple AI providers (Groq, OpenAI, Anthropic, OpenRouter)
- **Event-Driven**: Built on Redis Streams for scalable, asynchronous processing
- **Production-Ready**: Full observability with health checks, metrics, and structured logging
- **Privacy-Preserving**: No data collection; all interactions occur via public Pubky protocol
- **Open Source**: MIT licensed, fully transparent implementation
- **Horizontally Scalable**: Worker-based architecture for handling high volumes

## Capabilities

### Summary Generation

Jeb can summarize long threads or conversations to help users quickly understand complex discussions.

**Trigger Keywords**: "summary", "tl;dr", "recap", "summarize"

**How It Works**:
1. User mentions Jeb in a post with a summary request
2. Jeb fetches the full thread context from the homeserver
3. AI generates a concise summary with key points
4. Response includes up to 3 bullet points highlighting main topics
5. Safety check ensures appropriate content before posting

**Example Interaction**:
```
User: "@jeb can you summarize this thread? tl;dr"
Jeb: "This thread discusses X, Y, and Z. Key points:
      • Point 1 about topic A
      • Point 2 about topic B  
      • Point 3 about topic C"
```

**Token Management**: Jeb respects configurable token budgets to avoid overwhelming AI APIs with massive threads.

### Fact-Checking

Jeb can verify factual claims by searching for supporting evidence using web search APIs.

**Trigger Keywords**: "verify", "fact check", "source?", "is this true?"

**How It Works**:
1. User mentions Jeb with a fact-check request
2. Jeb extracts factual claims from the content
3. Uses MCP (Model Context Protocol) tools to search Brave API
4. AI analyzes search results and assigns verdicts per claim
5. Returns overall assessment with confidence level and sources

**Verdict Types**:
- **Accurate**: Claim supported by reliable sources
- **Mixed**: Some accurate elements, some not
- **Inaccurate**: Contradicted by reliable sources
- **Unverifiable**: Insufficient evidence to determine truth

**Example Interaction**:
```
User: "The moon landing happened in 1969. @jeb fact check"
Jeb: "Verdict: ACCURATE (High Confidence)
      Claim verified by multiple reliable sources:
      • NASA official records
      • Independent analysis from [source]
      • Historical documentation from [source]"
```

### Intelligent Routing

Jeb uses a hybrid classification system to understand user intent:

**Heuristic Classification**: Fast keyword matching for obvious cases
- "summary" → Summary action
- "fact check" → Factcheck action
- "verify" → Factcheck action

**LLM Classification**: Fallback to AI when keywords are ambiguous
- Analyzes full context and conversational intent
- Handles natural language requests without exact keywords
- More flexible but slightly higher latency

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                    Pubky Network                        │
│              (Homeservers + Nexus API)                  │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Mention Poller     │ ← Polls for @jeb mentions
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Event Bus (Redis)  │ ← mention.received.v1
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │       Router         │ ← Classifies intent
         │  (Heuristics + LLM)  │
         └──────────┬───────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│ Summary Workers │   │ Factcheck Workers│
│  (Horizontal    │   │  (Horizontal     │
│   Scaling)      │   │   Scaling)       │
└────────┬────────┘   └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
         ┌──────────────────────┐
         │   Reply Publisher    │ → Posts to Pubky
         └──────────────────────┘
```

### Components

**Mention Poller**:
- Queries [[PubkyNexus|Pubky Nexus]] API for mentions
- Tracks last processed mention to avoid duplicates
- Emits `mention.received.v1` events to Redis Streams
- Configurable polling interval (default: 30s)

**Router**:
- Consumes mention events from Redis Streams
- Applies heuristic keyword matching first
- Falls back to LLM classification if needed
- Emits action-specific events (e.g., `action.summary.requested.v1`)
- Stores routing decisions for audit trail

**Action Workers**:
- **Summary Workers**: Generate thread summaries using AI
- **Factcheck Workers**: Verify claims using web search + AI
- Horizontally scalable for load distribution
- Each worker type runs in its own consumer group

**Reply Publisher**:
- Receives completed responses from workers
- Performs final safety checks (wordlist filtering)
- Publishes replies to Pubky via [[Explore/PubkyCore/SDK|Pubky SDK]]
- Stores published replies for auditability

### Data Flow

1. **Mention Detection**: Poller finds new @jeb mentions
2. **Event Emission**: Mention stored in DB, event sent to Redis
3. **Intent Classification**: Router determines user intent
4. **Action Processing**: Workers execute appropriate logic
5. **Response Generation**: AI creates human-readable response
6. **Safety Validation**: Content checked against wordlist
7. **Publication**: Reply posted to Pubky network

### Technology Stack

- **Language**: TypeScript/Node.js 20+
- **Database**: PostgreSQL (mention tracking, audit logs)
- **Event Bus**: Redis Streams (event-driven architecture)
- **AI Providers**: Groq (default), OpenAI, Anthropic, OpenRouter
- **Web Search**: Brave Search API (via MCP protocol)
- **Pubky Integration**: `@synonymdev/pubky` SDK
- **Data Validation**: `pubky-app-specs` for schema compliance
- **Observability**: Winston logging, Prometheus metrics, health endpoints

## Deployment

### Quick Start with Docker Compose

The fastest way to run Jeb:

```bash
# Clone repository
git clone https://github.com/pubky/pubky-ai-bot
cd pubky-ai-bot

# Configure environment
cp .env.example .env
# Edit .env with your configuration (see below)

# Start all services (bot, PostgreSQL, Redis)
docker compose up -d

# Check logs
docker compose logs -f pubky-ai-bot

# Stop services
docker compose down
```

### Configuration

#### Required Environment Variables

```bash
# Bot Identity (generate at https://iancoleman.io/bip39/)
PUBKY_BOT_MNEMONIC="word1 word2 ... word12"

# AI Provider (Groq is free for development)
AI_PRIMARY_PROVIDER=groq
GROQ_API_KEY=gsk_your_groq_api_key

# Pubky Network
PUBKY_NETWORK=testnet  # or: mainnet (when ready)
```

#### Optional Configuration

```bash
# AI Models (per action)
AI_MODEL_SUMMARY=llama-3.1-8b-instant
AI_MODEL_FACTCHECK=llama-3.1-8b-instant
AI_MODEL_CLASSIFIER=llama-3.1-8b-instant

# Brave Search for fact-checking
BRAVE_API_KEY=your_brave_api_key

# Database (auto-configured by Docker Compose)
DATABASE_URL=postgres://user:pass@localhost:5432/pubkybot
REDIS_URL=redis://localhost:6379/0

# Polling
MENTION_POLL_INTERVAL_MS=30000  # 30 seconds

# Performance
WORKER_CONCURRENCY_SUMMARY=2
WORKER_CONCURRENCY_FACTCHECK=2
```

### AI Provider Setup

#### Groq (Free for Development)

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create an API key
3. Set `GROQ_API_KEY=gsk_...` in `.env`
4. Uses fast Llama 3.1 models

#### OpenAI

1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Set `AI_PRIMARY_PROVIDER=openai`
3. Set `OPENAI_API_KEY=sk-...`
4. Configure `AI_MODEL_SUMMARY=gpt-4o-mini` (or other model)

#### Anthropic

1. Get API key from [console.anthropic.com](https://console.anthropic.com)
2. Set `AI_PRIMARY_PROVIDER=anthropic`
3. Set `ANTHROPIC_API_KEY=sk-ant-...`
4. Configure `AI_MODEL_SUMMARY=claude-3-5-sonnet-latest`

#### OpenRouter

1. Get API key from [openrouter.ai](https://openrouter.ai)
2. Set `AI_PRIMARY_PROVIDER=openrouter`
3. Set `OPENROUTER_API_KEY=sk-or-...`
4. Configure models using OpenRouter model names

### Production Deployment

#### Horizontal Scaling

Run multiple worker instances for high load:

```bash
# Single instance for poller + router (stateful polling)
npm start

# Scale summary workers horizontally
NODE_ENV=production WORKER_TYPE=summary npm start &
NODE_ENV=production WORKER_TYPE=summary npm start &
NODE_ENV=production WORKER_TYPE=summary npm start &

# Scale factcheck workers horizontally
NODE_ENV=production WORKER_TYPE=factcheck npm start &
NODE_ENV=production WORKER_TYPE=factcheck npm start &
```

#### Kubernetes Deployment

```yaml
# Poller + Router (single replica)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jeb-poller
spec:
  replicas: 1  # Must be 1 (stateful polling)
  template:
    spec:
      containers:
      - name: jeb-poller
        image: pubky/jeb-bot:latest
        env:
        - name: NODE_ENV
          value: production

---

# Summary Workers (scale as needed)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jeb-summary-workers
spec:
  replicas: 3  # Scale based on load
  template:
    spec:
      containers:
      - name: jeb-summary
        image: pubky/jeb-bot:latest
        env:
        - name: WORKER_TYPE
          value: summary

---

# Factcheck Workers (scale as needed)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jeb-factcheck-workers
spec:
  replicas: 3  # Scale based on load
  template:
    spec:
      containers:
      - name: jeb-factcheck
        image: pubky/jeb-bot:latest
        env:
        - name: WORKER_TYPE
          value: factcheck
```

### Database Migrations

On first deployment or after updates:

```bash
# Run migrations
npm run db:migrate

# Or via Docker
docker compose exec pubky-ai-bot npm run db:migrate
```

## Observability

### Health Endpoints

**Comprehensive Health Check**:
```http
GET /api/health
```

Returns detailed status of all services:
- Database connectivity
- Redis connectivity
- AI provider availability
- Last mention poll time
- Worker status

**Kubernetes Readiness Probe**:
```http
GET /api/health/ready
```

Returns 200 when service is ready to accept traffic.

**Kubernetes Liveness Probe**:
```http
GET /api/health/live
```

Returns 200 when service is alive (restarts if fails).

### Prometheus Metrics

```http
GET /metrics
```

Exported metrics include:
- `jeb_mentions_received_total` - Total mentions processed
- `jeb_actions_executed_total` - Actions by type and status
- `jeb_action_duration_seconds` - Action execution time
- `jeb_replies_published_total` - Successful replies
- `jeb_ai_api_calls_total` - AI API usage by provider
- `jeb_ai_tokens_used_total` - Token consumption tracking
- `jeb_redis_operations_total` - Redis stream operations
- `jeb_db_query_duration_seconds` - Database performance

### Structured Logging

Winston-based logging with JSON output for production:

```json
{
  "timestamp": "2025-01-05T10:30:00.000Z",
  "level": "info",
  "message": "Action completed",
  "mentionId": "abc123",
  "actionType": "summary",
  "durationMs": 1234,
  "aiProvider": "groq",
  "tokensUsed": 450
}
```

Log levels: `error`, `warn`, `info`, `debug`

## Safety & Moderation

### Wordlist Filtering

Jeb includes configurable banned term lists to prevent inappropriate responses:

**Configuration** (`config/default.json`):
```json
{
  "safety": {
    "wordlist": {
      "enabled": true,
      "blockOnMatch": true,
      "lists": ["offensive", "spam", "political"]
    }
  }
}
```

**Behavior**:
- Checks generated responses before publishing
- Blocks replies containing banned terms
- Logs blocked content for audit
- Customizable per deployment

### Injection Prevention

Protection against prompt injection attacks:

- Input validation on all user content
- Structured prompts with clear boundaries
- Regex-based injection pattern detection
- AI content safety checks

### Rate Limiting

Per-user rate limiting prevents abuse:
- Configurable limits per time window
- Tracked in Redis for distributed rate limiting
- Graceful degradation when limits exceeded

## Database Schema

### Core Tables

**mentions**: Tracks incoming mentions
- `id` - Unique mention identifier
- `author_pubky` - User who mentioned Jeb
- `content` - Mention text
- `post_id` - Pubky post ID
- `processed_at` - Processing timestamp
- `status` - `pending`, `processing`, `completed`, `failed`, `skipped_old`

**action_executions**: Audit trail for actions
- `id` - Execution identifier
- `mention_id` - Reference to mention
- `action_type` - `summary`, `factcheck`, etc.
- `status` - `pending`, `success`, `failed`
- `duration_ms` - Execution time
- `tokens_used` - AI token consumption
- `error_details` - Failure context (if failed)

**artifacts**: Stores generated content
- `id` - Artifact identifier
- `action_execution_id` - Reference to execution
- `artifact_type` - `summary`, `evidence`, `sources`
- `content` - Generated content (JSONB)

**replies**: Published responses
- `id` - Reply identifier
- `mention_id` - Original mention
- `post_id` - Published Pubky post ID
- `content` - Reply text
- `published_at` - Publication timestamp

**routing_decisions**: Classification audit
- `id` - Decision identifier
- `mention_id` - Mention being classified
- `method` - `heuristic` or `llm`
- `action_type` - Determined action
- `confidence` - Classification confidence (LLM only)
- `reasoning` - Why this action was chosen

### Event Sourcing

All state changes are event-driven:
- Events stored in Redis Streams
- Database reflects event-derived state
- Enables replay and debugging
- Supports horizontal scaling

## Advanced Features

### MCP Integration

Jeb uses Model Context Protocol for tool integration:

**Brave Search Tool**:
- Queries Brave Search API for factual verification
- Configurable result limits and timeouts
- Source credibility scoring
- Automatic retry with exponential backoff

**Docker MCP Server**:
- Separate container for MCP tools (`Dockerfile.brave-mcp`)
- Communicates with main bot via stdio protocol
- Isolated tool execution environment

### Idempotency

All operations are idempotent:

**Idempotency Keys**:
- Mention ingestion: `mention:{mentionId}`
- Routing decisions: `route:{mentionId}`
- Action executions: `action:{actionType}:{mentionId}`

**TTL**: 24 hours (prevents duplicate processing)

**Benefits**:
- Safe to retry failed operations
- Prevents duplicate replies
- Handles network failures gracefully

### Dead Letter Queue

Failed messages moved to DLQ for investigation:

```bash
# Check DLQ length
redis-cli xlen pubky:dlq

# Read failed messages
redis-cli xread STREAMS pubky:dlq 0

# Reprocess from DLQ
npm run reprocess -- --from-dlq
```

### Reprocessing

Manually reprocess mentions:

```bash
# Reprocess specific mention
npm run reprocess -- --mention-id abc123

# Reprocess recent failures
npm run reprocess:recent

# Reprocess with limits
npm run reprocess:limited -- --limit 10
```

## Development

### Local Development Setup

```bash
# Install dependencies
npm ci

# Start PostgreSQL and Redis (via Docker Compose)
docker compose up -d postgres redis

# Run migrations
npm run db:migrate

# Start development server with hot reload
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test:coverage

# Run tests in watch mode
npm test:watch

# Run tests in Docker (includes DB and Redis)
npm run test:docker
```

Test categories:
- Unit tests: Individual service logic
- Integration tests: Database operations
- E2E tests: Full workflow simulations

### Code Quality

```bash
# Lint TypeScript
npm run lint
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck
```

## Use Cases

### Community Moderation

Use Jeb to help moderators:
- Summarize long complaint threads
- Fact-check claims in disputes
- Provide context for moderation decisions

### News Verification

Combat misinformation:
- Fact-check breaking news claims
- Provide source citations
- Assess claim credibility

### Thread Digests

Help users catch up:
- Summarize active discussions
- Extract key points from long threads
- Highlight consensus or disagreements

### Educational Support

Assist learning:
- Verify historical or scientific claims
- Provide sources for further reading
- Summarize complex explanations

### Research Assistance

Aid researchers:
- Quick literature verification
- Source finding
- Claim cross-referencing

## Limitations & Considerations

### AI Model Limitations

- **Hallucinations**: AI may generate plausible but incorrect information
- **Bias**: Models reflect training data biases
- **Context Window**: Limited thread history can be processed
- **Cost**: AI API calls incur costs at scale

### Network Dependencies

- **Homeserver Availability**: Relies on homeserver uptime
- **Nexus API**: Depends on [[PubkyNexus|Pubky Nexus]] for mention polling
- **Web Search**: Fact-checking requires Brave API access
- **Redis/PostgreSQL**: Infrastructure dependencies

### Factchecking Constraints

- **Source Quality**: Limited by search engine results
- **Real-time Events**: May not have recent information
- **Subjective Topics**: Works best for objective facts
- **Language**: Primarily English (model-dependent)

### Privacy Considerations

- **Public Interactions**: All mentions and replies are public
- **AI Provider**: Content sent to third-party AI APIs
- **Search Queries**: Fact-check queries sent to Brave
- **Audit Logs**: All interactions logged for debugging

### Operational Considerations

- **Polling Latency**: 30s default delay before responding
- **AI Rate Limits**: Provider-specific throughput limits
- **Token Budgets**: Large threads may be truncated
- **Safety Trade-offs**: Wordlist may block legitimate content

## Future Enhancements

Potential improvements for Jeb:

- **Multi-language Support**: Automatic translation and localization
- **Image Analysis**: OCR and image fact-checking
- **Sentiment Analysis**: Detect and respond to emotional tone
- **Thread Visualization**: Generate visual summaries (graphs, timelines)
- **Collaborative Filtering**: User feedback on response quality
- **Custom Actions**: Plugin system for extensible capabilities
- **Real-time Streaming**: WebSocket-based instant responses
- **Fine-tuned Models**: Domain-specific model training
- **Federated Learning**: Privacy-preserving model improvement
- **Voice Responses**: Audio summary generation

## Resources

- **Repository**: [https://github.com/pubky/pubky-ai-bot](https://github.com/pubky/pubky-ai-bot)
- **Docker Images**: [Docker Hub](https://hub.docker.com/r/pubky/jeb-bot) (if published)
- **Configuration Examples**: [config/](https://github.com/pubky/pubky-ai-bot/tree/main/config)
- **Migration Files**: [src/infrastructure/database/migrations/](https://github.com/pubky/pubky-ai-bot/tree/main/src/infrastructure/database/migrations)

### AI Providers

- **Groq**: [https://console.groq.com](https://console.groq.com)
- **OpenAI**: [https://platform.openai.com](https://platform.openai.com)
- **Anthropic**: [https://console.anthropic.com](https://console.anthropic.com)
- **OpenRouter**: [https://openrouter.ai](https://openrouter.ai)

### Related Tools

- **BIP39 Mnemonic Generator**: [https://iancoleman.io/bip39/](https://iancoleman.io/bip39/)
- **Brave Search API**: [https://brave.com/search/api/](https://brave.com/search/api/)
- **Model Context Protocol**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)

## See Also

- [[Explore/PubkyApp/Introduction|Pubky App]] - Social network where Jeb operates
- [[PubkyNexus|Pubky Nexus]] - Backend API for mention polling
- [[Explore/PubkyCore/SDK|Pubky SDK]] - SDK used for posting replies
- [[Homeserver]] - Where Jeb's posts are stored
- [[Explore/Technologies/PubkyRing|Pubky Ring]] - Identity management (for bot account)

