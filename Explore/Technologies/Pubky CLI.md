# Pubky CLI

**Pubky CLI** is a command-line tool for interacting with Pubky homeservers. Built in Rust, it provides both user-facing and administrative capabilities for managing homeservers, testing deployments, and automating workflows.

## Overview

Pubky CLI wraps the official [[SDK|Pubky SDK]] and provides:
- **User Operations**: Signup, signin, data management, session handling
- **Admin Operations**: User management, server stats, invite token generation
- **Testing Tools**: Integration with `pubky-testnet` for local development
- **Automation**: Script-friendly interface for CI/CD and deployment automation

## Installation

### From Crates.io

```bash
cargo install pubky-cli
```

### From Source

```bash
git clone https://github.com/pubky/pubky-cli
cd pubky-cli
cargo install --path .
```

### Verify Installation

```bash
pubky-cli --version
```

## Quick Start

### Create Recovery File

Recovery files store encrypted identity keys:

```bash
# Generate recovery file with passphrase
pubky-cli tools generate-recovery ./alice.recovery --passphrase mypass

# Prints the public key
# Example: z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty
```

### User Signup

```bash
# Sign up with homeserver (testnet)
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user signup <homeserver-pubkey> ./alice.recovery --testnet

# With signup code (for gated servers)
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user signup --signup-code <code> <homeserver-pubkey> ./alice.recovery --testnet
```

### Admin Operations

```bash
# Get server info
PUBKY_ADMIN_PASSWORD=admin \
  pubky-cli admin info

# Generate signup token
PUBKY_ADMIN_PASSWORD=admin \
  pubky-cli admin generate-token
```

## User Commands

### Authentication

```bash
# Sign in
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user signin ./alice.recovery --testnet

# Check session
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user session ./alice.recovery --testnet

# Sign out
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user signout ./alice.recovery --testnet
```

### Data Management

```bash
# Publish data from file
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user publish "/pub/myapp/data.json" ./local-file.json ./alice.recovery --testnet

# Get data by path
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user get "/pub/myapp/data.json" ./alice.recovery --testnet

# List directory
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user list "/pub/myapp/" ./alice.recovery --testnet

# Delete data
PUBKY_CLI_RECOVERY_PASSPHRASE=mypass \
  pubky-cli user delete "/pub/myapp/data.json" ./alice.recovery --testnet
```

## Admin Commands

### User Management

```bash
# Disable user
PUBKY_ADMIN_PASSWORD=admin \
  pubky-cli admin user disable <user-pubkey>

# Enable user
PUBKY_ADMIN_PASSWORD=admin \
  pubky-cli admin user enable <user-pubkey>

# Delete user data
PUBKY_ADMIN_PASSWORD=admin \
  pubky-cli admin user delete <user-pubkey> /path/to/file
```

### Server Operations

```bash
# Get server statistics
PUBKY_ADMIN_PASSWORD=admin \
  pubky-cli admin info

# Generate invite/signup token
PUBKY_ADMIN_PASSWORD=admin \
  pubky-cli admin generate-token
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `PUBKY_ADMIN_PASSWORD` | Admin API password | `admin` |
| `PUBKY_CLI_RECOVERY_PASSPHRASE` | Auto-decrypt recovery files | `mypassphrase` |
| `PUBKY_PKARR_BOOTSTRAP` | Override PKARR bootstrap nodes | `node1.example.com:6881,node2.example.com:6881` |
| `PUBKY_PKARR_RELAYS` | Custom PKARR relay URLs | `https://relay1.example.com,https://relay2.example.com` |
| `PUBKY_PKARR_TIMEOUT_MS` | PKARR request timeout | `5000` |

## Shell Completions

Generate tab completion scripts for your shell:

```bash
# Bash
pubky-cli tools completions bash --outfile "$(brew --prefix)/etc/bash_completion.d/pubky-cli"

# Zsh
mkdir -p ~/.zfunc
pubky-cli tools completions zsh --outfile ~/.zfunc/_pubky-cli
echo 'fpath+=("$HOME/.zfunc")' >> ~/.zshrc

# Fish
pubky-cli tools completions fish --outfile ~/.config/fish/completions/pubky-cli.fish

# PowerShell
pubky-cli tools completions powershell --outfile $PROFILE/../Completions/pubky-cli.ps1
```

Supported shells: `bash`, `zsh`, `fish`, `powershell`, `elvish`

## Testing & CI

### Local Testing

```bash
# Run all tests (includes integration tests)
cargo test

# Test uses pubky-testnet internally - no external setup needed
```

### Example Workflow

```bash
#!/bin/bash
# Automated user onboarding script

# 1. Generate recovery file
pubky-cli tools generate-recovery ./user.recovery --passphrase $PASSWORD

# 2. Sign up
PUBKY_CLI_RECOVERY_PASSPHRASE=$PASSWORD \
  pubky-cli user signup $HOMESERVER_PK ./user.recovery --testnet

# 3. Sign in
PUBKY_CLI_RECOVERY_PASSPHRASE=$PASSWORD \
  pubky-cli user signin ./user.recovery --testnet

# 4. Publish initial profile
PUBKY_CLI_RECOVERY_PASSPHRASE=$PASSWORD \
  pubky-cli user publish "/pub/pubky.app/profile.json" ./profile.json ./user.recovery --testnet

echo "User onboarded successfully!"
```

## Use Cases

### Local Development

Test homeserver functionality without building custom clients:
```bash
# Start local homeserver
cargo run -p pubky-homeserver -- --data-dir ~/.pubky

# Test with CLI
pubky-cli admin info
```

### Deployment Automation

Script homeserver configuration and user provisioning:
```bash
# Generate batch signup tokens
for i in {1..100}; do
  PUBKY_ADMIN_PASSWORD=$ADMIN_PASS pubky-cli admin generate-token >> tokens.txt
done
```

### Integration Testing

Validate end-to-end flows in CI:
```bash
# CI test script
cargo test --all
```

### Homeserver Administration

Manage users and monitor server health:
```bash
# Disable abusive user
PUBKY_ADMIN_PASSWORD=admin pubky-cli admin user disable $ABUSER_KEY

# Check server stats
PUBKY_ADMIN_PASSWORD=admin pubky-cli admin info
```

## Architecture

### Project Structure

```
pubky-cli/
├── src/
│   ├── admin.rs      # Admin API wrapper
│   ├── user.rs       # User operations (via Pubky SDK)
│   ├── tools.rs      # Utilities (recovery, completions)
│   ├── util.rs       # Shared helpers
│   └── main.rs       # CLI entry point
├── tests/
│   └── integration.rs # E2E tests with pubky-testnet
└── Cargo.toml
```

### Dependencies

- **pubky SDK** (`0.6.0-rc.6`): User-facing operations
- **pubky-testnet**: Local testing harness
- **clap**: Command-line argument parsing
- **tokio**: Async runtime

## Troubleshooting

### Connection Issues

```bash
# Verify homeserver is running
curl http://127.0.0.1:6287/

# Check admin API
curl http://127.0.0.1:6288/
```

### Recovery File Errors

```bash
# Ensure passphrase is correct
PUBKY_CLI_RECOVERY_PASSPHRASE=wrong-pass pubky-cli user signin ./alice.recovery
# Error: Failed to decrypt recovery file

# Use correct passphrase
PUBKY_CLI_RECOVERY_PASSPHRASE=correct-pass pubky-cli user signin ./alice.recovery
# Success
```

### Testnet vs Production

```bash
# Testnet (local development)
pubky-cli user signup $HOMESERVER_PK ./recovery --testnet

# Production (requires full homeserver URL)
pubky-cli user signup $HOMESERVER_PK ./recovery
```

## Links

- **Crates.io**: [crates.io/crates/pubky-cli](https://crates.io/crates/pubky-cli)
- **Repository**: [github.com/pubky/pubky-cli](https://github.com/pubky/pubky-cli)
- **CI Status**: [GitHub Actions](https://github.com/pubky/pubky-cli/actions)
- **Pubky SDK**: [docs.rs/pubky](https://docs.rs/pubky)

## Related Documentation

- [[SDK|Pubky SDK]] - Client libraries for all platforms
- [[Homeserver|Pubky Homeservers]] - Homeserver deployment and configuration
- [[Pubky Docker|Pubky Docker]] - Full stack Docker environment
- [[API|Pubky Core API]] - HTTP API specification

