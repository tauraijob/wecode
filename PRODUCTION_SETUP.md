# Production Setup Commands

## For Live/Production Environment

If users are not showing up on your live site, you need to run these commands:

### 1. **Generate Prisma Client** (Required)
```bash
npx prisma generate
```
This generates the Prisma client for your production database.

### 2. **Run Database Migrations** (Required)
```bash
npx prisma migrate deploy
```
**IMPORTANT:** Use `migrate deploy` (NOT `migrate dev`) for production!
This applies all database migrations to create the necessary tables.

### 3. **Seed the Database** (Required for Initial Setup)
```bash
npm run prisma:seed
```
or
```bash
npx prisma db seed
```

This creates the initial users:
- **Admin:** `taujob1111@gmail.com` / `ElearningAdmin@2024`
- **Student:** `info@wecode.co.zw` / `ElearningStudent@2024`
- **Instructor:** `mtauraij@gmail.com` / `ElearningInstructor@2024`

### 4. **Rebuild the Application** (After Changes)
```bash
npm run build
```

### 5. **Restart Your Server**
If using PM2:
```bash
pm2 restart wecodezw
```
Or restart your Node.js process.

---

## Complete Production Deployment Sequence

Run these commands in order:

```bash
# 1. Install dependencies (if needed)
npm ci

# 2. Generate Prisma Client
npx prisma generate

# 3. Apply database migrations
npx prisma migrate deploy

# 4. Seed the database (creates initial users)
npm run prisma:seed

# 5. Build the application
npm run build

# 6. Restart the server
pm2 restart wecodezw
# or restart your Node.js process
```

---

## Verify Users Were Created

After running the seed, you can verify by:

1. **Logging in as admin:**
   - Email: `taujob1111@gmail.com`
   - Password: `ElearningAdmin@2024`

2. **Checking the admin users page:**
   - Go to `/admin/users`
   - You should see all seeded users

---

## Troubleshooting

### If users still don't show:

1. **Check database connection:**
   - Verify `DATABASE_URL` is set correctly in your production environment
   - Test database connection

2. **Check if seed ran successfully:**
   - Look for seed output in logs
   - Should see: "✅ E-Learning Admin user created"

3. **Verify Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Check authentication:**
   - Make sure JWT_SECRET is set
   - Try logging in with admin credentials

5. **Check database directly:**
   - Connect to your production database
   - Query: `SELECT * FROM User;`
   - Should see the seeded users

---

## Important Notes

- **Never run `prisma migrate dev` in production** - use `prisma migrate deploy`
- **Never run `prisma migrate reset` in production** - this deletes all data
- **Seed is safe to run multiple times** - it uses `upsert` so it won't create duplicates
- **Always backup your database** before running migrations



