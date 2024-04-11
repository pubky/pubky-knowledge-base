In-depth look at the architecture of [[Pkarr]], including its components and how they interact.

## Components

- **Client**: Applications or users that publish or query resource records.
- **Relay**: Optional intermediary that helps clients behind NAT or firewall to communicate with the [[DNS]].
- **[[DNS]]**: The overlay network used for storing and retrieving resource records.
- **Republisher**: Services that keep resource records alive on the [[DNS]] by periodically republishing them.

## Interaction Flow

1. **Publishing**: Clients publish resource records to the [[DNS]] through a relay.
2. **Republishing**: Clients can request republishing of their records to ensure they remain available on the [[DNS]].
3. **Querying**: Clients query the [[DNS]] for resource records, either directly or through a relay.

## Key Technologies

- **[[Mainline DHT]]**: Pkarr uses the Mainline [[DNS]] as its overlay network, specifically BEP44 for storing ephemeral data.
- **[[DNS]] over [[HTTPS]] ([[DoH]])**: For applications unaware of Pkarr, DoH is used to resolve domains.
