The "Web of Trust" is a decentralized trust model used in cryptography, particularly in systems like PGP, GnuPG, and other OpenPGP-compatible systems, to establish the authenticity of the binding between a public key and its owner.

This model is an alternative to the centralized trust model of a Public Key Infrastructure (PKI), which relies on a certificate authority (CA) or a hierarchy of such authorities.

The concept, first introduced by PGP creator Phil Zimmermann in 1992, allows users to accumulate keys from others and designate them as trusted introducers. Over time, users distribute a collection of certifying signatures with their keys, expecting that anyone receiving these will trust at least one or two of the signatures. This process leads to the emergence of a decentralized, fault-tolerant web of confidence for all public keys, enabling a peer-to-peer rating system that verifies public keys and their owners without relying on a central identity authority.
