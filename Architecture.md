# Pubky Architecture Overview

This page provides a comprehensive overview of the Pubky ecosystem architecture, showing how all components work together to enable decentralized, censorship-resistant applications.

---

## System Architecture

```mermaid
flowchart TB
    subgraph Identity[Identity Layer]
        Ring[Pubky Ring]
        Keys[Key Pairs]
    end
    
    subgraph Discovery[Discovery Layer]
        PKARR[PKARR Records]
        DHT[Mainline DHT]
        PKDNS[PKDNS Servers]
    end
    
    subgraph Storage[Storage Layer]
        HS1[Homeserver 1]
        HS2[Homeserver 2]
        HSN[Homeserver N]
    end
    
    subgraph Apps[Application Layer]
        PubkyApp[Pubky App]
        Nexus[Pubky Nexus]
        Custom[Custom Apps]
    end
    
    Ring --> Keys
    Keys --> PKARR
    PKARR --> DHT
    PKDNS --> DHT
    PKARR --> HS1
    HS1 --> Nexus
    HS2 --> Nexus
    Nexus --> PubkyApp
    Custom --> HS1
```

---

## Layer Breakdown

### Identity Layer

The foundation of Pubky is cryptographic identity based on **[[Key Pair|key pairs]]**.

**Components:**
- **[[Explore/Technologies/Pubky Ring|Pubky Ring]]**: Mobile app for secure key management
- **Key Pairs**: Ed25519 public/private key pairs
- **Recovery Files**: Encrypted backups for key recovery

**How It Works:**
1. User generates a key pair (public + private key)
2. Public key becomes permanent identity (z-base-32 encoded)
3. Private key stays secure on device, used for signing
4. Recovery file enables backup and cross-device usage

**Key Properties:**
- ✅ Self-sovereign (no registration with authorities)
- ✅ Portable across devices
- ✅ Permanent (never changes)
- ✅ Cryptographically secure

---

### Discovery Layer

The discovery layer enables finding homeservers and resolving identities without central servers.

**Components:**
- **[[0.Introduction|PKARR]]**: Public Key Addressable Resource Records
- **[[Mainline DHT]]**: Distributed Hash Table (10M+ nodes)
- **[[PKDNS]]**: DNS servers for resolving public key domains

**How It Works:**

```mermaid
sequenceDiagram
    participant User
    participant Ring as Pubky Ring
    participant DHT as Mainline DHT
    participant PKDNS
    participant HS as Homeserver
    
    User->>Ring: Create Identity
    Ring->>DHT: Publish PKARR Record
    Note over DHT: Record contains homeserver URL
    User->>PKDNS: Resolve public key
    PKDNS->>DHT: Fetch PKARR Record
    DHT->>PKDNS: Return signed record
    PKDNS->>User: Return homeserver URL
    User->>HS: Connect to homeserver
```

**Key Features:**
- Decentralized discovery (no central directory)
- Censorship resistant (15+ years proven infrastructure)
- Self-published (users control their records)
- Updateable (switch homeservers anytime)

---

### Storage Layer

**[[Homeservers]]** store user data in a key-value format over HTTP/HTTPS.

**Architecture:**

```mermaid
flowchart LR
    User1[User 1] --> HS1[Homeserver A]
    User2[User 2] --> HS1
    User3[User 3] --> HS2[Homeserver B]
    User4[User 4] --> HS3[Homeserver C]
    
    HS1 --> DB1[(PostgreSQL)]
    HS2 --> DB2[(LMDB)]
    HS3 --> DB3[(Files)]
```

**Key Properties:**
- **User Choice**: Pick any homeserver or run your own
- **Data Ownership**: You control your data
- **Portability**: Switch homeservers without losing data
- **Persistence Backends**: Files, LMDB, PostgreSQL, or SQL

**API Operations:**
- `PUT /pub/app/path` - Store data
- `GET /pub/app/path` - Retrieve data
- `DELETE /pub/app/path` - Delete data
- `LIST /pub/app/` - List directory

---

### Application Layer

Applications consume data from homeservers, either directly or through aggregation services.

**Architecture Patterns:**

#### 1. Simple Client-Homeserver

```mermaid
flowchart LR
    Client[Client App] <--> HS[Homeserver]
```

**Use Case**: Personal apps, simple tools, direct data access

#### 2. Global Aggregator

```mermaid
flowchart LR
    HS1[Homeserver 1] --> Agg[Aggregator]
    HS2[Homeserver 2] --> Agg
    HS3[Homeserver N] --> Agg
    Agg --> Client[Client App]
```

**Use Case**: Social feeds, search, discovery (e.g., [[Explore/Pubky App/Backend/Pubky Nexus|Pubky Nexus]])

#### 3. Custom Backend

```mermaid
flowchart TB
    HS[Homeservers] --> Agg[Custom Aggregator]
    Agg --> ML[ML Inference]
    Agg --> Search[Search Engine]
    ML --> API[Custom API]
    Search --> API
    API --> Client[Client]
```

**Use Case**: Advanced features, recommendations, specialized processing

---

## Data Flow Example: Publishing a Post

```mermaid
sequenceDiagram
    participant User
    participant Ring as Pubky Ring
    participant App as Pubky App
    participant HS as Homeserver
    participant Nexus
    
    User->>Ring: Authorize App
    Ring->>App: Grant session token
    User->>App: Create post
    App->>HS: PUT /pub/pubky.app/posts/123
    HS->>HS: Verify signature
    HS->>HS: Store post data
    HS->>App: 200 OK
    Nexus->>HS: Poll /events endpoint
    Nexus->>HS: Fetch new post
    Nexus->>Nexus: Index post
    App->>Nexus: GET /v0/stream/posts
    Nexus->>App: Feed with new post
```

---

## Component Responsibilities

### Pubky Core

**[[Explore/Pubky Core/Introduction|Pubky Core]]** provides:
- Protocol specification
- Homeserver implementation
- SDK for all platforms
- Authentication system
- API standards

**Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)

### Pubky Ring

**[[Explore/Technologies/Pubky Ring|Pubky Ring]]** handles:
- Key generation and storage
- App authorization
- Session management
- Recovery file creation

**Platforms**: iOS, Android (React Native)

### Pubky Nexus

**[[Explore/Pubky App/Backend/Pubky Nexus|Pubky Nexus]]** provides:
- Real-time aggregation
- Social graph indexing
- Search and discovery
- High-performance API

### PKDNS

**[[PKDNS]]** enables:
- Public key domain resolution
- DNS-over-HTTPS support
- Traditional ICANN domain support
- Self-hosted or public instances

**Repository**: [github.com/pubky/pkdns](https://github.com/pubky/pkdns)

### Homegate

**[[Homegate]]** provides:
- SMS verification
- Lightning payment verification
- Spam prevention
- Privacy-preserving signup

**Repository**: [github.com/pubky/homegate](https://github.com/pubky/homegate)

---

## Infrastructure Tools

### Development Tools

- **[[Explore/Technologies/Pubky Docker|Pubky Docker]]**: Full stack in one command
- **[[Explore/Technologies/Pubky CLI|Pubky CLI]]**: Command-line homeserver management
- **[[Explore/Technologies/Pubky Explorer|Pubky Explorer]]**: Web-based data browser

### Work in Progress

- **[[Explore/Technologies/Paykit|Paykit]]**: Payment protocol
- **[[Explore/Technologies/Pubky Noise|Pubky Noise]]**: Encrypted communication

---

## Security Model

### Authentication

See [[Authentication]] for the full authentication flow.

### Data Integrity

**All data operations are signed:**
1. Client creates data
2. Client signs hash with private key
3. Homeserver verifies signature
4. Data stored with signature
5. Anyone can verify authenticity

### Trust Model

**What you trust:**
- ✅ Mathematics (cryptography)
- ✅ Your own keys
- ⚠️ Your homeserver for availability (not integrity)

**What you DON'T trust:**
- ❌ Central authorities
- ❌ DNS registrars
- ❌ Server operators to verify data (math does it)

---

## Scalability Characteristics

### Horizontal Scaling

| Component | Scaling Method |
|-----------|----------------|
| **Homeservers** | Add more servers, users distribute naturally |
| **PKDNS** | Run multiple instances, cache aggressively |
| **Nexus** | Shard by user/data type, read replicas |
| **Mainline DHT** | Already 10M+ nodes, proven at scale |

### Performance Metrics

**Typical Latencies:**
- PKARR lookup (cached): < 100ms
- PKARR lookup (DHT): 500-2000ms
- Homeserver GET: 50-200ms
- Nexus API: 10-50ms (sub-millisecond for cached)

---

## Comparison to Other Architectures

### vs Traditional Web (Client-Server)

| Aspect | Traditional | Pubky |
|--------|-------------|-------|
| Identity | Username@service | Public key (permanent) |
| Data Storage | Company servers | User-chosen homeservers |
| Portability | Locked-in | Full portability |
| Censorship | Easy | Very difficult |

### vs Blockchain

| Aspect | Blockchain | Pubky |
|--------|-----------|-------|
| Fees | Transaction fees | None |
| Speed | Slow (blocks) | Instant (HTTP) |
| Storage | Expensive | Cheap (standard hosting) |
| Scalability | Limited | Web-scale |

### vs Pure P2P

| Aspect | Pure P2P | Pubky |
|--------|----------|-------|
| Availability | Must be online | Homeservers always on |
| Mobile-Friendly | Difficult | Native support |
| Performance | Variable | Consistent |
| Discovery | Complex | DHT + PKDNS |

---

## Deployment Patterns

### Personal Use

```
User Device → Pubky Ring → Personal Homeserver
```

**Best for**: Personal data, backups, full control

### Small Team

```
Team Members → Shared Homeserver → Team Apps
```

**Best for**: Collaborative projects, startups

### Social Application

```
Users → Public Homeservers → Nexus Aggregator → Social App
```

**Best for**: Social media, discovery platforms

### Enterprise

```
Users → Enterprise Homeserver + Custom Aggregator + Private Nexus → Internal Apps
```

**Best for**: Organizations with custom requirements

---

## See Also

- **[[Getting Started]]**: Get started with Pubky
- **[[Explore/Pubky Core/Introduction|Pubky Core Overview]]**: Protocol details
- **[[Explore/Pubky Core/SDK|SDK Documentation]]**: Build applications
- **[[Explore/Pubky Core/API|API Reference]]**: HTTP API specification
- **[[Comparisons]]**: How Pubky differs from alternatives
- **[[FAQ]]**: Frequently asked questions

