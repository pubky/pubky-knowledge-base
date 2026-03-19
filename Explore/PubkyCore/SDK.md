---
aliases:
  - "../Pubky-Core/SDK"
---

# Pubky SDK: Client Libraries for Decentralized Applications

The Pubky SDK provides client libraries for building applications on [[Introduction|Pubky Core]]. Available in multiple languages with consistent APIs across platforms.

## Supported Platforms

| Platform | Language | Status | Package |
|----------|----------|--------|---------|
| **Rust** | Rust | ✅ Stable | [crates.io/crates/pubky](https://crates.io/crates/pubky) |
| **Web/Node** | JavaScript/TypeScript | ✅ Stable | [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky) |
| **React Native** | JavaScript/TypeScript | ✅ Stable | [@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky) |
| **iOS** | Swift | 🚧 Beta | Native bindings |
| **Android** | Kotlin | 🚧 Beta | Native bindings |

## Installation

### Rust

```bash
cargo add pubky
```

### JavaScript/TypeScript

```bash
npm install @synonymdev/pubky
# or
yarn add @synonymdev/pubky
```

### React Native

```bash
npm install @synonymdev/react-native-pubky
# or
yarn add @synonymdev/react-native-pubky
```

For iOS, also run:
```bash
cd ios && pod install
```

### iOS

The iOS SDK uses native Swift bindings generated via [UniFFI](https://mozilla.github.io/uniffi-rs/). You can either:

**Option 1: Use CocoaPods** (Recommended)
```ruby
pod 'PubkyCore'
```

**Option 2: Build from source**
```bash
# Clone the FFI repository
git clone https://github.com/pubky/pubky-core-ffi
cd pubky-core-ffi
./build.sh ios
```

The build generates:
- `bindings/ios/PubkyCore.xcframework` - Native framework
- `bindings/ios/pubkycore.swift` - Swift bindings

See [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) for detailed integration instructions.

### Android

The Android SDK uses native Kotlin bindings generated via [UniFFI](https://mozilla.github.io/uniffi-rs/).

**Build from source:**
```bash
# Clone the FFI repository
git clone https://github.com/pubky/pubky-core-ffi
cd pubky-core-ffi
./build.sh android
```

The build generates:
- `bindings/android/jniLibs/` - Native JNI libraries for all architectures
- `bindings/android/pubkycore.kt` - Kotlin bindings

Copy these to your Android project:
```bash
cp -r bindings/android/jniLibs/* app/src/main/jniLibs/
cp bindings/android/pubkycore.kt app/src/main/java/
```

See [pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) for detailed integration instructions.

## Core Concepts

### Public-Key Identity

Every user is identified by an Ed25519 public key:
- 32-byte public key (encoded as z-base-32)
- Corresponds to a private key held securely by the user
- Forms the basis of authentication and data ownership

### Homeserver Discovery

The SDK uses [[0.Introduction|PKARR]] to discover where a user's data is hosted:
1. Query [[Explore/Technologies/MainlineDHT|Mainline DHT]] for public key
2. Retrieve PKARR record with Homeserver URL
3. Connect to Homeserver via HTTPS

### Storage Paths

Data is organized in a hierarchical namespace:
```
/pub/app_name/path/to/data    # Public, readable by anyone
/private/app_name/secret       # Private (future)
```

## API Reference

### Client Creation

**Rust:**
```rust
use pubky::Pubky;

let pubky = Pubky::new()?;
```

**JavaScript:**
```javascript
import { Pubky } from '@synonymdev/pubky';

const pubky = new Pubky();
```

### Sign Up (Create Account on Homeserver)

**Rust:**
```rust
use pubky::{Pubky, Keypair, PublicKey};

let pubky = Pubky::new()?;
let keypair = Keypair::random();
let homeserver = PublicKey::try_from("8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo").unwrap();

let signer = pubky.signer(keypair);
let session = signer.signup(&homeserver, None).await?;
```

**JavaScript:**
```javascript
const signer = pubky.signer(keypair);
const session = await signer.signup(homeserverPk, null);
```

### Sign In (Existing User)

**Rust:**
```rust
let signer = pubky.signer(keypair);
let session = signer.signin().await?;
```

**JavaScript:**
```javascript
const signer = pubky.signer(keypair);
const session = await signer.signin();
```

### Store Data (PUT)

**Rust:**
```rust
session.storage().put(
    "/pub/myapp/profile",
    serde_json::to_string(&profile)?
).await?;
```

**JavaScript:**
```javascript
await session.storage.putJson("/pub/myapp/profile", profile);
```

### Retrieve Data (GET)

**Rust:**
```rust
let resp = session.storage().get("/pub/myapp/profile").await?;
let text = resp.text().await?;
```

**JavaScript:**
```javascript
const profile = await session.storage.getJson("/pub/myapp/profile");
```

### Delete Data (DELETE)

**Rust:**
```rust
session.storage().delete("/pub/myapp/profile").await?;
```

**JavaScript:**
```javascript
await session.storage.delete("/pub/myapp/profile");
```

### List Data (Pagination)

**Rust:**
```rust
let entries = session.storage().list("/pub/myapp/posts/")?
    .limit(20)
    .reverse(true)
    .send()
    .await?;

for entry in entries {
    println!("{}", entry);
}
```

**JavaScript:**
```javascript
const entries = await session.storage.list("/pub/myapp/posts/", null, false, 20);

for (const url of entries) {
    console.log(url);
}
```

### Public Read (Unauthenticated)

Read another user's public data without a session:

**Rust:**
```rust
let resp = pubky.public_storage()
    .get(format!("{}/pub/myapp/profile", user_public_key))
    .await?;
let text = resp.text().await?;
```

**JavaScript:**
```javascript
const text = await pubky.publicStorage
    .getText(`${userPk}/pub/myapp/profile`);
```

## Authentication Flows

### Third-Party Authorization

Pubky Core supports OAuth-style authorization for third-party apps via the `pubkyauth://` protocol:

```rust
use pubky::{Pubky, Capabilities, AuthFlowKind};

let pubky = Pubky::new()?;
let caps = Capabilities::default();
let flow = pubky.start_auth_flow(&caps, AuthFlowKind::signin())?;

// Display flow.authorization_url() as QR code for Pubky Ring to scan
let session = flow.await_approval().await?;
```

See [[Authentication]] for the full authentication flow.

## React Native Usage

The React Native SDK (`@synonymdev/react-native-pubky`) provides the same API as the JavaScript SDK with mobile-optimized bindings built using UniFFI.

### Basic Usage

```typescript
import {
  signUp,
  signIn,
  put,
  get,
  list,
  deleteFile,
  generateSecretKey,
  getPublicKeyFromSecretKey
} from '@synonymdev/react-native-pubky';

// All methods return Result type
const result = await signUp(secretKey, homeserverUrl);
if (result.isErr()) {
  console.error(result.error.message);
  return;
}
console.log(result.value); // Success value
```

### Sign Up & Authentication

```typescript
import { signUp, signIn, session, getHomeserver } from '@synonymdev/react-native-pubky';

// Standard signup
const signUpRes = await signUp(
  secretKey,
  'pubky://8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo'
);

// Signup with token (for gated homeservers)
const signUpWithTokenRes = await signUp(
  secretKey,
  'pubky://8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo',
  'your_signup_token'
);

// Sign in
const signInRes = await signIn(secretKey);

// Check session
const sessionRes = await session(publicKey);

// Get homeserver
const homeserverRes = await getHomeserver(publicKey);
```

### Data Operations

```typescript
import { put, get, list, deleteFile } from '@synonymdev/react-native-pubky';

// Write data
const putRes = await put(
  'pubky://z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty/pub/profile.json',
  { data: JSON.stringify({ name: 'Alice', bio: 'Builder' }) }
);

// Read data
const getRes = await get(
  'pubky://z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty/pub/profile.json'
);

// List directory
const listRes = await list(
  'pubky://z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty/pub/posts/'
);

// Delete file
const deleteRes = await deleteFile(
  'pubky://z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty/pub/old-post'
);
```

### Key Management

```typescript
import { 
  generateSecretKey, 
  getPublicKeyFromSecretKey,
  createRecoveryFile,
  decryptRecoveryFile
} from '@synonymdev/react-native-pubky';

// Generate new key pair
const keyRes = await generateSecretKey();
const secretKey = keyRes.value;

// Derive public key
const pubKeyRes = await getPublicKeyFromSecretKey(secretKey);
const publicKey = pubKeyRes.value;

// Create encrypted recovery file
const recoveryRes = await createRecoveryFile(secretKey, 'passphrase');
const recoveryFile = recoveryRes.value; // Base64 encoded

// Decrypt recovery file
const decryptRes = await decryptRecoveryFile(recoveryFile, 'passphrase');
const recoveredKey = decryptRes.value;
```

### HTTPS Resolution

```typescript
import { resolveHttps } from '@synonymdev/react-native-pubky';

// Resolve public key to HTTPS URL
const resolveRes = await resolveHttps(
  'z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty'
);

if (resolveRes.isOk()) {
  console.log(`HTTPS URL: ${resolveRes.value}`);
}
```

### Example: Complete Social Profile

```typescript
import { signUp, put, get } from '@synonymdev/react-native-pubky';

// Sign up
const signUpRes = await signUp(secretKey, homeserverUrl);
if (signUpRes.isErr()) throw new Error(signUpRes.error.message);

// Create profile (following pubky-app-specs)
const profile = {
  name: 'Alice',
  bio: 'Building on Pubky',
  image: 'pubky://alice-pubkey/pub/profile.jpg',
  links: [
    { title: 'Website', url: 'https://alice.com' }
  ]
};

// Write profile
const putRes = await put(
  'pubky://alice-pubkey/pub/pubky.app/profile.json',
  { data: JSON.stringify(profile) }
);

// Read profile
const getRes = await get('pubky://alice-pubkey/pub/pubky.app/profile.json');
const savedProfile = JSON.parse(getRes.value);
```

### Repository & Documentation

- **NPM**: [@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky)
- **GitHub**: [github.com/pubky/react-native-pubky](https://github.com/pubky/react-native-pubky)
- **Examples**: [Example App](https://github.com/pubky/react-native-pubky/tree/main/example)

## Examples

### Simple Profile Storage

```javascript
import { Pubky, Keypair } from '@synonymdev/pubky';

async function storeProfile() {
    const pubky = new Pubky();
    const keypair = Keypair.random();
    const signer = pubky.signer(keypair);

    // Sign up at a homeserver
    const session = await signer.signup(homeserverPk, null);
    console.log(`Public Key: ${signer.publicKey.z32()}`);

    // Store profile (following pubky-app-specs format)
    const profile = {
        name: "Alice",
        bio: "Building on Pubky",
        image: "pubky://user_id/pub/pubky.app/files/0000000000000",
        links: [{ title: "GitHub", url: "https://github.com/alice" }],
        status: "Exploring decentralized tech."
    };

    // Store at standard pubky-app location
    await session.storage.putJson("/pub/pubky.app/profile.json", profile);
    console.log("Profile stored!");

    // Retrieve profile
    const retrieved = await session.storage.getJson("/pub/pubky.app/profile.json");
    console.log("Retrieved:", retrieved);
}
```

**Note**: This example follows the [pubky-app-specs](https://github.com/pubky/pubky-app-specs) data model specification for interoperability with Pubky App ecosystem.

### Social Feed Application

```rust
use pubky::{Pubky, Keypair, PubkySession, PubkyResource};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Post {
    content: String,
    timestamp: i64,
    author: String,
}

async fn publish_post(session: &PubkySession, post: &Post) -> anyhow::Result<()> {
    let post_id = post.timestamp.to_string();
    let path = format!("/pub/social/posts/{}", post_id);

    session.storage().put(&path, serde_json::to_string(post)?).await?;
    Ok(())
}

async fn get_feed(pubky: &Pubky, public_key: &str) -> anyhow::Result<Vec<Post>> {
    let path = format!("{}/pub/social/posts/", public_key);

    let entries: Vec<PubkyResource> = pubky.public_storage()
        .list(path)?
        .limit(50)
        .reverse(true)
        .send()
        .await?;

    let mut posts = Vec::new();
    for entry in entries {
        let resp = pubky.public_storage().get(entry.to_string()).await?;
        let post: Post = serde_json::from_slice(&resp.bytes().await?)?;
        posts.push(post);
    }

    Ok(posts)
}
```

### Complete Examples

The repository includes comprehensive examples:

**JavaScript Examples:**
- [0-logging.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/0-logging.mjs) - Setup and logging
- [1-testnet.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/1-testnet.mjs) - Local testnet
- [2-signup.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/2-signup.mjs) - Identity creation
- [3-authenticator.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/3-authenticator.mjs) - Auth flow
- [4-storage.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/4-storage.mjs) - CRUD operations
- [5-request.mjs](https://github.com/pubky/pubky-core/tree/main/examples/javascript/5-request.mjs) - Authorization

**Rust Examples:**
- [0-logging](https://github.com/pubky/pubky-core/tree/main/examples/rust/0-logging) - Setup and logging
- [1-testnet](https://github.com/pubky/pubky-core/tree/main/examples/rust/1-testnet) - Local testnet
- [2-signup](https://github.com/pubky/pubky-core/tree/main/examples/rust/2-signup) - Identity creation
- [3-auth_flow](https://github.com/pubky/pubky-core/tree/main/examples/rust/3-auth_flow) - Complete auth
- [4-storage](https://github.com/pubky/pubky-core/tree/main/examples/rust/4-storage) - CRUD operations
- [5-request](https://github.com/pubky/pubky-core/tree/main/examples/rust/5-request) - Authorization
- [6-auth_flow_signup](https://github.com/pubky/pubky-core/tree/main/examples/rust/6-auth_flow_signup) - Full signup flow
- [7-events_stream](https://github.com/pubky/pubky-core/tree/main/examples/rust/7-events_stream) - SSE event streaming

## Testing

### Local Testnet

For development, run a local Homeserver:

```bash
# Clone repository
git clone https://github.com/pubky/pubky-core
cd pubky-core

# Run testnet
cargo run --bin pubky-testnet
```

Then connect your app to `http://localhost:15411`.

**JavaScript:**
```javascript
import { Pubky } from '@synonymdev/pubky';

const pubky = await Pubky.create({
    homeserverUrl: 'http://localhost:15411'
});
```

### Unit Tests

**JavaScript:**
```bash
cd pubky-sdk/bindings/js
npm run testnet  # Start local server
npm test         # Run tests
```

**Rust:**
```bash
cd pubky-sdk
cargo test
```

## Advanced Features

### Event Streaming

The SDK provides a builder API for subscribing to real-time homeserver events via SSE. See [[API#Event Streaming]] for the underlying HTTP endpoint.

**Rust — Single user:**
```rust
use pubky::{Pubky, PublicKey, EventType};
use futures_util::StreamExt;

let pubky = Pubky::new()?;
let user = PublicKey::try_from("o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo").unwrap();

let mut stream = pubky.event_stream_for_user(&user, None)
    .live()
    .subscribe()
    .await?;

while let Some(result) = stream.next().await {
    let event = result?;
    println!("{}: {} (cursor: {})", event.event_type, event.resource, event.cursor);
}
```

**Rust — Multiple users on the same homeserver:**
```rust
use pubky::{Pubky, PublicKey, EventCursor};
use futures_util::StreamExt;

let pubky = Pubky::new()?;
let user1 = PublicKey::try_from("o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo").unwrap();
let user2 = PublicKey::try_from("pxnu33x7jtpx9ar1ytsi4yxbp6a5o36gwhffs8zoxmbuptici1jy").unwrap();

let homeserver = pubky.get_homeserver_of(&user1).await.unwrap();

let mut stream = pubky.event_stream_for(&homeserver)
    .add_users([(&user1, None), (&user2, Some(EventCursor::new(100)))])?
    .live()
    .limit(100)
    .path("/pub/")
    .subscribe()
    .await?;

while let Some(result) = stream.next().await {
    let event = result?;
    println!("{}: {}", event.event_type, event.resource);
}
```

**JavaScript:**
```javascript
const user = PublicKey.from("o1gg96ewuojmopcjbz8895478wdtxtzzuxnfjjz8o8e77csa1ngo");

const stream = await pubky.eventStreamForUser(user, null)
    .live()
    .subscribe();

for await (const event of stream) {
    console.log(`${event.eventType}: ${event.resource.path}`);
    // event.eventType: "PUT" or "DEL"
    // event.cursor: string (for pagination/resumption)
    // event.contentHash: base64 string (PUT only) or undefined
}
```

**Builder options:**
- `.live()` — After historical events, keep streaming new events in real-time
- `.reverse()` — Deliver events newest-first (cannot combine with `live`)
- `.limit(n)` — Maximum events to receive before closing
- `.path("/pub/...")` — Filter events by path prefix
- `.add_users([(pubkey, cursor), ...])` — Subscribe to multiple users (up to 50)

**Key types:**
- `EventStreamBuilder` — Fluent builder for configuring subscriptions
- `Event` — A single event with `event_type`, `resource`, and `cursor`
- `EventCursor` — A `u64` identifier used for resuming streams from a position
- `EventType` — Either `Put` (with Blake3 `content_hash`) or `Delete`

See the [7-events_stream example](https://github.com/pubky/pubky-core/tree/main/examples/rust/7-events_stream) for a complete CLI tool.

### Session Management

Sessions are created via the `Signer` and provide scoped storage access:

```rust
use pubky::{Pubky, Keypair};

let pubky = Pubky::new()?;
let signer = pubky.signer(Keypair::random());

// Sign in returns a session
let session = signer.signin().await?;

// Session info
println!("User: {}", session.info().public_key());

// Sign out invalidates the session
session.signout().await?;
```

### Multiple Identities

```rust
let pubky = Pubky::new()?;

let session1 = pubky.signer(keypair_1).signin().await?;
let session2 = pubky.signer(keypair_2).signin().await?;

// Each session maintains a separate identity
```

## Platform-Specific Notes

### iOS Integration

```swift
import PubkySDK

let client = PubkyClient()
let keypair = try await client.signUp()
print("Public Key: \(keypair.publicKey)")

try await client.put(
    path: "/pub/myapp/data",
    data: jsonData
)
```

### Android Integration

```kotlin
import pubky.PubkyClient

val client = PubkyClient()
val keypair = client.signUp()
println("Public Key: ${keypair.publicKey}")

client.put(
    path = "/pub/myapp/data",
    data = jsonData
)
```

## Error Handling

**Rust:**
```rust
use pubky::Error;

match session.storage().get("/pub/myapp/data").await {
    Ok(resp) => println!("Retrieved: {}", resp.text().await?),
    Err(e) => eprintln!("Error: {}", e),
}
```

**JavaScript:**
```javascript
try {
    const text = await session.storage.getText("/pub/myapp/data");
    console.log("Retrieved:", text);
} catch (error) {
    // error.name: "RequestError", "AuthenticationError", "ValidationError", etc.
    console.error(`${error.name}: ${error.message}`);
}
```

## Best Practices

1. **Secure Key Storage**: Never store private keys in plaintext
   - iOS: Use Keychain Services
   - Android: Use EncryptedSharedPreferences
   - Web: Use secure storage APIs or [[Explore/Technologies/PubkyRing|Pubky Ring]]

2. **Session Management**: Use time-limited sessions, refresh regularly

3. **Error Handling**: Always handle network errors and retries

4. **Rate Limiting**: Respect Homeserver rate limits

5. **Data Validation**: Validate data before storing and after retrieving

6. **Namespacing**: Use consistent path structures per application

## Resources

- **Rust API Docs**: [docs.rs/pubky](https://docs.rs/pubky)
- **Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)
- **NPM Package**: [@synonymdev/pubky](https://www.npmjs.com/package/@synonymdev/pubky)
- **React Native Package**: [@synonymdev/react-native-pubky](https://www.npmjs.com/package/@synonymdev/react-native-pubky)
- **React Native Repository**: [github.com/pubky/react-native-pubky](https://github.com/pubky/react-native-pubky)
- **iOS/Android FFI**: [github.com/pubky/pubky-core-ffi](https://github.com/pubky/pubky-core-ffi) - Native bindings via UniFFI
- **Examples**: [github.com/pubky/pubky-core/tree/main/examples](https://github.com/pubky/pubky-core/tree/main/examples)
- **[[Introduction|Pubky Core Overview]]**: Main documentation
- **[[API|API Reference]]**: HTTP API specification

---

**The Pubky SDK makes it easy to build decentralized applications with standard web technologies.**
