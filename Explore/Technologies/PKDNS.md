# PKDNS: Public Key DNS Server

**PKDNS** is a DNS server that enables self-sovereign and censorship-resistant domain names by resolving [[0.Introduction|PKARR]] (Public Key Addressable Resource Records) hosted on the [[MainlineDHT|Mainline DHT]]. It bridges the gap between traditional DNS infrastructure and public key-based domains, allowing anyone to access the decentralized web using standard DNS protocols.

## Overview

PKDNS makes public key domains accessible to everyone by acting as a DNS resolver that understands both traditional ICANN domains and PKARR-based public key domains. When you query a public key domain (52-character base32 encoded public key), PKDNS fetches the signed DNS records from the Mainline DHT, verifies the signature, and returns them to your browser or application—just like traditional DNS.

### Key Innovation

Instead of relying on ICANN registrars and centralized name servers, PKDNS enables:
- **Self-sovereign domains**: Your Ed25519 public key IS your domain
- **Censorship resistance**: Records are distributed across ~10 million DHT nodes
- **No registration fees**: Publish records directly to the DHT
- **Cryptographic verification**: All records are signed and verifiable
- **ICANN fallback**: Still resolves traditional domains seamlessly

## How It Works

### Resolution Flow

1. **User queries domain**: Browser or app requests `7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy`
2. **PKDNS recognizes format**: Identifies 52-character base32 as a public key domain
3. **DHT lookup**: Queries the Mainline DHT for PKARR records associated with that public key
4. **Signature verification**: Validates that records were signed by the private key holder
5. **Cache and return**: Caches the verified records and returns DNS response to client
6. **ICANN fallback**: For traditional domains like `example.com`, forwards to upstream DNS (default: 8.8.8.8)

### Public Key Domain Format

Public key domains use base32-encoded Ed25519 public keys:
- **Length**: 52 characters (z-base-32 encoding)
- **Example**: `7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy`
- **Subdomains**: Support standard subdomain syntax (e.g., `blog.7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy`)

### Supported Record Types

PKDNS currently supports the most common DNS record types:
- **A**: IPv4 addresses
- **AAAA**: IPv6 addresses
- **TXT**: Text records
- **CNAME**: Canonical name records
- **MX**: Mail exchange records

For other record types, use bind9 or similar full-featured DNS servers.

## Features

### DNS-over-HTTPS (DoH)

PKDNS supports DNS-over-HTTPS, enabling encrypted DNS queries from browsers:
- Configure browser to use a PKDNS DoH endpoint
- All DNS queries encrypted over HTTPS
- Prevents ISP snooping on DNS traffic
- Public DoH endpoints available in [servers.txt](https://github.com/pubky/pkdns/blob/master/servers.txt)

### Caching

Multi-layer caching for optimal performance:
- **Response cache**: Caches DNS responses to reduce DHT queries
- **PKARR cache**: Stores verified PKARR records from DHT
- **Configurable TTL**: Respects DNS TTL values from records

### Rate Limiting

Built-in protection against abuse:
- Per-IP rate limiting to prevent DoS attacks
- Configurable thresholds and timeouts
- Protects both the server and the DHT network

### Dynamic DNS (DynDNS)

Support for dynamic IP updates:
- CLI tool for publishing updated A/AAAA records
- Automated IP detection from multiple providers
- Periodic republishing to keep records alive on DHT
- Perfect for home servers and dynamic IP addresses

### Hybrid Resolution

Seamlessly resolves both public key domains and traditional domains:
- Public key domains (52 chars) → DHT lookup
- ICANN domains → Upstream DNS fallback
- Configurable upstream DNS server
- No special client configuration needed

## Getting Started

### Using Public Hosted Servers

The easiest way to try PKDNS:

1. **Choose a public server**: Check [servers.txt](https://github.com/pubky/pkdns/blob/master/servers.txt) for available DNS-over-HTTPS endpoints

2. **Configure your browser**:
   - Firefox: Settings → Network Settings → Enable DNS over HTTPS → Custom → Enter DoH URL
   - Chrome: Settings → Privacy and security → Security → Use secure DNS → Custom → Enter DoH URL
   - Edge: Settings → Privacy, search, and services → Security → Use secure DNS → Choose provider

3. **Test it works**: Visit [http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/](http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/)

### Self-Hosting PKDNS

#### Pre-Built Binaries

```bash
# Download latest release for your platform
wget https://github.com/pubky/pkdns/releases/latest/download/pkdns-linux-x64.tar.gz

# Extract
tar -xzf pkdns-linux-x64.tar.gz

# Run (requires port 53 access)
sudo ./pkdns --verbose
```

#### Build from Source

```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Clone and build
git clone https://github.com/pubky/pkdns.git
cd pkdns
cargo build --release

# Run
sudo ./target/release/pkdns --verbose
```

#### Docker Deployment

```bash
# Using Docker Compose
git clone https://github.com/pubky/pkdns.git
cd pkdns
docker compose up -d

# Or pull directly
docker pull synonymsoft/pkdns
docker run -p 53:53/udp -p 53:53/tcp synonymsoft/pkdns
```

### Configuration

#### Command-Line Options

```bash
pkdns [OPTIONS]

Options:
  -f, --forward <FORWARD>      # ICANN fallback DNS server [default: 8.8.8.8:53]
  -v, --verbose                # Show verbose output [default: false]
  -c, --config <CONFIG>        # Path to config file
  -p, --pkdns-dir <PKDNS_DIR>  # Base directory for data [default: ~/.pkdns]
  -h, --help                   # Print help
  -V, --version                # Print version
```

#### Configuration File

Location: `~/.pkdns/pkdns.toml`

Example configuration:
```toml
# Upstream DNS for ICANN domains
fallback_dns = "8.8.8.8:53"

# Enable DNS-over-HTTPS
[doh]
enabled = true
port = 443
cert_path = "/path/to/cert.pem"
key_path = "/path/to/key.pem"

# Rate limiting
[rate_limit]
requests_per_minute = 100
burst_size = 20

# Caching
[cache]
max_entries = 10000
ttl_seconds = 300
```

See [sample-config.toml](https://github.com/pubky/pkdns/blob/master/server/sample-config.toml) for full options.

### Verification

Test that PKDNS is working correctly:

#### Verify Public Key Domain Resolution

```bash
# Replace SERVER_IP with your PKDNS server IP (127.0.0.1 for local)
nslookup 7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy SERVER_IP
```

**Expected output**: IP address(es) for the public key domain

#### Verify ICANN Domain Fallback

```bash
nslookup example.com SERVER_IP
```

**Expected output**: Standard DNS response for example.com

#### Browser Test

Navigate to: [http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/](http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/)

**Expected**: Website loads successfully

> **Tip**: Always add `./` at the end of public key domain URLs, otherwise browsers may search instead of resolve.

## Publishing Your Own Public Key Domain

To publish a website on a public key domain:

### Generate Key Pair

```bash
# Using pkdns CLI
pkdns-cli generate

# Outputs:
# Public key: 7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy
# Private key (seed): <52-character secret>
```

**⚠️ Security**: Store your private key securely. Anyone with the private key can publish records for your domain.

### Create DNS Zone File

Create a standard DNS zone file with your records:

```dns
@ 3600 IN A 203.0.113.42
@ 3600 IN AAAA 2001:db8::1
www 3600 IN CNAME @
```

### Publish to DHT

```bash
# Using pkdns CLI
pkdns-cli publish --seed <your-private-key> --zone-file records.zone

# Or with dynamic IP detection
pkdns-cli publish --seed <your-private-key> --zone-file records.zone --detect-ip
```

### Keep Records Alive

DHT records expire after a few hours. For persistent domains:

```bash
# Manual republishing
while true; do
  pkdns-cli publish --seed <your-private-key> --zone-file records.zone
  sleep 3600  # Republish every hour
done

# Or use DynDNS features for automation
```

See the [publishing guide](https://medium.com/pubky/how-to-host-a-public-key-domain-website-v0-6-0-ubuntu-24-04-57e6f2cb6f77) for detailed instructions.

## Use Cases

### Self-Sovereign Web Publishing

Publish websites without:
- Domain registrars (no annual fees)
- DNS hosting services (no third-party control)
- Renewal requirements (keys don't expire)
- Censorship risk (distributed across DHT)

### Decentralized Applications

Enable dApps to use human-readable addresses:
- No smart contract required for DNS
- Cryptographic verification built-in
- Works with existing web infrastructure
- Low latency (~100ms typical resolution)

### Development & Testing

Instant domain names for development:
- Generate test domains in seconds
- No registration or setup fees
- Update records instantly
- Perfect for CI/CD pipelines

### Privacy-Focused Browsing

Access censorship-resistant content:
- Records can't be seized or altered
- No central authority to pressure
- Works through standard DNS protocols
- Compatible with existing privacy tools

### Personal Identity

Use your public key as your digital identity:
- Single domain across all services
- Provable ownership via signatures
- No platform lock-in
- Portable across applications

## Architecture

### Components

**Server (`pkdns`)**: Main DNS server process
- Listens on port 53 (UDP/TCP) for DNS queries
- Optional DNS-over-HTTPS endpoint (port 443)
- Multi-threaded request handling
- Integration with Mainline DHT client

**CLI Tool (`pkdns-cli`)**: Command-line utilities
- Key generation and management
- Record publishing and updates
- Zone file parsing
- Dynamic IP detection

**PKARR Resolver**: Core resolution logic
- DHT query coordination
- Signature verification
- Record caching and TTL management
- Bootstrap node management

**Response Cache**: Query optimization
- In-memory cache of DNS responses
- Configurable size and TTL
- LRU eviction policy

### Performance Characteristics

- **Resolution time**: ~100-300ms for cold cache (DHT lookup)
- **Cached resolution**: <1ms (memory lookup)
- **Throughput**: Thousands of queries per second (cached)
- **Memory footprint**: ~50MB base + cache size
- **DHT network**: ~10 million nodes, high availability

### Security Model

- **Cryptographic verification**: All PKARR records are Ed25519-signed
- **No trust required**: Clients verify signatures independently
- **Censorship resistance**: Distributed storage across massive DHT
- **DoS protection**: Rate limiting and query validation
- **Privacy**: DoH encryption for DNS queries

## Limitations & Considerations

### Port 53 Requirement

DNS servers traditionally require port 53, which needs root/admin privileges:
- **Linux**: Use `sudo` or configure capabilities
- **macOS**: System services may occupy port 53 (Docker Desktop)
- **Windows**: May conflict with other DNS services
- **Workaround**: Use DNS-over-HTTPS only (doesn't require port 53)

### DHT Ephemeral Storage

Records expire after a few hours and must be republished:
- **Active domains**: Need periodic republishing (~hourly)
- **Automated solutions**: DynDNS features handle this
- **Trade-off**: Prevents DHT pollution but requires maintenance

### Record Size Limit

PKARR packets must be ≤1000 bytes:
- Limits number of records per domain
- Use CNAME indirection for complex setups
- Consider multiple public keys if needed

### Limited Record Type Support

Currently supports only: A, AAAA, TXT, CNAME, MX
- Use bind9 for advanced record types (SRV, CAA, etc.)
- May expand in future versions

### Browser Trailing Slash

Browsers may search instead of resolve domains:
- Always append `./` to public key domains in URL bar
- Example: `http://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy./`
- Not needed for bookmarks or links

## Troubleshooting

### "Address already in use" Error

**Problem**: Port 53 is occupied by another service

**Solutions**:
- **Docker Desktop** (macOS): Disable DNS proxy in Docker settings
- **systemd-resolved** (Ubuntu): [Disable or reconfigure](https://www.linuxuprising.com/2020/07/ubuntu-how-to-free-up-port-53-used-by.html)
- **Alternative**: Run only DoH server (doesn't need port 53)

### PKDNS Domains Don't Resolve

**Check**:
1. Server running: `ps aux | grep pkdns`
2. Port accessible: `nc -zvu 127.0.0.1 53`
3. DHT connectivity: Check verbose logs for bootstrap
4. Firewall rules: Allow UDP/TCP port 53

### ICANN Domains Don't Resolve

**Problem**: Upstream DNS not configured correctly

**Solution**:
```bash
# Use reliable upstream DNS
pkdns -f 8.8.8.8:53  # Google DNS
pkdns -f 1.1.1.1:53  # Cloudflare DNS
```

### Slow Resolution Times

**Causes**:
- Cold cache (first query to DHT is slower)
- DHT connectivity issues
- Network latency

**Solutions**:
- Pre-warm cache for frequently accessed domains
- Increase cache size in config
- Check network connectivity to DHT bootstrap nodes

## Resources

- **Repository**: [https://github.com/pubky/pkdns](https://github.com/pubky/pkdns)
- **Releases**: [https://github.com/pubky/pkdns/releases](https://github.com/pubky/pkdns/releases)
- **Docker Image**: [https://hub.docker.com/r/synonymsoft/pkdns](https://hub.docker.com/r/synonymsoft/pkdns)
- **Public Servers**: [servers.txt](https://github.com/pubky/pkdns/blob/master/servers.txt)
- **Zone Explorer**: [https://pkdns.net](https://pkdns.net)
- **Telegram Chat**: [https://t.me/pubkycore](https://t.me/pubkycore)

### Documentation

- [DNS-over-HTTPS Setup](https://github.com/pubky/pkdns/blob/master/docs/dns-over-https.md)
- [Dynamic DNS Configuration](https://github.com/pubky/pkdns/blob/master/docs/dyn-dns.md)
- [Logging Configuration](https://github.com/pubky/pkdns/blob/master/docs/logging.md)
- [Publishing Guide](https://medium.com/pubky/how-to-host-a-public-key-domain-website-v0-6-0-ubuntu-24-04-57e6f2cb6f77)

### Blog Posts

- [Mainline DHT Censorship Explained](https://medium.com/pubky/mainline-dht-censorship-explained-b62763db39cb)
- [Public Key Domains Censorship Resistance Explained](https://medium.com/pubky/public-key-domains-censorship-resistance-explained-33d0333e6123)

### Related Tools

- **[pkarr](https://github.com/pubky/pkarr)**: Core PKARR library and specification
- **[pkdns-digger](https://github.com/pubky/pkdns-digger)**: Web-based DNS record lookup tool for PKARR/PKDNS
- **[pkdns-vanity](https://github.com/jphastings/pkdns-vanity)**: Generate vanity public key domains
- **[awesome-pubky](https://github.com/aljazceru/awesome-pubky)**: Curated list of Pubky resources

## See Also

- [[0.Introduction|PKARR]] - Public Key Addressable Resource Records
- [[MainlineDHT|Mainline DHT]] - Distributed hash table powering PKDNS
- [[DNS]] - Traditional Domain Name System
- [[DoH]] - DNS over HTTPS protocol
- [[Explore/PubkyCore/Introduction|Pubky Core]] - Core protocol and infrastructure

