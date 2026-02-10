# Troubleshooting Guide

Common issues and solutions when working with Pubky.

---

## PKARR & Discovery Issues

### PKARR Record Not Resolving

**Symptom**: Public key domain doesn't resolve, apps can't find homeserver

**Common Causes:**

1. **Record Not Published**
   ```bash
   # Verify record exists on DHT
   curl "https://pkarr.pubky.org/<your-public-key>"
   ```
   **Solution**: Ensure you've published your PKARR record:
   ```javascript
   await pubky.publishPkarrRecord();
   ```

2. **Record Expired (TTL)**
   - PKARR records on DHT expire after several hours
   - **Solution**: Republish regularly (recommended: every 2 hours)
   ```javascript
   // Automatic republishing
   setInterval(async () => {
     await pubky.publishPkarrRecord();
   }, 2 * 60 * 60 * 1000); // Every 2 hours
   ```

3. **DHT Propagation Delay**
   - Records take time to propagate (usually < 5 minutes)
   - **Solution**: Wait a few minutes after publishing, then retry

4. **Incorrect Public Key Format**
   - Public keys must be z-base-32 encoded
   - **Solution**: Verify key format matches: `z4e8s17cou9qmuwen8p1556jzhf1wktmzo6ijsfnri9c4hnrdfty`

**Debugging Commands:**

```bash
# Check if PKARR relay has your record
curl "https://pkarr.pubky.org/<public-key>"

# Check DNS resolution via PKDNS
dig @pkdns.pkarr.org <public-key>

# Test with Pubky CLI
pubky-cli tools verify-pkarr <public-key>
```

---

## Homeserver Connection Issues

### Can't Connect to Homeserver

**Symptom**: SDK operations fail, timeout, or refuse connection

**Common Causes:**

1. **HTTPS Not Configured**
   - Homeservers REQUIRE HTTPS (not HTTP)
   - **Solution**: Configure TLS certificate:
   ```bash
   # Using Let's Encrypt
   certbot --nginx -d yourdomain.com
   ```

2. **Firewall Blocking Ports**
   - Default ports: 6287 (user API), 6288 (admin API)
   - **Solution**: Open firewall ports:
   ```bash
   # UFW example
   sudo ufw allow 6287/tcp
   sudo ufw allow 6288/tcp
   ```

3. **Homeserver Not Running**
   - **Solution**: Verify homeserver is running:
   ```bash
   # Check process
   ps aux | grep pubky-homeserver
   
   # Check logs
   journalctl -u pubky-homeserver -f
   ```

4. **PKDNS Resolution Failure**
   - Browser can't resolve public key domain
   - **Solution**: Use PKDNS-enabled resolver or DoH:
   ```javascript
   // In browser, use full HTTPS URL
   const url = `https://your-homeserver.com/pub/...`;
   ```

**Test Connection:**

```bash
# Direct test
curl https://your-homeserver.com/

# Via public key (requires PKDNS)
curl $(pkdns resolve <public-key>)/
```

---

## SDK Authentication Problems

See [[Authentication]] for how Pubky authentication works.

### "Invalid Signature" or "Authentication Failed"

**Symptom**: SDK operations rejected with authentication errors

**Common Causes:**

1. **Recovery File Corrupted**
   - File is damaged or incorrectly decrypted
   - **Solution**: Restore from backup or regenerate keys

2. **Wrong Passphrase**
   - Recovery file passphrase is incorrect
   - **Solution**: Verify passphrase, use correct one:
   ```javascript
   const pubky = await Pubky.fromRecoveryFile(
     './recovery.file',
     'correct-passphrase'
   );
   ```

3. **Session Expired**
   - Sessions have TTL (typically 24 hours)
   - **Solution**: Sign in again:
   ```javascript
   await pubky.signIn();
   ```

4. **Clock Skew**
   - System time is significantly wrong
   - **Solution**: Sync system clock:
   ```bash
   # Linux/macOS
   sudo ntpdate -s time.nist.gov
   
   # Or use NTP service
   sudo systemctl restart systemd-timesyncd
   ```

**Debug Authentication:**

```javascript
// Check current session
const session = await pubky.session();
console.log('Session valid:', session.valid);
console.log('Expires:', new Date(session.expiresAt));

// Force re-authentication
await pubky.signOut();
await pubky.signIn();
```

---

## Pubky Docker Setup Issues

### Containers Won't Start

**Symptom**: `docker compose up` fails or containers crash

**Common Causes:**

1. **Port Conflicts**
   - Another service using required ports
   - **Solution**: Check and free ports:
   ```bash
   # Find what's using ports
   sudo lsof -i :4173  # Homeserver
   sudo lsof -i :6881  # PKARR relay
   sudo lsof -i :8000  # Nexus
   
   # Kill conflicting process or change ports in .env
   ```

2. **Insufficient Resources**
   - Docker doesn't have enough memory/CPU
   - **Solution**: Increase Docker resources:
   - Docker Desktop → Settings → Resources → Memory: 8GB+

3. **Environment Variables Missing**
   - `.env` file not configured
   - **Solution**: Copy and configure:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Volume Permission Issues**
   - Docker can't write to volumes
   - **Solution**: Fix permissions:
   ```bash
   sudo chown -R $USER:$USER ./data
   ```

**Debug Docker:**

```bash
# View logs
docker compose logs -f

# Check container status
docker compose ps

# Restart services
docker compose restart

# Full reset
docker compose down -v
docker compose up -d
```

### Database Connection Errors

**Symptom**: Nexus or Homeserver can't connect to Postgres/Neo4j

**Solution**:
```bash
# Check database containers are running
docker compose ps postgres neo4j redis

# Restart database services
docker compose restart postgres neo4j redis

# Check database logs
docker compose logs postgres
docker compose logs neo4j
```

---

## Data Operations Issues

### PUT/DELETE Operations Fail

**Symptom**: Can't store or delete data on homeserver

**Common Causes:**

1. **Invalid Path**
   - Path must start with `/pub/` for public data
   - **Solution**: Use correct path format:
   ```javascript
   // ✅ Correct
   await pubky.put('/pub/myapp/data.json', data);
   
   // ❌ Wrong
   await pubky.put('data.json', data);
   await pubky.put('/myapp/data.json', data);
   ```

2. **Data Too Large**
   - Homeserver has size limits (default: ~10MB per file)
   - **Solution**: Split large data or increase homeserver limit

3. **Rate Limiting**
   - Too many requests in short time
   - **Solution**: Implement backoff:
   ```javascript
   async function putWithRetry(path, data, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await pubky.put(path, data);
       } catch (e) {
         if (e.status === 429) {
           await new Promise(r => setTimeout(r, 1000 * (i + 1)));
         } else throw e;
       }
     }
   }
   ```

4. **Insufficient Permissions**
   - Trying to write to another user's space
   - **Solution**: Verify you're writing to your own pubky

---

## Pubky Ring Issues

### Can't Create Identity

**Symptom**: Key generation fails in Pubky Ring app

**Solutions**:
1. **Update the app**: Check for latest version
2. **Clear app cache**: Settings → Storage → Clear Cache
3. **Reinstall**: Uninstall and reinstall (backup recovery phrase first!)

### App Authorization Fails

**Symptom**: Pubky Ring doesn't authorize app requests

**Solutions**:
1. **Check app URL**: Ensure correct app origin
2. **Re-scan QR code**: Try authorization flow again
3. **Check Ring permissions**: Ensure app has necessary permissions

---

## Network & Performance Issues

### Slow PKARR Lookups

**Symptom**: Discovery takes a long time

**Solutions**:
1. **Use PKARR relay**: Faster than direct DHT:
   ```javascript
   const config = {
     pkarrRelay: 'https://pkarr.pubky.org'
   };
   ```

2. **Cache aggressively**: Store resolved homeserver URLs:
   ```javascript
   const cache = new Map();
   if (cache.has(publicKey)) {
     return cache.get(publicKey);
   }
   ```

3. **Use local PKDNS**: Run your own PKDNS server for faster resolution

### High Latency Requests

**Symptom**: Homeserver operations are slow

**Solutions**:
1. **Choose geographically close homeserver**
2. **Check homeserver load**: May be overloaded
3. **Use CDN**: Cache static data
4. **Optimize request batching**: Group operations

---

## Common Error Messages

### "Failed to fetch PKARR record"

**Causes**: DHT unreachable, record doesn't exist, network issues

**Solutions**:
- Check internet connection
- Verify record was published
- Try different PKARR relay
- Wait for DHT propagation

### "Homeserver not found"

**Causes**: PKARR record has no homeserver entries, DNS resolution failed

**Solutions**:
- Verify PKARR record contains homeserver URL
- Check PKDNS is working
- Test direct homeserver URL access

### "Session expired"

**Causes**: Auth session TTL passed

**Solutions**:
- Sign in again
- Implement automatic re-authentication

### "Permission denied"

**Causes**: Trying to access/modify unauthorized data

**Solutions**:
- Check capability tokens
- Verify you own the data
- Request proper permissions

---

## Getting Help

### Community Support

- **Telegram**: [t.me/pubkycore](https://t.me/pubkycore)
- **GitHub Issues**: [github.com/pubky/pubky-core/issues](https://github.com/pubky/pubky-core/issues)
- **Documentation**: [[index|Knowledge Base]]

### Reporting Bugs

When reporting bugs, include:

1. **Environment**: OS, browser/platform version, SDK version
2. **Steps to reproduce**: Exact sequence that causes the issue
3. **Error messages**: Full error text and stack traces
4. **Expected vs actual**: What should happen vs what happens
5. **Logs**: Relevant logs from homeserver/client

**Example:**
```markdown
## Environment
- OS: macOS 14.2
- SDK: @synonymdev/pubky@0.6.0
- Browser: Chrome 120

## Steps to Reproduce
1. Call `await pubky.put('/pub/test/file.json', data)`
2. Observe error

## Error Message
```
Error: Failed to PUT /pub/test/file.json: 500 Internal Server Error
```

## Expected
Data should be stored successfully

## Actual
500 error returned
```

### Useful Debugging Tools

**Browser DevTools:**
```javascript
// Enable verbose logging
localStorage.setItem('pubky:debug', 'true');

// Check network requests
// Open DevTools → Network tab → Filter: pubky
```

**Command Line:**
```bash
# Test PKARR
curl "https://pkarr.pubky.org/<public-key>"

# Test homeserver
curl -v "https://homeserver.com/pub/..."

# Check DNS
dig @8.8.8.8 <public-key>

# Test PKDNS
dig @pkdns.pkarr.org <public-key>
```

**Pubky CLI:**
```bash
# Check user info
pubky-cli user session ./recovery.file

# Test data operations
pubky-cli user get /pub/test ./recovery.file

# Admin diagnostics
PUBKY_ADMIN_PASSWORD=admin pubky-cli admin info
```

---

## See Also

- **[[Getting Started]]**: Setup guides
- **[[FAQ]]**: Frequently asked questions
- **[[Explore/Pubky Core/SDK|SDK Documentation]]**: Detailed API docs
- **[[PKDNS]]**: DNS resolution details
- **[[Homeserver]]**: Homeserver administration

