Leveraging the Pubky Core protocol as the foundational layer, we can architect a diverse array of client applications with distinct functionalities. While each client can implement its own unique design patterns and user interfaces, they all share a common underlying architecture: interacting with the distributed data stores, colloquially referred to as [[Data Stores |home servers]], through standardized read and write operations.

The [[Pubky Core/Introduction|Pubky Core protocol]] enables a decentralized approach to data management, facilitating seamless communication between clients and their respective data stores. This architecture promotes data sovereignty and enhances system resilience.

Below, we present several high-level designs that showcase the versatility of this architecture:

- [[Client - Homeserver |Client-Homeserver]]
- [[Custom Backend|Custom backend]]
- [[Global Aggregators|Global aggregators]]