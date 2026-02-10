# Pubky Core API Reference

The [[Introduction|Pubky Core]] protocol defines a RESTful HTTP API for storing and retrieving data on [[Homeserver|homeservers]]. This document describes the complete API specification.

## Base URL

All API endpoints are relative to the homeserver base URL:

```
https://homeserver.example.com
```

Homeserver URLs are discovered via [[0.Introduction|PKARR]] records published to the [[Explore/Technologies/Mainline DHT|Mainline DHT]].

## Authentication

See [[Authentication]] for conceptual overview.

### Public Key Authentication

All requests must be authenticated using Ed25519 signatures:

**Headers:**
```
Authorization: Pubky <public_key>:<signature>:<timestamp>
```

**Signature Generation:**
1. Create message: `METHOD:PATH:TIMESTAMP:BODY_HASH`
2. Sign message with Ed25519 private key
3. Encode signature as base64

**Example (conceptual):**
```
Method: PUT
Path: /pub/myapp/data
Timestamp: 1704067200
Body: {"hello":"world"}
Body Hash: sha256(body) = abc123...

Message to sign: "PUT:/pub/myapp/data:1704067200:abc123..."
Signature: sign_ed25519(message, private_key)

Authorization: Pubky 8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo:SGVsbG8gV29ybGQ=:1704067200
```

### Session Tokens

For long-lived connections, use session tokens:

**Request:**
```http
POST /auth/session
Authorization: Pubky <public_key>:<signature>:<timestamp>
Content-Type: application/json

{
  "capabilities": [
    "read:/pub/",
    "write:/pub/myapp/"
  ],
  "ttl": 3600
}
```

**Response:**
```json
{
  "token": "session_abc123...",
  "expires_at": 1704070800
}
```

**Usage:**
```http
GET /pub/myapp/data
Authorization: Bearer session_abc123...
```

## Storage Endpoints

### PUT - Store Data

Store or update data at a path.

**Request:**
```http
PUT /:path
Authorization: Pubky <public_key>:<signature>:<timestamp>
Content-Type: application/octet-stream

<binary data>
```

**Path Format:**
- Must start with `/pub/` (public) or `/private/` (future)
- Maximum length: 1024 bytes
- Allowed characters: `a-z`, `A-Z`, `0-9`, `-`, `_`, `/`, `.`

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "path": "/pub/myapp/data",
  "size": 1234,
  "created_at": 1704067200
}
```

**Error Responses:**
- `400 Bad Request`: Invalid path or data
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `413 Payload Too Large`: Data exceeds limit (default: 10MB)
- `507 Insufficient Storage`: Quota exceeded

### GET - Retrieve Data

Retrieve data from a path.

**Request:**
```http
GET /:path
Authorization: Pubky <public_key>:<signature>:<timestamp>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Length: 1234

<binary data>
```

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Path does not exist

### DELETE - Remove Data

Delete data at a path.

**Request:**
```http
DELETE /:path
Authorization: Pubky <public_key>:<signature>:<timestamp>
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "path": "/pub/myapp/data",
  "deleted_at": 1704067200
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Path does not exist

### LIST - Enumerate Data

List entries under a path prefix (with pagination).

**Request:**
```http
GET /:path?limit=20&cursor=abc123&reverse=false
Authorization: Pubky <public_key>:<signature>:<timestamp>
```

**Query Parameters:**
- `limit` (optional): Maximum entries to return (default: 100, max: 1000)
- `cursor` (optional): Pagination cursor from previous response
- `reverse` (optional): List in reverse order (newest first)

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "entries": [
    {
      "path": "/pub/myapp/posts/001",
      "size": 512,
      "created_at": 1704067200,
      "updated_at": 1704067200
    },
    {
      "path": "/pub/myapp/posts/002",
      "size": 1024,
      "created_at": 1704067300,
      "updated_at": 1704067300
    }
  ],
  "cursor": "next_page_cursor_xyz",
  "has_more": true
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Insufficient permissions

## Capabilities System

Capabilities define what operations a session can perform:

### Capability Syntax

```
<operation>:<path_prefix>
```

**Operations:**
- `read`: GET, LIST operations
- `write`: PUT, DELETE operations
- `*`: All operations

**Examples:**
```
read:/pub/                    # Read all public data
write:/pub/myapp/             # Write to /pub/myapp/* only
*:/pub/myapp/posts/           # Full access to posts
read:/pub/social/profile      # Read specific path
```

### Capability Checking

When a request is made:
1. Check session capabilities
2. Match requested path against capability patterns
3. Verify operation is allowed
4. Execute or deny request

## Event Streaming (Future)

Subscribe to real-time updates on data changes.

**Request:**
```http
GET /events?paths=/pub/myapp/&since=1704067200
Authorization: Bearer session_abc123...
```

**Response (Server-Sent Events):**
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream

event: created
data: {"path":"/pub/myapp/posts/003","size":256,"timestamp":1704067400}

event: updated
data: {"path":"/pub/myapp/profile","size":512,"timestamp":1704067500}

event: deleted
data: {"path":"/pub/myapp/temp","timestamp":1704067600}
```

## Admin Endpoints

Homeserver administrators can access management endpoints:

### GET /admin/stats

Get server statistics.

**Response:**
```json
{
  "users": 1000,
  "total_storage": 1073741824,
  "requests_per_minute": 150,
  "uptime_seconds": 86400
}
```

### GET /admin/users/:public_key

Get user information.

**Response:**
```json
{
  "public_key": "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo",
  "storage_used": 10485760,
  "storage_quota": 104857600,
  "created_at": 1704000000,
  "last_activity": 1704067200
}
```

See [[Homeserver#Admin API]] for complete admin documentation.

## Metrics Endpoint

Prometheus-compatible metrics for monitoring.

### GET /metrics

**Response:**
```
# HELP pubky_requests_total Total HTTP requests
# TYPE pubky_requests_total counter
pubky_requests_total{method="GET",status="200"} 1000
pubky_requests_total{method="PUT",status="200"} 500

# HELP pubky_storage_bytes Total storage used
# TYPE pubky_storage_bytes gauge
pubky_storage_bytes 1073741824

# HELP pubky_active_sessions Current active sessions
# TYPE pubky_active_sessions gauge
pubky_active_sessions 50
```

## Rate Limiting

Homeservers implement rate limiting to prevent abuse:

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067260
```

**Rate Limit Exceeded:**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": "rate_limit_exceeded",
  "message": "Too many requests, try again in 60 seconds"
}
```

**Default Limits:**
- Anonymous: 10 requests/minute
- Authenticated: 100 requests/minute
- Admin: Unlimited

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    "additional": "context"
  }
}
```

**Common Error Codes:**
- `invalid_path`: Path format is invalid
- `invalid_signature`: Authentication signature invalid
- `expired_session`: Session token expired
- `insufficient_permissions`: Operation not allowed
- `storage_quota_exceeded`: User quota exceeded
- `rate_limit_exceeded`: Too many requests
- `server_error`: Internal server error

## Best Practices

### Efficient List Operations

**Paginate large datasets:**
```javascript
async function getAllPosts(client, publicKey) {
    const allPosts = [];
    let cursor = null;
    
    do {
        const response = await client.list(
            `pubky://${publicKey}/pub/myapp/posts/`,
            { limit: 100, cursor }
        );
        
        allPosts.push(...response.entries);
        cursor = response.cursor;
    } while (response.has_more);
    
    return allPosts;
}
```

### Optimize Storage

**Store structured data efficiently:**
```javascript
// Good: Separate entries for each post
PUT /pub/myapp/posts/001  (small JSON)
PUT /pub/myapp/posts/002  (small JSON)
PUT /pub/myapp/posts/003  (small JSON)

// Bad: Single large entry
PUT /pub/myapp/all_posts  (large JSON array)
```

### Handle Errors Gracefully

```javascript
async function robustPut(client, path, data) {
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await client.put(path, data);
        } catch (error) {
            if (error.code === 'rate_limit_exceeded') {
                await sleep(error.retryAfter * 1000);
                continue;
            }
            throw error;
        }
    }
}
```

## Resources

- **[[Introduction|Pubky Core Overview]]**: Main documentation
- **[[SDK|SDK Documentation]]**: Client libraries
- **[[Homeserver|Homeserver Documentation]]**: Server setup
- **Official Docs**: [pubky.github.io/pubky-core](https://pubky.github.io/pubky-core/)
- **Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)

---

**The Pubky Core API provides a simple, RESTful interface for decentralized data storage.**

