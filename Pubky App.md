## Pubky.app Social Media

Pubky-app's initial focus is building a decentralized social media protocol. Key aspects include:

- User profiles hosted on [[1.Data Stores|data stores]]

- Post/comment/like data stored with profiles

- [[2.Aggregators|Aggregators]] collecting social graphs

- [[Feeds]] of followings' activities

- [[Pubky Core/Search|Searching]] profiles and posts

- Notification delivery through [[3.Applications|application]] Backends

- Distributed moderation through [user blocking](1.Web%20of%20Trust.md)

The goal is to recreate core social features without dependence on any centralized company or platform.

# Pubky App MVP Architecture

The early versions of Pubky app take some shortcuts over the Pubky Core design. The MVP app is centralized, therefore we saved time and complexity by aggregating functionality into fewer components. The main two components are the `Homeserver` and the `Indexer`

- The `Homeserver` fulfils the function of: [[1.Data Stores|data stores]], [[Pkarr/index|Pkarr]] republishing for users, identity-provider (Oauth-like sign-in). Users maintain a trust relationship with the `Homeserver`.
- The `Indexer` fulfils the function of the [Application Backend](3.Applications.md) for the Pubky App. 

Given that all of the [[1.Data Stores|data stores]] related to Pubky App are centralized in the `Homeserver`, there is no need for an [[2.Aggregators|aggregator]] (i.e., web crawler for Data Stores) in the early versions of the social Pubky app.
