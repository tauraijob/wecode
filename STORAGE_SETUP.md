# Local Server Storage Setup

The platform uses **local server storage** for all files (certificates, etc.). No cloud services are required!

## How It Works

- Files are stored in: `public/uploads/` directory
- Certificates are stored in: `public/uploads/certificates/`
- Files are directly accessible via HTTP: `/uploads/certificates/filename.pdf`
- The directory is automatically created if it doesn't exist

## Directory Structure

```
public/
  uploads/
    certificates/
      certificate-ABC123.pdf
      certificate-XYZ789.pdf
      ...
```

## Setup

**No configuration needed!** The system automatically:
1. Creates the `public/uploads/certificates/` directory on first use
2. Stores certificates there when generated
3. Serves them directly via HTTP

## File Access

Certificates are accessible at:
- URL: `https://yourdomain.com/uploads/certificates/certificate-ABC123.pdf`
- Or via download endpoint: `/api/certificates/[id]/download`

## Backup Recommendations

Since files are stored on your server, make sure to:

1. **Regular Backups:**
   - Include `public/uploads/` in your backup routine
   - Back up certificates along with your database

2. **Disk Space:**
   - Monitor disk usage in `public/uploads/`
   - Consider cleanup of old certificates if needed

3. **Security:**
   - The `public/uploads/` directory is already in `.gitignore`
   - Files are served publicly (as intended for certificates)
   - Consider adding access controls if needed

## Production Deployment

When deploying to production:

1. **Create uploads directory:**
   ```bash
   mkdir -p public/uploads/certificates
   ```

2. **Set proper permissions:**
   ```bash
   chmod 755 public/uploads
   chmod 755 public/uploads/certificates
   ```

3. **Ensure write permissions:**
   - Your server process needs write access to `public/uploads/`

4. **Backup strategy:**
   - Include `public/uploads/` in your backup scripts
   - Consider syncing to backup storage if needed

## Notes

- Files are stored permanently on your server
- No external dependencies or API keys needed
- Works immediately without any configuration
- Certificates are publicly accessible (by design)

---

**That's it!** Your server storage is ready to use. 🎉

