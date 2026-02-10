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

### Public Key Identity

Every user is identified by an Ed25519 public key:
- 32-byte public key (encoded as z-base-32)
- Corresponds to a private key held securely by the user
- Forms the basis of authentication and data ownership

### Homeserver Discovery

The SDK uses [[0.Introduction|PKARR]] to discover where a user's data is hosted:
1. Query [[Explore/Technologies/MainlineDHT|Mainline DHT]] for public key
2. Retrieve PKARR record with homeserver URL
3. Connect to homeserver via HTTPS

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
use pubky::PubkyClient;

let client = PubkyClient::new()?;
```

**JavaScript:**
```javascript
import { Pubky } from '@synonymdev/pubky';

const pubky = await Pubky.create();
```

### Sign Up (Generate Identity)

**Rust:**
```rust
let keypair = client.signup()?;
let public_key = keypair.public_key();
let secret_key = keypair.secret_key();
```

**JavaScript:**
```javascript
const { publicKey, secretKey } = await pubky.signUp();
```

### Sign In (Load Existing Identity)

**Rust:**
```rust
let secret_key = SecretKey::from_bytes(&secret_bytes)?;
client.signin(secret_key)?;
```

**JavaScript:**
```javascript
await pubky.signIn(secretKey);
```

### Store Data (PUT)

**Rust:**
```rust
client.put(
    "/pub/myapp/profile",
    &serde_json::to_vec(&profile)?
).await?;
```

**JavaScript:**
```javascript
await pubky.put(
    "/pub/myapp/profile",
    JSON.stringify(profile)
);
```

### Retrieve Data (GET)

**Rust:**
```rust
let data = client.get("/pub/myapp/profile").await?;
let profile: Profile = serde_json::from_slice(&data)?;
```

**JavaScript:**
```javascript
const data = await pubky.get("/pub/myapp/profile");
const profile = JSON.parse(data);
```

### Delete Data (DELETE)

**Rust:**
```rust
client.delete("/pub/myapp/profile").await?;
```

**JavaScript:**
```javascript
await pubky.delete("/pub/myapp/profile");
```

### List Data (Pagination)

**Rust:**
```rust
let entries = client.list(
    "/pub/myapp/posts/",
    Some(ListOptions {
        limit: Some(20),
        cursor: None,
        reverse: false,
    })
).await?;

for entry in entries {
    println!("{}: {} bytes", entry.key, entry.size);
}
```

**JavaScript:**
```javascript
const entries = await pubky.list("/pub/myapp/posts/", {
    limit: 20,
    reverse: false
});

for (const entry of entries) {
    console.log(`${entry.key}: ${entry.size} bytes`);
}
```

## Authentication Flows

### Third-Party Authorization

Pubky Core supports OAuth-style authorization for third-party apps:

```rust
// App requests authorization
let auth_url = client.request_authorization(
    "https://myapp.com/callback",
    vec!["read:/pub/", "write:/pub/myapp/"]
)?;

// User approves in [[Explore/Technologies/PubkyRing|Pubky Ring]]
// Callback receives session token

// App uses token for requests
client.set_session_token(token)?;
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
import { Pubky } from '@synonymdev/pubky';

async function storeProfile() {
    const pubky = await Pubky.create();
    
    // Generate identity
    const { publicKey, secretKey } = await pubky.signUp();
    console.log(`Public Key: ${publicKey}`);
    
    // Sign in
    await pubky.signIn(secretKey);
    
    // Store profile (following pubky-app-specs format)
    const profile = {
        name: "Alice",
        bio: "Building on Pubky",
        image: "pubky://user_id/pub/pubky.app/files/0000000000000",
        links: [
            {
                title: "GitHub",
                url: "https://github.com/alice"
            }
        ],
        status: "Exploring decentralized tech."
    };
    
    // Store at standard pubky-app location
    await pubky.put(
        "/pub/pubky.app/profile.json",
        JSON.stringify(profile)
    );
    
    console.log("Profile stored!");
    
    // Retrieve profile
    const data = await pubky.get("/pub/pubky.app/profile.json");
    const retrieved = JSON.parse(data);
    console.log("Retrieved:", retrieved);
}
```

**Note**: This example follows the [pubky-app-specs](https://github.com/pubky/pubky-app-specs) data model specification for interoperability with Pubky App ecosystem.

### Social Feed Application

```rust
use pubky::{PubkyClient, ListOptions};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Post {
    content: String,
    timestamp: i64,
    author: String,
}

async fn publish_post(client: &PubkyClient, post: &Post) -> anyhow::Result<()> {
    let post_id = post.timestamp.to_string();
    let path = format!("/pub/social/posts/{}", post_id);
    
    client.put(&path, &serde_json::to_vec(post)?).await?;
    Ok(())
}

async fn get_feed(client: &PubkyClient, public_key: &str) -> anyhow::Result<Vec<Post>> {
    let path = format!("pubky://{}/pub/social/posts/", public_key);
    
    let entries = client.list(&path, Some(ListOptions {
        limit: Some(50),
        reverse: true, // Newest first
        cursor: None,
    })).await?;
    
    let mut posts = Vec::new();
    for entry in entries {
        let data = client.get(&entry.key).await?;
        let post: Post = serde_json::from_slice(&data)?;
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

## Testing

### Local Testnet

For development, run a local homeserver:

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

### Session Management

```rust
// Create session with capabilities
let session = client.create_session(vec![
    "read:/pub/",
    "write:/pub/myapp/"
])?;

// Use session token
client.set_session_token(session.token)?;

// Refresh session
client.refresh_session().await?;
```

### Recovery Files

```rust
// Export recovery file (encrypted)
let recovery_data = client.export_recovery("password")?;
std::fs::write("recovery.dat", recovery_data)?;

// Import recovery file
let recovery_data = std::fs::read("recovery.dat")?;
client.import_recovery(&recovery_data, "password")?;
```

### Multiple Identities

```rust
let client1 = PubkyClient::new()?;
client1.signin(secret_key_1)?;

let client2 = PubkyClient::new()?;
client2.signin(secret_key_2)?;

// Each client maintains separate identity
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
use pubky::PubkyError;

match client.get("/pub/myapp/data").await {
    Ok(data) => println!("Retrieved: {:?}", data),
    Err(PubkyError::NotFound) => println!("Data not found"),
    Err(PubkyError::Unauthorized) => println!("Not authorized"),
    Err(e) => eprintln!("Error: {}", e),
}
```

**JavaScript:**
```javascript
try {
    const data = await pubky.get("/pub/myapp/data");
    console.log("Retrieved:", data);
} catch (error) {
    if (error.code === 'NOT_FOUND') {
        console.log("Data not found");
    } else if (error.code === 'UNAUTHORIZED') {
        console.log("Not authorized");
    } else {
        console.error("Error:", error.message);
    }
}
```

## Best Practices

1. **Secure Key Storage**: Never store private keys in plaintext
   - iOS: Use Keychain Services
   - Android: Use EncryptedSharedPreferences
   - Web: Use secure storage APIs or [[Explore/Technologies/PubkyRing|Pubky Ring]]

2. **Session Management**: Use time-limited sessions, refresh regularly

3. **Error Handling**: Always handle network errors and retries

4. **Rate Limiting**: Respect homeserver rate limits

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
