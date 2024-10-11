# DNS over HTTPS

It is a security protocol that encrypts [[DNS]] queries and responses, enhancing privacy and security by preventing eavesdropping and tampering. In the context of [[0.Introduction|pkarr]], DoH plays a crucial role in ensuring that [[DNS]] queries made to resolve public-key addresses are secure and cannot be intercepted or manipulated by third parties.

### Key Points about DoH

- **Encryption**: DoH encrypts [[DNS]] traffic, making it unreadable to anyone who might intercept the data. This is achieved by sending [[DNS]] queries and responses over [[HTTPS]] connections, utilizing port 443, the standard port for [[HTTPS]] traffic.

- **Privacy and Security**: By encrypting [[DNS]] queries, DoH significantly increases privacy and security. It prevents Internet Service Providers (ISPs), governments, and hackers from monitoring or altering [[DNS]] requests.

- **Standardization and Adoption**: DoH has been adopted by major internet brands, including Apple, Microsoft, and Google, to enhance online security. It was first implemented by Mozilla in 2018, and since then, it has become a standard for secure [[DNS]] communication.

- **Compatibility and Implementation**: DoH can be enabled in browsers and operating systems, allowing users to benefit from its privacy and security features. However, it's important to ensure compatibility with existing cybersecurity solutions, as enabling DoH might impact [[DNS]] traffic filtering tools.
