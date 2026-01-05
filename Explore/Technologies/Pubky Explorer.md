# Pubky Explorer

**Pubky Explorer** is a web-based file browser for exploring public data stored on [[Homeservers|Pubky homeservers]]. It provides an intuitive interface for navigating the decentralized file system, previewing files, and sharing direct links to specific content—all without requiring authentication or installation.

**Live Application**: [https://explorer.pubky.app](https://explorer.pubky.app)

## Overview

Pubky Explorer makes it easy to browse the public data stored across the Pubky network. Unlike traditional file explorers that require local access, Pubky Explorer operates entirely in the browser, fetching data directly from homeservers using the [[Explore/Pubky Core/SDK|Pubky SDK]].

### Key Features

- **Zero Installation**: Runs entirely in the browser, no downloads required
- **Public Key Navigation**: Enter any 52-character public key to browse their data
- **Directory Traversal**: Navigate through nested directories like a traditional file browser
- **File Preview**: View file contents directly in the browser (text, JSON, images)
- **Keyboard Navigation**: Full keyboard shortcuts for efficient browsing
- **Shareable URLs**: Generate permanent links to specific files or directories
- **Sorting Options**: Alphabetical sorting (A-Z, Z-A) with directories-first option
- **Shallow Mode**: Limit directory depth for faster browsing
- **Responsive Design**: Works on desktop and mobile browsers

## How It Works

Pubky Explorer uses the [[Explore/Pubky Core/SDK|Pubky SDK]] to:

1. **Resolve Public Keys**: Convert public keys to homeserver URLs via [[0.Introduction|PKARR]]
2. **List Directories**: Fetch directory contents from homeservers
3. **Fetch Files**: Retrieve individual files for preview
4. **Display Content**: Render files appropriately based on content type

All operations happen client-side in your browser—no data is sent to intermediary servers.

## Usage

### Basic Navigation

**Enter a Public Key**:
```
7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy
```

**With Path**:
```
7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/pub/pubky.app/
```

**With URI Prefix**:
```
pubky://7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/
pk:7fmjpcuuzf54hw18bsgi3zihzyh4awseeuq5tmojefaezjbd64cy/
```

### URL Formats

Pubky Explorer supports multiple URL formats for sharing:

**Query Parameter**:
```
https://explorer.pubky.app?p=<public-key>/<path>
```

**Hash Fragment**:
```
https://explorer.pubky.app#p=<public-key>/<path>
```

Both formats work identically—choose based on your preference for analytics or browser compatibility.

### Keyboard Shortcuts

Efficient navigation without touching the mouse:

- **↑ / ↓**: Navigate up/down through files and directories
- **Enter**: Open selected file/directory
- **Backspace**: Go to parent directory
- **← / →**: Browser back/forward navigation
- **/**: Focus search input

### File Actions

**Directory Actions**:
- Click directory name to enter it
- Hover to prefetch contents for instant loading
- Click breadcrumb path to jump to parent directories

**File Actions**:
- Click file name to preview contents
- Preview opens in side panel
- Close preview to return to directory listing

### Viewing Options

**Shallow Mode**:
- Checkbox option to limit recursion depth
- Faster loading for large directory structures
- Useful for quick exploration

**Sorting**:
- **A-Z**: Alphabetical ascending
- **Z-A**: Alphabetical descending
- **Dirs First**: Group directories before files

### Sharing

**Share Button**:
- Generates shareable URL for current view
- Copies to clipboard automatically
- Includes exact path and file state
- Recipients see identical view

## Use Cases

### Data Verification

Verify published data structure:
- Check if profile exists at expected path
- Inspect post formatting and metadata
- Validate [[Explore/Pubky Core/notes/3.Protocols|pubky-app-specs]] compliance

### Debugging

Debug application issues:
- Inspect actual stored data format
- Compare expected vs. actual file structure
- Verify permission issues aren't data-related

### Discovery

Explore the Pubky network:
- Browse public user data
- See how applications structure data
- Learn common path conventions

### Documentation

Create documentation with real examples:
- Share links to actual data structures
- Reference real posts/profiles in tutorials
- Provide working examples for developers

### Research

Study the Pubky ecosystem:
- Analyze data usage patterns
- Survey application conventions
- Gather statistics on data types

## Technical Details

### Technology Stack

- **Frontend Framework**: SolidJS (reactive UI)
- **Build Tool**: Vite (fast development and bundling)
- **Language**: TypeScript (type-safe development)
- **Pubky Integration**: `@synonymdev/pubky` SDK
- **Styling**: CSS with modern features

### Architecture

**Client-Side Only**:
- No backend server required
- All data fetched directly from homeservers
- Privacy-preserving (no tracking)
- Censorship-resistant (no proxy)

**State Management**:
- Reactive state using SolidJS signals
- Directory listing cache for performance
- Scroll position preservation
- Browser history integration

**Performance Optimizations**:
- Directory prefetching on hover/focus
- Lazy loading for large directories
- Intersection observer for infinite scroll
- Efficient re-rendering with fine-grained reactivity

### Data Flow

```
User Input → SDK Resolution → Homeserver Request → Data Display
    ↓              ↓                    ↓                ↓
Public Key    PKARR Lookup      HTTP/HTTPS        Render List
  or Path       (via DHT)        (via SDK)       or Preview
```

### Supported File Types

**Preview Support**:
- **Text**: `.txt`, `.md`, `.log`
- **Code**: `.js`, `.ts`, `.json`, `.html`, `.css`
- **Data**: `.json`, `.yaml`, `.xml`
- **Images**: `.jpg`, `.png`, `.gif`, `.svg`, `.webp`
- **Documents**: Raw text rendering for inspection

**Download Fallback**:
- Binary files prompt download
- Large files may timeout (browser limits)
- Unknown types rendered as text when possible

## Development

### Local Setup

```bash
# Clone repository
git clone https://github.com/pubky/pubky-explorer
cd pubky-explorer

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

Output in `dist/` directory ready for static hosting.

### Project Structure

```
pubky-explorer/
├── src/
│   ├── App.tsx           # Main application component
│   ├── Explorer.tsx      # Directory browser UI
│   ├── Preview.tsx       # File preview panel
│   ├── ShareButton.tsx   # Share URL generator
│   ├── Spinner.tsx       # Loading indicator
│   ├── state.ts          # Global state management
│   └── css/              # Component styles
├── public/
│   └── pubky.svg         # Logo asset
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies
```

### Configuration

**Environment Variables**:

None required! Pubky Explorer works entirely with the public Pubky SDK and requires no API keys or configuration.

**Deployment**:

Deploy to any static hosting service:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Push `dist/` to gh-pages branch
- **Cloudflare Pages**: Connect repository
- **AWS S3**: Upload `dist/` contents

## Privacy & Security

### Privacy Features

- **No Analytics**: Zero tracking by default
- **No Cookies**: Stateless operation
- **No Server**: Direct homeserver connections
- **Client-Side**: All computation in browser
- **No Data Collection**: Nothing stored externally

### Security Considerations

- **Public Data Only**: Only displays public homeserver data
- **No Authentication**: Cannot access private data
- **Read-Only**: Cannot modify or upload data
- **CORS Limitations**: Subject to homeserver CORS policies
- **Browser Sandbox**: Runs in browser security context

### Data Visibility

**What Explorer Can See**:
- Public directories on homeservers
- Files with read permissions
- Metadata (file sizes, structure)

**What Explorer Cannot See**:
- Private or encrypted data
- Authentication-required content
- Data without proper CORS headers

## Limitations

### Technical Constraints

- **Large Files**: Browser memory limits may cause issues
- **Many Files**: Extremely large directories may be slow
- **Binary Files**: Limited preview support for binary formats
- **Recursive Depth**: Deep nesting may impact performance
- **Network Speed**: Limited by homeserver response times

### Functional Limitations

- **Read-Only**: No upload or edit capabilities
- **No Authentication**: Cannot access private data
- **Public Data**: Only works with publicly readable content
- **CORS Dependent**: Requires homeserver CORS support
- **Single Homeserver**: No multi-homeserver aggregation

## Future Enhancements

Potential improvements for Pubky Explorer:

- **File Upload**: Enable data publishing (with authentication)
- **Editing**: In-browser file editing with SDK write operations
- **Search**: Full-text search across user's data
- **History**: Recent locations and favorites
- **Bulk Operations**: Select multiple files for actions
- **Advanced Preview**: Markdown rendering, syntax highlighting
- **Data Visualization**: Charts for JSON data, image galleries
- **Comparison View**: Diff between file versions
- **Mobile App**: Native iOS/Android applications
- **Offline Support**: Service worker for caching

## Related Tools

- **[[Explore/Pubky Core/SDK|Pubky SDK]]**: Underlying data access library
- **[[PKDNS]]**: DNS resolution for public keys (used by SDK)
- **[[Explore/Pubky App/Introduction|Pubky App]]**: Social application using same data structures
- **[pubky-app-specs](https://github.com/pubky/pubky-app-specs)**: Data model specifications
- **[[Pubky Nexus]]**: Backend for aggregated views (Explorer shows raw data)

## Resources

- **Live Application**: [https://explorer.pubky.app](https://explorer.pubky.app)
- **Repository**: [https://github.com/pubky/pubky-explorer](https://github.com/pubky/pubky-explorer)
- **SolidJS Documentation**: [https://solidjs.com](https://solidjs.com)
- **Vite Documentation**: [https://vitejs.dev](https://vitejs.dev)

## See Also

- [[Homeservers]] - Data storage explained
- [[Explore/Pubky Core/SDK|Pubky Core SDK]] - How data access works
- [[Explore/Pubky Core/API|Pubky Core API]] - Homeserver HTTP API
- [[0.Introduction|PKARR]] - Public key resolution
- [[FAQ#Q14a]] - FAQ entry about exploring data

