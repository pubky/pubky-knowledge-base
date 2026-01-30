# Pubky Ring: Identity Manager for Pubky

> **Your keychain for the Pubky ecosystem. Manage your pubkys, authorize services, and stay in control—no accounts, no passwords.**

## Overview

Pubky Ring is the key manager and identity application for the Pubky ecosystem. It's a native mobile app (iOS and Android) that lets you securely manage your pubkys—the [[Key Pair|public keys]] that power your presence across decentralized applications.

**Core Philosophy:**
- **Self-custodial**: You control your keys, no one else
- **No accounts**: No usernames, no passwords, no registration
- **No tracking**: Your identity data stays on your device
- **Interoperable**: Works seamlessly with Pubky apps

## What You Can Do

### Identity Management
- **Create and manage multiple pubkys**: Each identity is a separate public key
- **Organize identities**: Label and categorize your different personas
- **Switch between identities**: Seamlessly use different pubkys for different contexts
- **Backup and restore**: Secure backup of your keys with recovery options

### Service Authorization
- **Authorize apps**: Grant specific permissions to Pubky applications
- **Revoke access**: Instantly remove app permissions
- **Session management**: View and control all active sessions
- **Granular permissions**: Choose what each app can access

### Cross-Device Sync
- **Sync across devices**: Keep your identities consistent between phone and tablet
- **Secure synchronization**: Encrypted sync using [[Homeservers|homeserver]] storage
- **Multi-device sessions**: Use the same identity on multiple devices simultaneously

### Key Derivation Services
- **Ed25519 identity keys**: Primary Pubky identity keys
- **X25519 Noise keys**: Automatically derived for [[Pubky Noise|encrypted communication]]
- **Session keys**: Temporary keys for app sessions
- **Payment keys**: Support for [[Paykit|payment protocol]] integration

## Architecture

### Native Mobile App
Pubky Ring is built with **React Native**, providing:
- Native performance on iOS and Android
- Platform-specific secure storage (Keychain/Keystore)
- Deep linking support for app integration
- Background services for session management

### Key Storage
**iOS:**
- Keychain Services for secure key storage
- Hardware-backed encryption when available
- Biometric authentication (Face ID/Touch ID)
- Secure Enclave integration

**Android:**
- EncryptedSharedPreferences with hardware-backed keystore
- Biometric authentication (fingerprint/face unlock)
- StrongBox Keymaster support on compatible devices

### Session Management
Pubky Ring manages authentication sessions for connected apps:
- Session creation with capability tokens
- Session expiration and renewal
- Multi-device session coordination
- Session revocation

## Deep Linking & Integration

### Paykit Connect (`paykit-connect://`)
Pubky Ring provides deep link handlers for [[Paykit|Paykit]] integration:

```
paykit-connect://[callback-url]?[parameters]
```

**Flow:**
1. Bitkit (or other wallet) requests Paykit authorization
2. Opens Pubky Ring via deep link
3. User approves in Pubky Ring
4. Ring derives Noise keys and creates session
5. Returns encrypted session data via callback
6. Wallet receives authorization and can use Paykit

**Parameters:**
- `callback_url`: Where to return authorization data
- `app_name`: Requesting application name
- `permissions`: Requested capabilities
- `session_duration`: Requested session lifetime

### Other Deep Links
- `pubky://` - General Pubky protocol handler
- `pkarr://` - PKARR resolution requests
- Custom app-specific handlers

## Noise Key Derivation

Pubky Ring derives [[Pubky Noise|X25519 encryption keys]] from Ed25519 identity keys using HKDF:

```
Ed25519 Identity Key (32 bytes)
    ↓ HKDF-SHA256 with context "pubky-noise-v1"
X25519 Static Key (32 bytes)
    ↓ Used for Noise Protocol IK handshake
Encrypted Communication Channel
```

This allows apps to:
- Use a single identity for both signing and encryption
- Derive consistent encryption keys across devices
- Maintain forward secrecy through ephemeral keys
- Authenticate with Pubky identity system

## Integration with Paykit

[[Paykit|Paykit]] uses Pubky Ring for:

**Session Creation:**
- User authenticates in Ring
- Ring generates session credentials
- Encrypted session returned to wallet
- Wallet can now use Paykit features

**Key Management:**
- Ring stores master Ed25519 key
- Derives X25519 keys for Noise channels
- Manages session rotation
- Handles key backup/recovery

**Cross-Device Authentication:**
- Ring polls relay for pending auth requests
- User approves on trusted device
- Session synchronized via encrypted relay
- Wallet receives authorization on new device

See the [Bitkit + Paykit Integration Master Guide](https://github.com/BitcoinErrorLog/paykit-rs/blob/main/docs/BITKIT_PAYKIT_INTEGRATION_MASTERGUIDE.md) for detailed integration documentation.

## Technical Specifications

### Supported Platforms
- **iOS**: 13.0+
- **Android**: API level 24+ (Android 7.0)
- **React Native**: 0.74+

### Storage Format
Keys are stored in encrypted format:
```json
{
  "version": "1",
  "identities": [
    {
      "id": "unique-id",
      "label": "My Main Identity",
      "publicKey": "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo",
      "created": "2024-01-01T00:00:00Z",
      "lastUsed": "2024-01-05T12:30:00Z"
    }
  ],
  "sessions": [...],
  "settings": {...}
}
```

Private keys never leave the secure storage.

### Security Model

**Threat Protection:**
- ✅ Key theft via malware (hardware-backed storage)
- ✅ Unauthorized app access (user approval required)
- ✅ Man-in-the-middle (cryptographic authentication)
- ✅ Session hijacking (time-limited sessions, rotation)

**Trust Assumptions:**
- Device OS is secure and not compromised
- User approves legitimate authorization requests
- Biometric authentication is properly secured
- Secure storage implementation is sound

**Attack Surface:**
- Deep link handlers (validated and sanitized)
- Session relay communication (encrypted)
- Backup/restore process (user must secure backup)

## User Experience

### Onboarding Flow
1. **Install Pubky Ring** from app store
2. **Create first identity** - generates Ed25519 keypair
3. **Set up security** - enable biometrics, set PIN
4. **Backup keys** - secure recovery phrase or encrypted backup
5. **Connect apps** - authorize Pubky applications

### Daily Usage
- **Quick authorization**: Biometric approval for app requests
- **Session overview**: See all connected apps and active sessions
- **Identity switching**: Tap to switch between personas
- **Permission management**: Review and adjust app permissions

### Privacy Features
- **Local-first**: All data stored on device
- **No telemetry**: No analytics or tracking
- **No cloud sync** (unless user enables encrypted sync)
- **Anonymous**: No registration, no personal information required

## Development & Testing

### Local Development
```bash
# Clone repository
git clone https://github.com/pubky/pubky-ring
cd pubky-ring

# Install dependencies
yarn install
cd ios && pod install && cd ..

# Run on iOS
yarn ios

# Run on Android
yarn android
```

### E2E Testing
Pubky Ring includes Appium/WebdriverIO tests:
```bash
# Install test drivers
yarn e2e:drivers

# Run Android tests
yarn e2e:android

# Run iOS tests
yarn e2e:ios
```

### Environment Variables
- `ANDROID_APP`: Path to APK for testing
- `IOS_APP`: Path to .app for testing
- `AVD`: Android Virtual Device name
- `IOS_SIM`: iOS Simulator name

## Relationship to Pubky Ecosystem

Pubky Ring is the **identity foundation** for:

### Pubky Core
- Manages [[Key Pair|Ed25519 identity keys]]
- Publishes keys via [[Explore/Pubky Core/Pkarr/0.Introduction|PKARR]] to [[Explore/Technologies/Mainline DHT|Mainline DHT]]
- Authorizes apps to store data on [[Homeservers|homeservers]]

### Pubky App
- Provides identity for social graph
- Authorizes content publishing
- Manages following/follower relationships

### Paykit
- Creates payment sessions
- Derives Noise encryption keys
- Authorizes payment operations
- Manages subscription agreements

### Pubky Noise
- Derives X25519 keys for encryption
- Manages Noise endpoint publishing
- Handles encrypted channel sessions

## Repository

- **Official**: [github.com/pubky/pubky-ring](https://github.com/pubky/pubky-ring)

## Release Verification

### Verify APK Authenticity
```bash
# Import maintainer's GPG key
gpg --import public-key.asc

# Verify signature
gpg --verify app-release.apk.asc app-release.apk

# Verify checksum
gpg --verify SHA256SUMS.asc
sha256sum -c SHA256SUMS
```

Always verify releases to ensure you're installing authentic, untampered builds.

## Roadmap & Future Features

**Planned Enhancements:**
- Multi-signature support for shared identities
- Hardware wallet integration
- Decentralized identity recovery (social recovery)
- Advanced permission models
- Identity attestations and verification
- Integration with more Pubky applications

**Research Areas:**
- Zero-knowledge proofs for privacy-preserving authorization
- Threshold cryptography for distributed key management
- Post-quantum cryptography readiness
- Advanced session policies

---

**Pubky Ring is the secure, self-custodial foundation for your presence in the Pubky ecosystem. Download it to get started with decentralized identity management.**

