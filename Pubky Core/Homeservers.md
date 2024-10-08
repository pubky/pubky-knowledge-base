The network is composed of multiple, independent data stores, homeservers, which provide censorship resistance and ensure that no single entity controls the flow of information. 

### Data Storage and Access

- **Client-side encryption**: Data at rest is encrypted using users' public keys, ensuring that only the data owner possesses the decryption key and has exclusive access to the encrypted data.
- **Optional data publication**: Users have the option to publish data publicly, making it accessible to all, or maintain control over access through fine-grained permissions.

### Data Retrieval and Synchronization

- **API and Pub/Sub access**: Authorized services can access data through a RESTful API or via a publish-subscribe (Pub/Sub) messaging system, enabling efficient and scalable data retrieval.
- **Merkle tree-based versioning**: The system employs Merkle trees to manage versioning and conflict resolution, ensuring efficient data synchronization and minimizing data inconsistencies.

### Decentralized Storage Architecture

- **Federated data stores**: Data stores can be operated by individuals, cooperatives, or commercial entities, with the option for anonymous operation, promoting a decentralized and resilient storage ecosystem.
- **Redundancy through replication**: Data is replicated across multiple data stores to ensure high availability and redundancy, minimizing the risk of data loss or unavailability.

### Incentivizing Data Availability

- **Incentive mechanisms**: The system incorporates [[2.Incentives|incentives]], such as service fees or peer-to-peer micropayments, to encourage data availability and storage providers to maintain high uptime and data accessibility.

### User Data Control and Credible Exit

- **User-centric data control**: Users retain control over their data even in the event of a data store outage or termination, thanks to credible exit options that ensure data portability and availability.
