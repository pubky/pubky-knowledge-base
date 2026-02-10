# Domain Name System (DNS)

The Domain Name System (DNS) is a hierarchical and distributed naming system that translates human-readable domain names (e.g., `www.example.com`) into IP addresses (e.g., `192.0.2.1`) that computers use to identify each other on the network. This process simplifies internet navigation by allowing users to access websites using memorable names instead of numerical addresses.

## How DNS Works

When you enter a domain name in your browser, a multi-step lookup process occurs:

1. **Query Initiation**: Your device checks its local DNS cache for the IP address
2. **Recursive Resolver**: If not cached, the query goes to a recursive DNS resolver (usually provided by your ISP)
3. **Root Nameserver**: The resolver queries a root nameserver to find the TLD (Top Level Domain) nameserver
4. **TLD Nameserver**: The TLD nameserver (e.g., for `.com`) directs to the authoritative nameserver
5. **Authoritative Nameserver**: This server returns the IP address for the requested domain
6. **Response**: The IP address is returned to your device and cached for future use

This hierarchical system enables billions of domain names to be resolved efficiently across the internet.

## DNS Record Types

DNS supports multiple record types, each serving different purposes:

| Record Type | Purpose | Example |
|-------------|---------|---------|
| **A** | Maps domain to IPv4 address | `example.com → 192.0.2.1` |
| **AAAA** | Maps domain to IPv6 address | `example.com → 2001:db8::1` |
| **CNAME** | Canonical name (alias) | `www.example.com → example.com` |
| **TXT** | Text records for verification | SPF, DKIM, domain verification |
| **MX** | Mail exchange servers | Email routing |
| **NS** | Nameserver records | Delegates subdomain to nameserver |
| **HTTPS** | HTTPS service binding | Modern service configuration |
| **SVCB** | Service binding | Generic service endpoints |

## Centralization and Control Issues

Traditional DNS has fundamental limitations:

### 1. Centralized Control
- **ICANN governance**: A single organization controls the root zone
- **Registrar dependency**: You rent domain names, never truly own them
- **Payment required**: Annual fees to maintain domains
- **Revocable**: Domains can be seized or suspended

### 2. Censorship Vulnerability
- **DNS filtering**: Governments and ISPs can block domain resolution
- **Selective blocking**: Easy to censor specific sites
- **Surveillance**: DNS queries reveal browsing activity
- **Single point of failure**: Attacking DNS infrastructure impacts accessibility

### 3. Privacy Concerns
- **Unencrypted queries**: Traditional DNS (port 53) sends queries in plaintext
- **Activity tracking**: ISPs and intermediaries can monitor all DNS requests
- **Data harvesting**: DNS providers can collect and monetize query data

## Why PKDNS is Needed

[[PKDNS]] addresses these limitations by creating a decentralized, censorship-resistant alternative:

- **Self-sovereign domains**: Your public key IS your domain - no registration, no rent
- **No central authority**: Uses [[MainlineDHT|Mainline DHT]] instead of ICANN hierarchy
- **Censorship resistant**: Distributed across millions of nodes, impossible to block
- **True ownership**: You control your identity and domain through cryptographic keys
- **Privacy**: No centralized entity tracks your DNS queries

PKDNS bridges the gap between traditional DNS and the decentralized web, enabling [[0.Introduction|PKARR]] records to function as domains while maintaining compatibility with existing infrastructure.

## Security Considerations

### Traditional DNS Security Issues

1. **DNS Spoofing**: Attackers can provide false DNS responses
2. **Cache Poisoning**: Malicious data injected into DNS caches
3. **Man-in-the-Middle**: Unencrypted queries can be intercepted
4. **DDoS Attacks**: DNS servers are frequent targets

### Modern DNS Security Solutions

- **DNSSEC**: Cryptographic signatures verify DNS responses (but doesn't encrypt queries)
- **[[DoH|DNS over HTTPS]]**: Encrypts DNS queries to prevent surveillance
- **DNS over TLS (DoT)**: Similar encryption using TLS protocol
- **Encrypted SNI**: Hides the domain name during TLS handshake

### PKDNS Security Model

PKDNS provides superior security through:
- **Cryptographic authentication**: All records are signed with private keys
- **Distributed verification**: Anyone can verify signatures independently
- **No trust required**: Eliminates need to trust centralized authorities
- **Resilient infrastructure**: Distributed across DHT nodes, no single point of failure

## DNS in the Pubky Ecosystem

Pubky uses DNS technology in innovative ways:

1. **[[PKDNS]]**: DNS server that resolves public key domains from [[0.Introduction|PKARR]] records
2. **Hybrid approach**: Supports both traditional ICANN domains and public key domains
3. **[[DoH]] integration**: Provides encrypted DNS resolution
4. **Homeserver discovery**: PKARR records contain DNS-like entries pointing to [[Homeserver|homeservers]]

## See Also

- **[[PKDNS]]**: Public key DNS implementation
- **[[0.Introduction|PKARR]]**: Public key addressable resource records
- **[[MainlineDHT|Mainline DHT]]**: Distributed hash table powering PKDNS
- **[[DoH]]**: DNS over HTTPS for encrypted queries
- **[[HTTPS]]**: Secure HTTP protocol
