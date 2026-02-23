---
aliases:
  - "../../Pubky-App/Backend/Introduction"
  - "Explore/PubkyApp/Backend/Introduction"
---

The Indexing & Aggregation layer is responsible for collecting ([[Aggregator|aggregators]]) and organizing ([[Indexer|indexer]]) data from various sources, known as [[Homeserver|Homeservers]].

![Pubky Apps indexing and aggregation architecture showing aggregators collecting data from Homeservers, indexers normalizing data, and web servers providing API access](Explore/images/pubky-backend.png)

Imagine you're trying to find a specific document in a large library. The indexing and aggregation layer is like a librarian who searches through the shelves, finds the right documents, and prepares them for you to use. This ensures that the data is accurate, up-to-date, and in a format that's easy to work with.

### Main components

- [[Aggregator|Aggregators]] execute a **data retrieval protocol** to obtain data from **data storage**, initiating a process that retrieves and collects data from various sources.
- [[Indexer|Indexers]] receive aggregated data from the **Aggregators** and initiate a rigorous **data normalization** process, transforming and converting the data into a standardized format to ensure consistency and accuracy.
- [[WebServer|Web servers]] provide the requested data to [[Explore/PubkyApps/ReferenceApp/Introduction|pubky.app]] and other applications via API endpoints for feeds, search, and more.

### Production Implementation

[[PubkyNexus|Pubky Nexus]] is the production-grade implementation of this indexing and aggregation architecture, powering [[Explore/PubkyApps/Introduction|pubky.app]]'s social features with real-time aggregation, high-performance indexing, and a comprehensive REST API.
