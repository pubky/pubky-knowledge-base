# Pubky Knowledge Base

[![Documentation Status](https://img.shields.io/badge/docs-live-success)](https://pubky.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Welcome to the Pubky Knowledge base - we are excited to have you here!

### 🔗 [Access the Pubky Knowledge Base](https://docs.pubky.org/)

> **The current Knowledge base is a mix of reality, dreams, visions, actuality and plans.**

The Knowledge Base is a comprehensive resource that encompasses our vision for Pubky, along with detailed explanations of the architecture for both Pubky Core and Pubky App, as well as key concepts and practical guides.

## 📝 Contributing to Documentation

We kindly ask you to help us improve this documentation for a clearer, more accurate, and concise knowledge base.

### Quick Fixes

For typos, broken links, or small improvements:
1. Fork this repository
2. Make your changes
3. Submit a pull request

### Larger Contributions

For new pages or significant changes:
1. Open an issue to discuss your plans first
2. Follow the [[Contributing]] guide
3. Test locally before submitting

See our full **[[Contributing|Contributing Guide]]** for detailed instructions.

## 🏗️ Build Static Site Locally

The knowledge base is built using [Quartz](https://quartz.jzhao.xyz/), a static site generator optimized for knowledge bases.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/prebuilt-installer) 18+ installed

### Build Steps

```bash
# 1. Navigate to quartz directory
cd quartz

# 2. Install dependencies
npm install

# 3. Build and serve locally
npm run docs

# 4. Open browser
# Visit http://localhost:8080
```

### Production Build

```bash
cd quartz
npm run build
```

Output will be in `quartz/public/` directory.

## 🔗 Related Resources

- **Official Website**: [pubky.org](https://pubky.org/)
- **Main Repository**: [github.com/pubky/pubky-core](https://github.com/pubky/pubky-core)
- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **Live App**: [pubky.app](https://pubky.app)

## 📜 License

This documentation is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**For GitHub Contributors**: This README is specifically for the documentation repository. The actual knowledge base lives at [pubky.org](https://pubky.org/).
