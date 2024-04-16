## Pubky.app Social Media

Pubky-app's initial focus is building a decentralized social media protocol. Key aspects include:

- User profiles hosted on [[Data Stores]]

- Post/comment/like data stored with profiles

- [[Aggregators]] collecting social graphs

- [[Feeds]] of followings' activities

- [[Search]]ing profiles and posts

- Notification delivery through [Application](Applications.md) Backends

- Distributed moderation through [user blocking](Web%20of%20Trust.md)

The goal is to recreate core social features without dependence on any centralized company or platform.

# Pubky App MVP Architecture

The early versions of Pubky app take some shortcuts over the Pubky Core design. The MVP app is centralized, therefore we saved time and complexity by aggregating functionality into fewer components. The main two components are the `Homeserver` and the `Indexer`

- The `Homeserver` fulfils the function of: [[Data Stores]], [[Pkarr]] republishing for users, identity-provider (Oauth-like sign-in). Users mantain a trust relationship with the `Homeserver`.
- The `Indexer` fulfils the function of the [Application Backend](Pubky%20Core/Applications) for the Pubky App. 

Given that all of the [[Data Stores]] related to Pubky App are centralized in the `Homeserver`, there is no need for an [[Aggregator]] (i.e., web crawler for Data Stores) in the early versions of the social Pubky app.
