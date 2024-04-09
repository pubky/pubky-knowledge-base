## Pubky Core Overview

Pubky is built on a few core concepts:

- **[[Data Stores]]** - Decentralized data storage nodes that host user data. Data is encrypted at rest.

- **[[Aggregators]]** - Services that collect and aggregate data from multiple [[Data Stores]] into a single normalized view.

- **[[Feeds]]** - Curated views of aggregated data presented to users. Can include timelines, hashtags, profiles, etc.

- **[[Search]]** - Services that index aggregated data and enable full text/attribute searches.

- **[Application Backends](/pubky-core/Applications.md)** - Backend services that integrate feeds, search, and user interfaces/configurations.

- **[[Pkarr]]** - Self-issued public keys that function as sovereign, publicly addressable domains are used to resolve the previous components.

Pubky's distributed architecture aims to provide user autonomy through [[Credible Exit]] between interchangeable components.
