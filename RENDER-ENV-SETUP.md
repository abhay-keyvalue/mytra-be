# Render Environment Variables Setup

## Where to Set Environment Variables

1. Go to: https://dashboard.render.com/
2. Click your backend service (myntra-backend)
3. Click **"Environment"** tab
4. Add/Edit variables below

---

## Required Environment Variables

### 1. NODE_ENV
```
Key: NODE_ENV
Value: production
```

### 2. PORT
```
Key: PORT
Value: 3000
```
**Note**: Render might auto-set this. If it exists, leave it.

### 3. API_PREFIX
```
Key: API_PREFIX
Value: /api/v1
```

### 4. DATABASE_URL
```
Key: DATABASE_URL
Source: Database (myntra-db)
```
**Important**: This is automatically set by Render when you connect the database!
- Go to your service → Environment
- If not present, click **"Add Environment Variable"**
- Click **"Add from Database"**
- Select: `myntra-db`
- Property: `Connection String`

### 5. JWT_SECRET
```
Key: JWT_SECRET
Value: Generate Random
```
**How to generate**:
- Click **"Generate"** button in Render (recommended)
- Or use your own: `your-super-secret-jwt-key-min-32-chars-long-12345`

### 6. JWT_EXPIRES_IN
```
Key: JWT_EXPIRES_IN
Value: 7d
```

### 7. CORS_ORIGIN (CRITICAL!)
```
Key: CORS_ORIGIN
Value: https://your-frontend-app.vercel.app
```
**⚠️ Replace with your actual Vercel frontend URL!**
- Get this from Vercel dashboard after deploying frontend
- Must include `https://` protocol
- No trailing slash

---

## Optional Environment Variables

### 8. RUN_SEED (Optional)
```
Key: RUN_SEED
Value: false
```
Keep as `false`. Use the API endpoint to seed instead.

---

## Environment Variables from render.yaml

If you deployed using the `render.yaml` blueprint, these are already configured:
- ✅ NODE_ENV
- ✅ PORT
- ✅ API_PREFIX
- ✅ DATABASE_URL (from database connection)
- ✅ JWT_SECRET (auto-generated)
- ✅ JWT_EXPIRES_IN

**You only need to manually set:**
- ⚠️ **CORS_ORIGIN** (very important!)

---

## How to Update CORS_ORIGIN

### After deploying frontend to Vercel:

1. Copy your Vercel URL (e.g., `https://myntra-fe.vercel.app`)
2. Go to Render → Backend service → **Environment** tab
3. Find `CORS_ORIGIN` variable
4. Click **Edit**
5. Update value to: `https://myntra-fe.vercel.app`
6. Click **Save**
7. This triggers an automatic redeploy (~2 minutes)

---

## Database Connection Formats

Render provides DATABASE_URL in this format:
```
postgresql://username:password@host:5432/database
```

If you need individual variables instead, parse them from DATABASE_URL:
```
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=myntra_db_user
DB_PASSWORD=xxxxxxxxxxxxx
DB_NAME=myntra_db
```

**Our app supports both formats!**

---

## Verify Environment Variables

After setting all variables, check in Render logs:

```
✅ TypeORM database connection successful
🔄 Running database migrations...
✅ Executed 4 migration(s)
🚀 Server running on port 3000
📡 API: http://0.0.0.0:3000/api/v1
```

If you see errors:
- Check DATABASE_URL is set correctly
- Check JWT_SECRET is set
- Check CORS_ORIGIN matches your frontend URL

---

## Testing Environment Variables

### Test Database Connection
```bash
curl https://myntra-backend-rzr2.onrender.com/api/v1/health
```

Should show:
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "production"
}
```

### Test CORS
From your frontend (or use curl):
```bash
curl -H "Origin: https://myntra-fe.vercel.app" \
     https://myntra-backend-rzr2.onrender.com/api/v1/products
```

Should include header:
```
Access-Control-Allow-Origin: https://myntra-fe.vercel.app
```

---

## Environment Variable Checklist

- [ ] NODE_ENV=production
- [ ] PORT=3000
- [ ] API_PREFIX=/api/v1
- [ ] DATABASE_URL (from database)
- [ ] JWT_SECRET (generated)
- [ ] JWT_EXPIRES_IN=7d
- [ ] CORS_ORIGIN=https://your-vercel-url.vercel.app

---

## Security Best Practices

### ✅ DO:
- Use Render's "Generate" for JWT_SECRET
- Use DATABASE_URL from Render (internal connection)
- Update CORS_ORIGIN to exact frontend URL
- Use strong passwords

### ❌ DON'T:
- Commit .env files to git
- Share JWT_SECRET publicly
- Use `*` for CORS_ORIGIN in production
- Expose DATABASE_URL publicly

---

## Common Mistakes

### ❌ Wrong CORS_ORIGIN
```
CORS_ORIGIN=myntra-fe.vercel.app  ❌ (missing https://)
CORS_ORIGIN=https://myntra-fe.vercel.app/  ❌ (trailing slash)
CORS_ORIGIN=https://myntra-fe.vercel.app  ✅ (correct!)
```

### ❌ Missing DATABASE_URL
If not set, you'll see:
```
❌ TypeORM database connection failed
Error: getaddrinfo ENOTFOUND undefined
```

**Fix**: Add DATABASE_URL from database in Environment tab

### ❌ Wrong JWT_SECRET
Too short JWT_SECRET causes security warnings. Use at least 32 characters.

---

## Quick Copy-Paste for Render

Go to Environment tab and add these one by one:

```
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://YOUR-FRONTEND.vercel.app
```

**DATABASE_URL**: Add from Database (auto-filled)
**JWT_SECRET**: Click "Generate" button (auto-generated)

---

## After Setting All Variables

Click **"Save Changes"** → Render will auto-redeploy

Watch logs for:
- ✅ Build successful
- ✅ Database connected
- ✅ Migrations executed
- ✅ Server running

Then seed: `curl -X POST https://myntra-backend-rzr2.onrender.com/api/v1/seed`

---

**Need help?** See [FINAL-DEPLOYMENT-STEPS.md](../FINAL-DEPLOYMENT-STEPS.md)
