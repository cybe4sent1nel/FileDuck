# Learning Resources for FileDuck

## 📚 Overview

This document contains learning resources, tutorials, and guides for understanding and contributing to FileDuck.

## 🎯 Core Technologies

### Frontend
- **Vue 3** - Progressive JavaScript framework
  - [Official Documentation](https://vuejs.org/)
  - [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- **TypeScript** - Type-safe JavaScript
  - [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Vite** - Next-generation build tool
  - [Getting Started](https://vitejs.dev/guide/)

### Backend
- **Node.js** - JavaScript runtime
  - [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- **Express** - Web framework for Node.js
  - [Express Guide](https://expressjs.com/en/guide/routing.html)

### Storage & CDN
- **GitHub Releases** - Primary storage backend
  - [GitHub REST API](https://docs.github.com/en/rest/releases)
- **AWS S3** - Object storage
  - [S3 Developer Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/)
- **CloudFront** - CDN for global distribution
  - [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

### Database & Caching
- **Redis** - In-memory data store
  - [Redis Commands](https://redis.io/commands/)
  - [Redis Best Practices](https://redis.io/docs/manual/patterns/)

### Security
- **ClamAV** - Antivirus engine
  - [ClamAV Documentation](https://docs.clamav.net/)
- **VirusTotal** - File scanning API
  - [VirusTotal API](https://developers.virustotal.com/reference/overview)

## 🏗️ Architecture Concepts

### Monorepo Structure
Learn about monorepo management with Turborepo:
- [Turborepo Handbook](https://turbo.build/repo/docs)
- [PNPM Workspaces](https://pnpm.io/workspaces)

### File Upload Strategies
- **Multipart Upload** - Splitting large files into chunks
- **Presigned URLs** - Secure direct uploads to S3/GitHub
- **Resumable Uploads** - Handling interrupted transfers

### Security Patterns
- **Zero-Knowledge Architecture** - Client-side encryption
- **One-Time Codes** - Single-use access tokens
- **Rate Limiting** - Protecting against abuse

## 🛠️ Development Workflow

### Getting Started
1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
3. Read [SECURITY.md](./SECURITY.md) for security practices

### Local Development
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Code Quality
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 📖 Recommended Reading

### Web Development
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)

### Cloud & DevOps
- [The Twelve-Factor App](https://12factor.net/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)

## 🎓 Tutorials & Guides

### Building Similar Features
- **File Upload with Progress**: Learn about `XMLHttpRequest` and `FormData`
- **Client-Side Encryption**: Explore Web Crypto API
- **Real-time Updates**: WebSockets and Server-Sent Events
- **Progressive Web Apps**: Service Workers and offline functionality

### Performance Optimization
- **Code Splitting**: Lazy loading routes and components
- **Image Optimization**: Compression and lazy loading
- **Caching Strategies**: Browser cache, CDN, and Redis

## 🤝 Community & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/filequack/issues)
- **Discussions**: Share ideas and ask questions
- **Discord/Slack**: Join our community (if available)

## 📝 Next Steps

1. **Explore the Codebase**: Start with `apps/vue-app/src/` and `apps/api/`
2. **Run Locally**: Follow the Quick Start guide in README.md
3. **Make Small Changes**: Fix typos, update docs, add comments
4. **Build Features**: Pick an issue labeled "good first issue"
5. **Share Knowledge**: Write tutorials, create videos, help others

---

**Happy Learning! 🚀**

For questions or suggestions about these learning resources, please open an issue or submit a pull request.

