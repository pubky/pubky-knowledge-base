## Pubky Aggregators

Aggregators are specialized reducers or gatekeepers that continuously scan and collect data from various sources, such as [[Homeserver|homeservers]]. They decide what data to allow in and what to keep out.

When the aggregator receive new events, it evaluates it against its predefined criteria. If the data meets the criteria, the aggregator allows it to pass through, making it available for further processing or storage. However, if the data doesn't meet the criteria, the aggregator blocks it, preventing it from entering the system.

By controlling the flow of information, aggregators play a crucial role in maintaining data quality, preventing information overload, and ensuring that only the most valuable and relevant data is used.

[[Pubky Nexus|Pubky Nexus]] implements a production-grade aggregator (the `nexus-watcher` component) that monitors multiple homeservers in real-time, filtering events and updating the social graph continuously.

### Characteristics

- **Fine-grained access controls**: Users and aggregators have granular control over what data is shared, with whom, and under what conditions, ensuring selective and secure data exchange.
- **Efficient data synchronization**: Incremental sync via event streams enables fast and efficient synchronization of changes from homeservers, reducing the overhead of data aggregation.
- **Normalized data schemas**: Standardized data schemas facilitate interoperability between services, making it easier to integrate and exchange data across the network.
- **Public and niche aggregators**: The network supports both large-scale, public aggregators for discoverability and smaller, niche aggregators that cater to specific communities or use cases.
- **Core user graph expansion**: The aggregation process starts with a core user graph and expands outward through connections, enabling the network to grow organically and efficiently.
- [[Censorship|Censorship resistance]]: The system's censorship resistance is achieved through a decentralized aggregation architecture, where data aggregation is distributed across a network of **independent, autonomous aggregators**. This design ensures that no single entity or node has control over the aggregation process, making it more resilient to censorship attempts.
