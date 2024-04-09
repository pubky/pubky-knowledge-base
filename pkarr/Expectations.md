Understanding the expectations and limitations of [[Pkarr]] is crucial for effective use. This note outlines what [[Pkarr]] is not and what users should expect.

## Not a Storage Platform

[[Pkarr]] is not a storage platform. Records are ephemeral and need to be refreshed regularly to remain on the DHT.

## Not a Real-time Communication Medium

[[Pkarr]] is not designed for real-time communication. It is optimized for infrequent updates and heavy caching to reduce traffic.

## Rate Limiting and Proof of Work

Expectations include enforcing harsh rate-limiting and possibly demanding proof of work for updates.

## Caching and Propagation Time

Records are heavily cached, and updates might take some time to propagate. In case of a cache miss, querying the [[DHT]] might take a few seconds.

## Next Steps

For a deeper understanding of why [[Pkarr]] was created and its motivation, refer to the [[Why Pkarr?]] note.
