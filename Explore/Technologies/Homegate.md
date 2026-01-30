# Homegate: Homeserver Signup Gatekeeping Service

**Homegate** is a backend service that manages and controls signups for [[Homeservers|Pubky Homeservers]]. It provides verification mechanisms to prevent spam and abuse while preserving user privacy, implementing both SMS verification and Lightning Network payment verification for homeserver access.

## Overview

When operating a public homeserver, spam prevention is critical. Homegate acts as a gatekeeper, requiring users to prove their authenticity before gaining access to create accounts on a homeserver. Unlike traditional centralized signup systems, Homegate is designed to:

- **Prevent spam**: Rate-limit signups per phone number or require economic commitment via Lightning payments
- **Preserve privacy**: Use cryptographic hashing (Argon2id with Blake3 pepper) to protect phone number privacy
- **Remain optional**: Homeserver operators can choose to use Homegate, implement their own solution, or allow open signups
- **Support multiple verification methods**: SMS codes or Lightning Network payments

### Use Case

Homegate solves the problem expressed in [[FAQ#Q37]]: "How do users join Pubky App? Via invite codes from homeservers. Prevents spam while preserving privacy."

While the FAQ mentions "invite codes," Homegate implements a more sophisticated system using:
1. **SMS verification**: Send a code to a phone number, verify ownership
2. **Lightning payment verification**: Generate a BOLT11 invoice, verify payment

## Architecture

### Components

**HTTP API Server** (`axum`):
- RESTful endpoints for verification flows
- OpenAPI specification for API documentation
- CORS support for browser-based clients
- Request origin tracking for abuse prevention

**SMS Verification Service**:
- Integration with [Prelude](https://docs.prelude.so/) SMS provider
- Rate limiting per phone number (weekly/annual limits)
- Cryptographic phone number hashing for privacy
- Session reuse for pending verifications

**Lightning Network Verification Service**:
- Integration with [PhoenixD](https://github.com/ACINQ/phoenixd) Lightning node
- BOLT11 invoice generation
- Real-time payment tracking via WebSocket
- Background payment synchronization

**Database Layer** (PostgreSQL + SQLx):
- Verification request tracking
- Rate limit enforcement
- Payment status management
- Migration system for schema evolution

**Security Layer**:
- Argon2id password hashing for phone numbers
- Blake3-based pepper stored securely on disk
- Per-IP rate limiting
- User-agent tracking

### Technology Stack

- **Language**: Rust
- **Web Framework**: Axum 0.8
- **Database**: PostgreSQL via SQLx
- **SMS Provider**: Prelude API
- **Lightning**: PhoenixD via HTTP + WebSocket APIs
- **Cryptography**: Argon2id (hashing), Blake3 (pepper)

## Verification Methods

### SMS Verification

Users verify phone number ownership by receiving and entering a verification code.

#### Flow

1. **Request Code**: `POST /sms_verification/send_code`
   - Submit phone number in E.164 format (e.g., `+30123456789`)
   - Service checks rate limits (default: 2/week, 4/year per number)
   - Creates Prelude verification session
   - Sends SMS code to phone number

2. **Verify Code**: `POST /sms_verification/verify_code`
   - Submit phone number and 6-digit code
   - Service validates code with Prelude
   - Returns success/failure

3. **Get Status**: `GET /sms_verification/status/{phone_number}`
   - Check if phone number is verified
   - Returns verification state

#### Rate Limits

Configurable per homeserver deployment:
- **Weekly limit**: `HG_MAX_SMS_VERIFICATIONS_PER_WEEK` (default: 2)
- **Annual limit**: `HG_MAX_SMS_VERIFICATIONS_PER_YEAR` (default: 4)

These limits prevent:
- Phone number farming
- Bulk account creation
- Verification code abuse

#### Privacy Protection

Phone numbers are **never stored in plaintext**:

1. **Blake3 Pepper**: Secret value generated on first run, stored at `/.homegate/pepper.txt`
2. **Argon2id Hashing**: Phone number + pepper → cryptographic hash
3. **Database Storage**: Only hash is stored, not original phone number

**⚠️ Critical**: If `pepper.txt` is lost, existing verifications cannot be matched to new requests, breaking rate limit enforcement.

#### Session Reuse

Multiple `send_code` requests for the same phone number reuse the existing Prelude session:
- Prevents SMS flooding
- Reduces costs for homeserver operators
- User can request code resend without creating new session

### Lightning Network Verification

Users verify economic commitment by paying a Lightning Network invoice.

#### Flow

1. **Create Verification**: `POST /ln_verification`
   - Optional amount and description
   - Service generates BOLT11 invoice via PhoenixD
   - Returns verification ID and invoice string

2. **Check Status**: `GET /ln_verification/{verification_id}`
   - Check current payment status
   - Returns: `pending`, `paid`, `expired`, or `failed`

3. **Await Payment**: `GET /ln_verification/{verification_id}/await`
   - Long-polling endpoint (30s timeout)
   - Waits for payment confirmation
   - Returns immediately if already paid

4. **Background Sync**: Continuous WebSocket connection to PhoenixD
   - Monitors all incoming payments in real-time
   - Updates verification status automatically
   - Handles reconnections and error recovery

#### Payment Amounts

Configurable by homeserver operator:
- **Minimum amount**: Prevent dust attacks
- **Default amount**: Balance between accessibility and spam prevention
- **Custom amounts**: Allow users to pay more for priority, donations, etc.

#### Economic Anti-Spam

Lightning payments provide natural spam resistance:
- **Cost per signup**: Makes bulk account creation expensive
- **Instant verification**: No waiting for confirmations
- **Privacy-preserving**: No personal information required
- **Censorship-resistant**: Lightning Network is permissionless

## API Reference

### SMS Verification Endpoints

#### Send Verification Code

```http
POST /sms_verification/send_code
Content-Type: application/json

{
  "phoneNumber": "+30123456789"
}
```

**Responses**:
- `200 OK`: Code sent successfully
- `400 Bad Request`: Invalid phone number format
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: SMS service failure

#### Verify Code

```http
POST /sms_verification/verify_code
Content-Type: application/json

{
  "phoneNumber": "+30123456789",
  "code": "123456"
}
```

**Responses**:
- `200 OK`: Code verified successfully
- `400 Bad Request`: Invalid code
- `404 Not Found`: No pending verification
- `410 Gone`: Verification expired

#### Get Status

```http
GET /sms_verification/status/{phoneNumber}
```

**Responses**:
- `200 OK`: Returns JSON with verification status
- `404 Not Found`: Phone number not verified

### Lightning Network Endpoints

#### Create Verification

```http
POST /ln_verification
Content-Type: application/json

{
  "amountSat": 1000,
  "description": "Homeserver signup verification"
}
```

**Response** (200 OK):
```json
{
  "verificationId": "550e8400-e29b-41d4-a716-446655440000",
  "invoice": "lnbc10n1...",
  "amountSat": 1000,
  "expiresAt": "2025-01-05T12:00:00Z"
}
```

#### Get Verification Status

```http
GET /ln_verification/{verificationId}
```

**Response** (200 OK):
```json
{
  "verificationId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "paid",
  "amountSat": 1000,
  "paidAt": "2025-01-05T11:30:00Z"
}
```

**Status values**: `pending`, `paid`, `expired`, `failed`

#### Await Payment

```http
GET /ln_verification/{verificationId}/await
```

Long-polling endpoint that waits up to 30 seconds for payment:
- Returns immediately if already paid
- Times out after 30s if still pending
- Client should retry if timeout occurs

## Deployment

### Prerequisites

- PostgreSQL database
- Prelude API account (for SMS)
- PhoenixD Lightning node (for Lightning payments)
- Rust toolchain (for building from source)

### Configuration

Set environment variables (see `.env.example` in repository):

```bash
# Database
DATABASE_URL=postgres://user:pass@localhost:5432/homegate

# Prelude SMS
PRELUDE_API_KEY=your_prelude_api_key
PRELUDE_PROJECT_ID=your_project_id

# PhoenixD Lightning
PHOENIXD_URL=http://localhost:9740
PHOENIXD_PASSWORD=your_phoenixd_password

# Rate Limits (optional)
HG_MAX_SMS_VERIFICATIONS_PER_WEEK=2
HG_MAX_SMS_VERIFICATIONS_PER_YEAR=4

# Server
HG_PORT=8080
HG_HOST=0.0.0.0
```

### Running

#### Development

```bash
# Clone repository
git clone https://github.com/pubky/homegate
cd homegate

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
cargo run -- migrate

# Start server
cargo run
```

#### Production

```bash
# Build release binary
cargo build --release

# Run migrations
./target/release/homegate migrate

# Start service
./target/release/homegate serve
```

#### Docker

```bash
# Build image
docker build -t homegate .

# Run with environment
docker run -d \
  --name homegate \
  -p 8080:8080 \
  --env-file .env \
  homegate
```

### Database Migrations

Homegate uses SQLx for database migrations:

```bash
# Run all pending migrations
cargo run -- migrate

# Create new migration
sqlx migrate add create_new_table

# Rollback last migration (if supported)
cargo run -- migrate revert
```

Migrations are located in `src/infrastructure/sql/migrations/`.

### Critical: Pepper Security

On first run, Homegate generates a **pepper** file at `/.homegate/pepper.txt`:

**⚠️ BACKUP THIS FILE**

If lost:
- Cannot match existing phone number hashes to new verification requests
- Rate limits will not be enforced correctly
- Existing verified users may be unable to re-verify

**Security recommendations**:
- Store pepper in encrypted backup
- Restrict file permissions (`chmod 600`)
- Include in disaster recovery plan
- Never commit to version control

## Integration with Homeservers

Homegate is designed to integrate with [[Homeservers|Pubky Homeserver]] signup flows:

### Typical Integration

1. **User initiates signup** on homeserver web interface
2. **Homeserver redirects** to Homegate verification flow
3. **User completes verification** (SMS or Lightning)
4. **Homegate returns success** to homeserver
5. **Homeserver creates account** using [[Explore/Pubky Core/SDK|Pubky Core SDK]]

### Verification Token Flow

After successful verification, Homegate can issue a signed token:
- Homeserver verifies token signature
- Token contains verification method, timestamp, rate limit info
- Prevents verification bypass attacks

### Self-Hosted vs. Shared

**Self-Hosted Homegate**:
- Full control over verification policies
- Custom rate limits
- Private SMS/Lightning credentials
- Isolated user base

**Shared Homegate**:
- Multiple homeservers share one Homegate instance
- Centralized rate limiting across homeservers
- Reduced operational overhead
- Shared anti-spam database

## Testing

### Unit Tests

```bash
# Test individual components
cargo test --lib
```

### Integration Tests

```bash
# Requires PostgreSQL
DATABASE_URL=postgres://postgres:postgres@localhost:5432/homegate_test \
  cargo test
```

### E2E HTTP Tests

```bash
# Full HTTP integration tests with mocked SMS/Lightning
DATABASE_URL=postgres://postgres:postgres@localhost:5432/homegate_test \
  cargo test --lib e2e::
```

Test structure:
- **Unit tests**: IP extraction, hashing logic
- **Service tests**: Business logic, database operations
- **E2E tests**: Full HTTP flows with WireMock for external APIs

## Use Cases

### Public Homeserver Operation

Run a public homeserver with spam protection:
- Require SMS verification for all signups
- Rate limit accounts per phone number
- Preserve user privacy with hashed identifiers

### Lightning-Gated Community

Create a homeserver requiring payment for access:
- Set minimum Lightning payment amount
- Immediate verification upon payment
- No personal information required
- Donations support homeserver operation

### Hybrid Verification

Offer users a choice:
- SMS verification (free, but rate-limited)
- Lightning payment (instant, any amount)
- Different verification levels for different features

### Regional Homeserver

Operate a homeserver for specific region:
- SMS verification validates phone number locality
- Rate limits prevent cross-border spam
- Lightning fallback for international users

### Development/Testing

Run a homeserver for development:
- Low Lightning payment amounts (1 sat)
- Relaxed SMS rate limits
- Easy cleanup between test runs

## Operational Considerations

### Costs

**SMS Verification**:
- Prelude charges per SMS sent
- Typical cost: $0.01-0.10 per SMS (varies by country)
- Rate limits reduce cost exposure

**Lightning Verification**:
- PhoenixD requires Lightning node operation
- Incoming payments incur routing fees (~1%)
- Channel liquidity management
- On-chain fees for channel opens/closes

### Reliability

**SMS Dependencies**:
- Prelude API uptime
- International SMS delivery reliability
- Phone number portability issues

**Lightning Dependencies**:
- PhoenixD node uptime
- Lightning Network routing reliability
- Channel liquidity availability
- WebSocket connection stability

### Scalability

**Database**:
- PostgreSQL handles millions of verifications
- Index on phone number hashes for performance
- Regular cleanup of expired verifications

**SMS Service**:
- Prelude scales automatically
- Consider multiple SMS providers for redundancy

**Lightning Service**:
- PhoenixD requires channel capacity monitoring
- Automated channel rebalancing recommended
- Consider Lightning Service Provider (LSP) for larger scale

### Privacy

**SMS Verification**:
- Phone numbers hashed before storage
- Pepper protects against rainbow tables
- Argon2id makes brute-force infeasible
- No plaintext phone numbers in logs

**Lightning Verification**:
- No personal information collected
- Payment amounts are visible on Lightning Network
- Invoice descriptions should not contain PII
- Payment hashes cannot be linked to users without invoices

## Security Considerations

### Threat Model

**Attacks Homegate Prevents**:
- Bulk account creation via SMS farming
- Phone number enumeration attacks
- Verification code brute-forcing
- Rate limit bypass attempts

**Attacks Homegate Does NOT Prevent**:
- Stolen phone numbers (SIM swapping)
- Stolen Lightning payments (compromised wallets)
- Sophisticated adversaries with large phone number pools
- State-level phone number access

### Best Practices

1. **Rotate pepper periodically** (with migration strategy)
2. **Monitor rate limit patterns** for abuse
3. **Set up alerts** for SMS/Lightning service failures
4. **Regular database backups** including pepper file
5. **Rate limit per IP** in addition to per phone number
6. **Log verification attempts** for abuse analysis
7. **Use HTTPS** for all API endpoints
8. **Validate all input** (phone numbers, codes, amounts)

## Limitations

### Phone Number Verification

- **SMS delivery**: Not guaranteed in all countries
- **Phone number recycling**: Old numbers may be reassigned
- **VoIP numbers**: May not receive SMS
- **Rate limit bypass**: Users with multiple phone numbers
- **Cost**: SMS fees add up for high-volume homeservers

### Lightning Network Verification

- **Technical barrier**: Users need Lightning wallet
- **Liquidity**: Homeserver needs sufficient inbound liquidity
- **Network fees**: May exceed verification amount for small payments
- **UX complexity**: More steps than SMS for non-technical users
- **Volatility**: Sat amounts may need adjustment based on BTC price

### General

- **Not a complete KYC solution**: Verifies possession, not identity
- **Privacy vs. abuse trade-off**: Better privacy = easier to abuse
- **Centralization risk**: SMS provider is single point of failure
- **Pepper loss**: Unrecoverable without backups

## Future Enhancements

Potential improvements for Homegate:

- **Multiple SMS providers**: Failover and redundancy
- **CAPTCHA verification**: Browser-based spam prevention
- **Email verification**: Additional verification method
- **OAuth/OIDC**: Social login as verification
- **Reputation systems**: Trust scores for verified users
- **Geographic restrictions**: Limit by country/region
- **Time-based rate limits**: Daily/hourly limits
- **Payment-based rate limit increases**: Pay more = higher limits
- **Multi-factor verification**: Require SMS + Lightning
- **Verification marketplace**: Allow third-party verifiers

## Resources

- **Repository**: [https://github.com/pubky/homegate](https://github.com/pubky/homegate)
- **OpenAPI Spec**: [openapi.yaml](https://github.com/pubky/homegate/blob/main/openapi.yaml)
- **Prelude Documentation**: [https://docs.prelude.so/](https://docs.prelude.so/)
- **PhoenixD Documentation**: [https://github.com/ACINQ/phoenixd](https://github.com/ACINQ/phoenixd)

## See Also

- [[Homeservers]] - Pubky homeserver documentation
- [[Explore/Pubky Core/Introduction|Pubky Core]] - Core protocol and SDK
- [[FAQ#Q37]] - How users join Pubky App
- [[Censorship]] - Censorship resistance principles

