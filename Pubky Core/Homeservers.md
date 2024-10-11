The Pubky network allows multiple, independent data stores, known as "homeservers." This improves [[Censorship|censorship-resistance]] and prevents any single entity from controlling the flow of information, or locking people & data in as a walled garden. 

Homeservers are meant to represent a primary place to retrieve data from a specific [[0.Introduction|PKARR]] public key, but the user can redefine the location of their homeserver at will by updating their [[0.Introduction|PKARR]] in [[DHT|mainline DHT]]. 

## Public vs Private Data

Current implementations across Pubky currently only support public, unencrypted data use cases. This does not prevent applications from using encrypted data within homeservers, we simply haven't implemented that set of features in any direct way yet. Feel free to contribute!  

## Data Retrieval and Synchronization

- **API**: Any service can access data through a RESTful API 

## Decentralized Storage Architecture

- Homeservers can be operated by individuals, cooperatives, or commercial entities, with the option for anonymous operation, promoting a decentralized and resilient storage ecosystem where users could tune their preferred redundancy while maintaining the benefits of a central homeserver.
- We do not yet have any mirroring or replication tools available yet. Feel free to build with us!

## User Data Control and Credible Exit

- The current network is being bootstrapped by Synonym's first homeserver, which supports key accounts as a service, as well as all services required to operate the [[Pubky App/Introduction|pubky App]]. 
- While Synonym is currently not charging fees for homeserving, it is totall possible for anyone to run their own homerserver and require service fees or peer-to-peer micropayments, or any other requirement, to improve data redundancy and competition.
- Synonym does not control who can join or serve data on the network, but in order to truly have a [[Credible Exit|"credible exit"]] the network will need to mature to have more providers of homeservers and Pubky applications.
- We will also need to make it as easy as possible for people to host their own homeservers, and to host homerserver clouds.
- We also need to ensure that applications remain performant & reliable as the network fragments.

## WIP
- **Merkle tree-based versioning**: Merkle trees to manage versioning and conflict resolution, ensuring efficient data synchronization and minimizing data inconsistencies.
- **Event Stream**: Fetch homeserver events via publish-subscribe (Pub/Sub) messaging system, enabling efficient and scalable data retrieval.