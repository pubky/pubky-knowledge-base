# Pubky Core - Frequently Asked Questions

## Overview & Philosophy

**Q1. What is Pubky, and why was it developed?**  
Pubky is a new kind of web built on public key domains instead of usernames or rented accounts. Your public key becomes your self-sovereign domain. Pubky uses PKDNS, which runs on the Mainline DHT.

Pubky introduces a semantic social graph driven by tags and trust, not ads and opaque feeds.  
It was created to counter:
- Poisoned algorithms
- Censorship
- Walled gardens and data harvesting

**Q2. Why is Pubky critical for a free-market society?**  
Because it removes gatekeepers by design. Identities are user-owned; hosting/indexing are interchangeable.

**Q3. What’s the relationship between Pubky and Slashtags?**  
Slashtags was a previous Synonym project using Hypercore instead of PKDNS and homeservers. It shared similar goals.

**Q4. Is Pubky open source?**  
Yes. Under the MIT license. [View on GitHub](https://github.com/pubky/)

---

## Architecture & Resolution (PKARR, PKDNS, DHT)

**Q5. What is PKARR?**  
“Public Key Addressable Resource Records” your signed DNS-like records published on the DHT.

**Q6. What is PKDNS?**  
A resolver that maps `.pk` domains to endpoints using public keys.

**Q7. How does Pubky compare to DNS?**  
Pubky replaces ICANN with your public key. You publish and resolve records yourself.

**Q8. What format does PKDNS use?**  
DNS-style RR, signed under your key, shared via the Mainline DHT.

**Q9. Does it support CNAME/SRV/HTTPS indirection?**  
Yes, with caveats, avoid deep/brittle recursion.

**Q10. Are DHTs part of the clearnet?**  
Yes, via UDP. Web browsers require bridges due to lack of raw UDP support.

**Q11. How can browsers interact with the DHT?**  
Via HTTP bridges, resolvers like PKDNS, or native helpers.

**Q12. Do others need PKDNS to connect to Pubky sites?**  
No special setup in the Pubky App. Other apps can use public or self-hosted PKDNS resolvers.

---

## Homeservers & Hosting

**Q13. What are homeservers?**  
Regular web servers that host your content. Anyone can run one.

**Q14. Can I run one at home?**  
Yes. You’ll need port forwarding or tunneling if behind NAT.

**Q15. How is redundancy handled?**  
Use mirrors in PKARR. Clients pick healthy ones.

**Q16. Does it support load balancing?**  
Yes, for reads. Writes go to a single primary.

**Q17. Can homeservers sign my data?**  
No. Signing is done by the client.

**Q18. How to self-host a homeserver?**  
Deploy the package/container, configure HTTPS, publish in PKARR.

**Q19. Can Pubky integrate with Tor?**  
Yes, via `.onion` endpoints, but it’s not yet tested officially.

---

## Identity, Keys & Security

**Q20. How are keys managed?**  
With apps like Pubky Ring, which manages device sessions and PKARR.

**Q21. Does Pubky support key rotation?**  
Not yet standardized, possible manually via PKARR fallback logic.

**Q22. What if my key is lost or hacked?**  
Migrate to a new key, update PKARR, and alert your graph.

**Q23. Can I use the same seed as Nostr?**  
Yes, but most users prefer separate secrets due to risk.

**Q24. How does identity trust work?**  
No global authority, trust is built through social graph, tags, and interaction.

---

## Publishing, Privacy & Moderation

**Q25. How do I publish content?**  
Host it on a homeserver and link it in your PKARR.

**Q26. Is Pubky suitable for private sharing?**  
Not yet. All current use assumes public content.

**Q27. Where does moderation happen?**  
At the homeserver and indexer level (e.g., Synonym’s Nexus).

**Q28. How does Pubky resist spam?**  
Via CAPTCHAs, rate-limits, invites, and graph distance rules.

**Q29. How does Paykit fit in?**  
For payments, monetization, portable receipts, and paywalled content.

**Q30. Can Pubky do everything Nostr can?**  
Yes, and more. Pubky includes DHT-based discovery and semantic tagging.

---

## Interoperability, Ecosystem & Onboarding

**Q31. Pubky vs IPFS**  
Pubky is identity-first and mutable; IPFS is content-first and immutable.

**Q32. Pubky vs Nostr**  
Pubky uses homeservers and PKARR for hosting; Nostr uses relays. Pubky has semantic discovery.

**Q33. Pubky vs Bluesky**  
Pubky is key-native and decentralized. Bluesky relies on DID directories and centralized servers.

**Q34. Pubky vs Farcaster**  
Pubky = key-owned + off-chain. Farcaster = chain-anchored + relay-dependent.

**Q35. Will Pubky integrate with other protocols?**  
Bridges are possible, but not currently in development.

**Q36. Are there mobile apps?**  
Yes, [Pubky.app](https://pubky.app) (PWA) and Pubky Ring (native mobile). More apps are welcome from the community.

**Q37. How do users join Pubky App?**  
Via invite codes from homeservers. Prevents spam while preserving privacy.

**Q38. Indexer vs Homeserver?**  
- Homeserver = stores user data  
- Indexer = enables search/feeds across homeservers

**Q39. What’s the “Franky” rewrite?**  
Pubky App 2.0: Focus on reliability, scale, UX. Coming Q4 2025.

---

## Operations, Resilience & Scale

**Q40. How do I migrate providers?**  
Add mirror → update PKARR → let caches sync → retire old host.

**Q41. What if Synonym disappears?**  
Nothing breaks. Your key, data, and graph are yours.

**Q42. What if my ISP censors my homeserver?**  
Switch hosts, use Tor/VPN, republish PKARR.

**Q43. How often does PKARR update?**  
Periodically, every few hours is typical.

**Q44. What if I spam the DHT?**  
You’ll be rate-limited. Publish sensibly.

**Q45. Does DHT scale globally?**  
Yes. Mainline DHT already does, Pubky’s usage is lightweight.

**Q46. Why do some say Nostr needs a DHT?**  
Because relay-only networks don’t scale easily without coordination.

**Q47. What about private data in Pubky?**  
Short-term: Noise-based channels.  
Long-term: Cryptree-style systems and further R&D.