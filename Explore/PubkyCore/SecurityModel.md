---
title: "Security Model"
---

This document describes the security model, threat landscape, and trust assumptions in the Pubky Core platform. Understanding these is essential for both operators and application developers building on the platform.

## Design Philosophy

Pubky Core aims to minimize trust requirements while remaining practical. The key principle is: **users should have a credible exit from misbehaving actors** without losing their identity or data.

This is achieved through:
- Cryptographic identity (keypairs) that users fully control
- Identity based routing. Knowing identity is enough to locate data
- Data portability via [[PubkyBackup|Pubky Backup]] (homeserver mirroring planned but not yet implemented)
- Optional data signing to detect tampering (planned for apps that need it)
- End-to-end encryption for encrypted data (planned; homeserver cannot read)

## Trust Philosophy: "It is OK to trust when there is a Credible Exit"

The Pubky security model accepts that some trust is unavoidable in practical systems. Rather than attempting to eliminate all trust (which often leads to unusable systems), the approach is:

1. **Choose Wisely**: Users select their homeserver operator. This is an explicit trust decision, similar to choosing a bank or email provider. Users who want zero trust can self-host.

2. **Don't Trust Fully**: Mirroring and backups allow users to restore data after detecting misbehavior. If your primary homeserver modifies data or acts maliciously, your mirrors will show discrepancies. Data replication / backup is a first step for maintaining data availability.

3. **[[CredibleExit|Credible Exit]]**: The key guarantee is that users can always leave. A misbehaving homeserver cannot hold your identity hostage because:
   - Your keypair never leaves your device. [[PubkyRing|Pubky Ring]] is the reference key manager implementation
   - Your data can be backed up and migrated
   - [[0.Introduction|PKARR]] lets you point your identity to a new homeserver immediately

### The Detection Problem

[[CredibleExit|Credible exit]] has a prerequisite: **knowing when to exit**. A malicious homeserver that misbehaves silently (withholding data, tampering, surveillance) can cause harm before the user realizes something is wrong.

This is the hardest unsolved problem in the security model. Planned mitigations:

| Detection Method | How It Helps |
|------------------|--------------|
| Mirroring with cross-checks | Primary and mirror disagree → problem detected |
| Client-side verification | User's device periodically verifies its own data |
| Reputation signals | Community feedback surfaces bad actors |

The principle: make misbehavior **detectable**, not just **escapable**.

### Cold Key Philosophy

[[PubkyRing|Pubky Ring]] keeps identity keys isolated from third-party apps:

- **Minimal Exposure**: The private key never leaves Ring — apps never see it
- **Infrequent Use**: Ring is only needed when granting access to a new app
- **Session Delegation**: After authorization, apps operate with session tokens issued by the homeserver
- **No Recovery**: If you lose both your device and your mnemonic, your identity is permanently lost

This model minimizes the attack surface: even a compromised app cannot steal your identity, only its own session.

### PKARR as Source of Truth

[[0.Introduction|PKARR]] DNS records are the authoritative source for identity resolution:

- When you update your PKARR record to point to a new homeserver, the old one loses authority immediately
- Clients that properly resolve PKARR will always find your current homeserver
- A malicious old homeserver cannot impersonate you after migration

This is why credible exit works: identity follows the keys, not the server.

## Threat Actors

The security model considers three primary threat actors:

### Homeserver Operators

**Current Capabilities:**
- Can read all user data (public and private)
- Can tamper with user data without detection
- Can deny service (refuse to serve data)
- Can log access patterns (who reads what)

**After Planned Improvements:**
- Cannot read encrypted data
- Cannot modify signed data without detection (for apps using signing)
- Can still deny service (availability attacks)
- Can still observe metadata (access patterns)

**Note on signing**: Data signing will be optional. Not every use case needs cryptographic verification, and signing adds overhead. Apps can choose whether to sign data based on their trust requirements.

**Mitigation:**
Users maintain local backups via [[PubkyBackup|Pubky Backup]], ensuring data portability even if the homeserver refuses to cooperate. Homeserver mirroring (slave servers) is planned but not yet implemented.

### Network Attackers

**Threats:**
- Man-in-the-middle attacks on unencrypted connections
- Eavesdropping on network traffic
- Replay attacks using captured auth tokens

**Mitigations:**
- HTTPS for all homeserver communication
- AuthToken timestamps with 45-second validity window (prevents replay)
- Capability scoping limits damage from compromised tokens
- Auth tokens encrypted between authenticator and requesting app via [[HTTPRelay|relay]]

### DHT Attackers

The Mainline DHT is subject to known attack vectors (Sybil attacks, eclipse attacks, denial of service). These are mitigated by the [BEP42](https://www.bittorrent.org/beps/bep_0042.html) security extension and the sheer scale of the network (10M+ nodes). For detailed analysis, see:
- [Mainline DHT — Censorship Resistance Explained](https://medium.com/pubky/mainline-dht-censorship-explained-b62763db39cb)
- [BitTorrent's Mainline DHT Security Assessment (INRIA)](https://inria.hal.science/inria-00577043/document)
- [Real-world Sybil Attacks in BitTorrent Mainline DHT (IEEE)](https://ieeexplore.ieee.org/document/6503215/)

Pubky adds additional resilience through multiple relay fallbacks and periodic republishing of records.

### Design Trade-offs

These are intentional design decisions, not oversights:

| Decision | Homeserver Trusted? | Rationale |
|----------|--------------------| ---------|
| Session token issuance | Yes | Practical trade-off; keeping Ring's keys isolated means homeserver must issue tokens |
| Capability enforcement | Yes | Homeserver trusted to honor the capabilities Ring authorized |
| Session revocation | Yes | Homeserver trusted to delete sessions when Ring requests |
| Key custody | No | Ring is sole key holder; no homeserver recovery path |
| Identity resolution | No | [[0.Introduction|PKARR]] is authoritative; homeserver cannot claim false identity |
| Data authenticity | Yes (for now) | Planned: data signing will remove this trust requirement |

**Why trust the homeserver for sessions?**

The alternative would require Ring to be involved in every operation, which conflicts with keeping keys isolated. By trusting the homeserver for session management:
- Ring is only used for initial authorization
- Apps get standard session tokens they can use without Ring
- Users can still revoke via Ring, and exit via migration if homeserver misbehaves

### Known Limitations

1. **Session Cookie Collision**: Currently, all sessions share a single authentication cookie. Logging into App B overwrites App A's session. This is a critical bug being addressed via session management rework.

2. **No Data Signing**: Data stored on homeservers is not cryptographically signed. A malicious operator could forge, alter, or delete content without readers detecting it.

3. **Cloud IP Blocking**: BitTorrent DHT nodes commonly block cloud provider IP ranges. Running pkarr/mainline clients directly in Google Cloud or AWS often fails. The solution is using relays hosted in smaller providers.

4. **Mnemonic Fallback Security Risk**: Users without [[PubkyRing|Pubky Ring]] can authenticate by entering their 12-word mnemonic directly on 3rd party apps. This is a security vulnerability — malicious apps could exfiltrate the mnemonic since users cannot verify that client-side JavaScript actually keeps the mnemonic local. The mnemonic should only ever be entered on trusted infrastructure (e.g. Ring or the user's own homeserver). This limitation is being addressed alongside the session management rework.

## Planned Trust Improvements

### Data Signing (Optional Feature, Planned 2026)

The [[SDK]] will optionally sign data on behalf of the user before storing it on the homeserver. Readers can verify the signature against the user's public key.

**After implementation:**
- Homeserver cannot modify signed data without detection
- Readers have proof of authorship for signed content
- Tampering is cryptographically detectable

**Important**: Signing will be optional per-app. Not every use case requires cryptographic verification of data integrity, and signing adds storage and processing overhead.

### Guarded Data (Planned)

Guarded data access control will be enforced by the homeserver, requiring authentication to read. Path conventions are TBD. This is not encryption — the homeserver can still read the data.

**Use case:** Data that should be non-public but where trusting the homeserver is acceptable.

### Encrypted Data (Planned)

End-to-end encryption for encrypted data. Homeserver stores ciphertext and cannot read the content.

**After implementation:**
- Homeserver sees only encrypted blobs
- Only authorized parties can decrypt
- Metadata (access patterns, data sizes) still visible to homeserver

**Quantum Computing Rationale**: The layered approach (encrypted data behind guarded paths) provides defense-in-depth. As quantum computing advances, encryption that is secure today may be cracked in the future. By requiring authentication to access encrypted data, if the encryption is eventually cracked, the access control layer remains as a second barrier.

### Homeserver Mirroring (Planned, Not Yet Started)

Planned primary-backup architecture where slave homeservers would stay in sync with the master.

**Benefits (when implemented):**
- Users could verify their data is properly mirrored
- Users could switch to backup if primary misbehaves
- [[Censorship|Censorship]] would become detectable and escapable, reducing the incentive to attempt it

**Current Status**: This feature is a concept only — implementation has not started. Currently, users should use [[PubkyBackup|Pubky Backup]] to maintain local copies of their data.

## Transport Security

### Pubky TLS (RFC 7250 Raw Public Keys)

For connections to Pubky hosts (addresses like `_pubky.<z32>`), the [[SDK]] uses **PubkyTLS** — TLS with Raw Public Keys as defined in RFC 7250. This removes the need for Certificate Authority chains when connecting to Pubky hosts.

**How it works:**
- The server's public key is known in advance (it's part of the URL/address)
- TLS handshake uses the raw Ed25519 public key instead of an X.509 certificate
- The SDK verifies the connection against the expected public key directly
- No CA trust chain required — the public key IS the identity

**Platform behavior:**
- **Native (Rust)**: Full PubkyTLS support with raw public key verification
- **WASM/Browser**: Uses standard HTTPS through a relay (browsers don't support raw public key TLS)

**ICANN hosts** (regular domains) continue to use standard X.509 TLS with CA verification.

## Authentication Security

### AuthToken Design

The auth protocol uses time-limited, capability-scoped tokens:

```
AuthToken = signature(64) + namespace(10) + version(1) + timestamp(8) + pubky(32) + capabilities
```

**Security Properties:**
- **Namespace**: "PUBKY:AUTH" prevents cross-protocol replay
- **Timestamp**: Must be within 45-second window (prevents replay)
- **Signature**: Ed25519 over message bytes (authenticity)
- **Capabilities**: Scoped permissions limit damage from compromise

### Capability Scoping

Capabilities follow the principle of least privilege:

```
/pub/my-app/:rw       # Read+write to specific directory only
/pub/file.txt:r       # Read-only single file
/:rw                  # Root access (avoid when possible)
```

Apps should request minimal capabilities. Users can review requests in [[PubkyRing|Pubky Ring]] before approval.

### Relay Security

The [[HTTPRelay|HTTP Relay]] encrypts tokens between the authenticator ([[PubkyRing|Pubky Ring]]) and the requesting app using a shared `client_secret`, preventing relay operators from capturing valid auth tokens. See [[HTTPRelay|HTTP Relay]] for the full flow.

## Trust Surface After All Improvements

Even with all planned improvements, some trust remains:

| Aspect | Trust Required | Notes |
|--------|---------------|-------|
| Data integrity | App's choice | Signed data is verifiable; signing is optional |
| Data confidentiality | None (encrypted) | E2E encryption for encrypted data |
| Data availability | Full trust | Homeserver can still deny service |
| Metadata | Full trust | Homeserver sees access patterns |
| Key management | User responsibility | Lost keys = lost identity (by design) |

### Residual Risks

1. **Availability**: Homeservers can deny service. Currently mitigated by [[PubkyBackup|Pubky Backup]] for data portability. Homeserver mirroring (planned) would allow seamless switching.

2. **Metadata Leakage**: Homeservers see who accesses what data, timing patterns, data sizes. This is inherent to any server-based system.

3. **Key Loss**: Users are responsible for their 12-word mnemonic phrase. Loss means permanent loss of that identity.

4. **Key Compromise**: If an attacker obtains a user's private key, they control the identity. Mitigated by secure storage in device keychains.

## Recommendations

### For Users

- Keep your 12-word recovery phrase secure and backed up (each pubky has its own phrase)
- Loss of mnemonic = permanent loss of that identity (by design, no recovery)
- Review capability requests carefully before approving in [[PubkyRing|Pubky Ring]]
- Use [[PubkyBackup|Pubky Backup]] to maintain local copies of your data
- Homeserver mirroring is not yet available — backups are currently your credible exit path

### For App Developers

- Request minimal capabilities needed for your app
- Validate data signatures when reading from homeservers
- Don't store sensitive data in unencrypted form
- Handle auth failures gracefully (sessions can be revoked)

### For Homeserver Operators

- Run TLS/HTTPS for all connections
- Monitor for anomalous access patterns
- Implement rate limiting to prevent abuse
- Keep software updated for security patches
- Consider running relays in non-cloud environments for DHT access

## Failure Scenarios and Recovery

This section shows how [[CredibleExit|credible exit]] works in practice across common failure modes.

### Scenario: Homeserver Goes Down

| Phase | What Happens | User Action |
|-------|--------------|-------------|
| Immediate | Data becomes temporarily inaccessible | Wait for recovery or decide to migrate |
| If prolonged | Use [[PubkyBackup|Pubky Backup]] to restore from local backup | Sign up on a new homeserver |
| Recovery | Re-upload data, update [[0.Introduction|PKARR]] record | External links automatically resolve to new location |

Your identity (keypair in Ring) is unaffected. The homeserver going down is an inconvenience, not a catastrophe.

### Scenario: Homeserver Misbehaves

| Misbehavior | Detection | Response |
|-------------|-----------|----------|
| Denies service | May be selective. Unless you're the affected reader, detection relies on others reporting it | Migrate to new homeserver |
| Modifies your data | Hard to detect without signing (planned) | Migrate + warn others |
| Logs access patterns | Inherent to any server model | Accept or self-host |
| Refuses to delete sessions | Ring can't verify compliance | Migrate + rotate pubky if needed |

Misbehavior triggers migration. The homeserver cannot hold your identity hostage because your keypair never lived there.

### Scenario: DHT Unreachable

| Situation | Impact | Fallback |
|-----------|--------|----------|
| Temporary outage | New resolutions fail | Clients use cached homeserver locations |
| Prolonged outage | New users can't discover you | HTTP relays provide alternative resolution |
| Regional blocking | Varies by location | Multiple relay endpoints in different regions |

The DHT is resilient (10M+ nodes, 15+ years running), but even if parts fail, cached data and relays provide continuity.

### Scenario: Mnemonic Leaked

| Consequence | Mitigation |
|-------------|------------|
| Attacker can impersonate you | Create a new pubky immediately |
| Attacker can access your sessions | Revoke all sessions via Ring (if you still have access) |
| Attacker can read your private data | Migrate to new pubky, re-establish relationships |
| Old pubky is compromised forever | No recovery — this is by design (like Bitcoin) |

Mnemonic leakage is catastrophic for that identity. The system doesn't try to recover compromised keys — you create a new identity and move on. This is the trade-off for self-custody.

### Recovery Pattern

Across all failure scenarios, the same pattern applies:

1. **Identity survives** — Your keypair is separate from any infrastructure
2. **Data can be recovered** — Via backups or (planned) mirroring
3. **Exit is always possible** — [[0.Introduction|PKARR]] lets you point your identity elsewhere
4. **Damage is contained** — One failure doesn't cascade to your entire digital life
