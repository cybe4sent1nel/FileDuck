# 🔒 Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**DO NOT** open a public issue for security vulnerabilities.

Instead, please email: **security@fileduck.example**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within **48 hours** and provide a timeline for a fix.

## Security Features

FileDuck implements multiple security layers:

### 1. Upload Security

- **Malware Scanning**: ClamAV + VirusTotal
- **Quarantine System**: Files scanned before public access
- **File Size Limits**: 5 GB maximum
- **MIME Type Validation**: Prevent invalid file types

### 2. Download Security

- **One-Time Links**: Atomic GET+DEL from Redis
- **Signed URLs**: CloudFront/S3 time-limited tokens (1 hour)
- **SHA-256 Verification**: Client-side integrity checks
- **Expiration**: TTL-based automatic deletion

### 3. Abuse Prevention

- **Rate Limiting**: 10 requests/minute per IP
- **CAPTCHA**: After 3 failed attempts
- **Entropy Enforcement**: ≥40-bit share codes
- **Audit Logging**: Full request tracking

### 4. Infrastructure

- **HTTPS Only**: All traffic encrypted
- **Environment Variables**: No secrets in code
- **Principle of Least Privilege**: IAM policies
- **Network Isolation**: Private subnets for scanner

### 5. Data Privacy

- **Client-Side Encryption**: Optional zero-knowledge E2E
- **No Metadata Collection**: Minimal logging
- **Auto-Deletion**: Files expire and are purged
- **Redis TTL**: Metadata auto-expires

## Security Best Practices

### For Developers

1. Never commit secrets to Git
2. Use `.env.local` for local development
3. Run `pnpm audit` regularly
4. Keep dependencies updated
5. Review pull requests for security issues

### For Deployers

1. Rotate credentials regularly
2. Use separate AWS accounts for prod/staging
3. Enable CloudTrail logging
4. Set up SNS alerts for malware detections
5. Monitor CloudWatch metrics
6. Implement backup strategy

### For Users

1. Verify SHA-256 checksums after download
2. Scan downloads with antivirus
3. Use strong passwords for encryption
4. Don't share codes publicly
5. Report suspicious activity

## Known Limitations

1. **VirusTotal Free Tier**: 4 requests/minute
2. **ClamAV Signatures**: Update daily via cron
3. **Zero-Day Malware**: May not be detected immediately
4. **Encrypted Files**: Cannot be scanned for malware

## Security Updates

Subscribe to security announcements:

- GitHub Security Advisories
- Email: security-updates@fileduck.example
- RSS: https://github.com/your-org/fileduck/security/advisories.atom

## Compliance

FileDuck is designed to help with:

- **GDPR**: Data minimization, right to deletion
- **CCPA**: Privacy by design
- **SOC 2**: Logging and monitoring

**Note**: Compliance depends on your deployment configuration.

## Third-Party Security

We rely on:

- AWS S3 & CloudFront
- Upstash Redis
- Vercel Edge Functions
- ClamAV
- VirusTotal

Review their security policies independently.

## Incident Response

In case of a security incident:

1. **Detection**: Automated alerts via SNS
2. **Containment**: Disable affected endpoints
3. **Investigation**: Review logs and metrics
4. **Remediation**: Deploy fixes
5. **Notification**: Inform affected users
6. **Post-Mortem**: Document and improve

## Security Roadmap

Future enhancements:

- [ ] End-to-end encryption by default
- [ ] WebAuthn/FIDO2 for admin access
- [ ] Advanced threat detection (ML-based)
- [ ] Honeypot endpoints for threat intel
- [ ] Bug bounty program

---

Last updated: 2026-02-03
