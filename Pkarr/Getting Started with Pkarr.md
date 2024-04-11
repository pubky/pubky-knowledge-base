This guide will help you understand how to publish and resolve resource records using [[Pkarr]].

## Publishing Resource Records

To publish resource records for your key, you need to sign a small encoded [[DNS]] packet (<= 1000 bytes) and publish it on the DHT. This can be done through a relay if necessary.

## Resolving Resource Records

To resolve some key's resources, applications can query the [[DHT]] directly or through a relay. They will then verify the signature themselves.

## [[DNS]] Queries Over [[HTTPS]]

Existing applications unaware of [[Pkarr]] can make normal [[DNS]] Queries over [[HTTPS]] ([[DoH]]) to [[Pkarr]] servers.

## Caching and Scalability

Clients and [[Pkarr]] servers cache records extensively to minimize [[DHT]] traffic and improve scalability. The [[DHT]] drops records after a few hours, so it's important to republish records periodically.

## Next Steps

For more technical details on [[Pkarr]]'s architecture and how it works, refer to the [[Architecture]] note.