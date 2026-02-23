# 🐛 Debug Login 401 Error

## Quick Diagnosis

Your login endpoint returned **401 Unauthorized**. Here's how to fix it:

---

## Step 1: Check if Database is Seeded

Test this endpoint:
```bash
curl https://your-app.onrender.com/api/v1/health/db
```

**If you see empty counts or "0" for users table**:
```json
{
  "status": "ok",
  "tables": ["users", "products", "orders", "order_items"],
  "counts": {
    "users": 0,          ⬅️ NO USERS!
    "products": 0,
    "orders": 0,
    "order_items": 0
  }
}
```

**Solution**: Seed the database:
```bash
curl -X POST https://your-app.onrender.com/api/v1/seed
```

This creates:
- Admin: `admin@myntra.com` / `Admin123!`
- Customer: `customer@example.com` / `Customer123!`

---

## Step 2: Verify Login Request Format

Your login request must be:

```bash
curl -X POST https://your-app.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@myntra.com",
    "password": "Admin123!"
  }'
```

**Common Mistakes**:

❌ **Missing Content-Type header**
```bash
# Wrong - no header
curl -X POST https://your-app.onrender.com/api/v1/auth/login \
  -d '{"email":"admin@myntra.com","password":"Admin123!"}'
```

❌ **Wrong email format**
```json
{
  "email": "admin@myntra.com ",  // trailing space!
  "password": "Admin123!"
}
```

❌ **Wrong password**
```json
{
  "email": "admin@myntra.com",
  "password": "admin123!"  // lowercase 'a' instead of 'A'
}
```

✅ **Correct**:
```json
{
  "email": "admin@myntra.com",
  "password": "Admin123!"
}
```

---

## Step 3: Check Database Connection

Test database health:
```bash
curl https://your-app.onrender.com/api/v1/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "database": "connected",  ⬅️ Must be "connected"
  "environment": "production"
}
```

**If database is "disconnected"**:
1. Check Render logs for database errors
2. Verify `DATABASE_URL` is set in Environment variables
3. Verify database service is running

---

## Step 4: Verify Exact Error Message

The 401 response includes the error message. Check what it says:

### Error: "Invalid email or password"
**Cause**: User not found OR password incorrect

**Solutions**:
1. Verify database is seeded (Step 1)
2. Use exact credentials: `admin@myntra.com` / `Admin123!`
3. Check for typos or extra spaces

### Error: "Your account has been deactivated"
**Cause**: User's `isActive` field is `false`

**Solution**: 
The seed script creates active users by default. If you manually created the user, check the database:

```bash
curl https://your-app.onrender.com/api/v1/health/db
```

### Error: "Validation failed"
**Cause**: Missing required fields or invalid format

**Solution**: Ensure request includes both `email` and `password`:
```json
{
  "email": "admin@myntra.com",
  "password": "Admin123!"
}
```

---

## 🔍 Detailed Troubleshooting

### Test 1: Check if Users Table Exists
```bash
curl https://your-app.onrender.com/api/v1/health/db
```

**What to look for**:
- `users` should be in the tables array
- `users` count should be > 0 (at least 2 if seeded)

### Test 2: Seed Database
```bash
curl -X POST https://your-app.onrender.com/api/v1/seed
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "Database seeded successfully",
  "data": {
    "users": 2,
    "products": 15
  },
  "credentials": {
    "admin": {
      "email": "admin@myntra.com",
      "password": "Admin123!"
    },
    "customer": {
      "email": "customer@example.com",
      "password": "Customer123!"
    }
  }
}
```

**If already seeded**:
```json
{
  "status": "skipped",
  "message": "Database already seeded"
}
```

### Test 3: Try Login Again
After seeding, try login:

```bash
curl -X POST https://your-app.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@myntra.com",
    "password": "Admin123!"
  }'
```

**Expected Success Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@myntra.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🎯 Most Likely Solution

**99% of the time, this is the issue:**

The database hasn't been seeded yet, so no users exist. Run:

```bash
curl -X POST https://your-app.onrender.com/api/v1/seed
```

Then try login again with:
- Email: `admin@myntra.com`
- Password: `Admin123!`

---

## 📋 Quick Checklist

- [ ] Database is connected (check `/api/v1/health`)
- [ ] Database is seeded (run POST `/api/v1/seed`)
- [ ] Using correct credentials (`admin@myntra.com` / `Admin123!`)
- [ ] Request includes `Content-Type: application/json` header
- [ ] Request body is valid JSON with `email` and `password` fields
- [ ] No extra spaces in email or password

---

## 🔧 Additional Checks

### From Render Logs:
Look for these log messages that give more details:

```
POST /api/v1/auth/login - Status: 401 - 6ms
```

The quick response time (6ms) suggests:
- ✅ Server is responding
- ✅ Route exists
- ⚠️ But authentication failed

This typically means **user not found** or **wrong password**.

### Check Render Logs for More Details:
Go to Render Dashboard → Your Service → Logs

Look for error messages like:
- "Invalid email or password"
- "User not found"
- "Database query failed"

---

## 💡 Pro Tip: Test with Postman or curl

### Method 1: Using curl
```bash
curl -v -X POST https://your-app.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@myntra.com","password":"Admin123!"}'
```

The `-v` flag shows full request/response headers.

### Method 2: Using Postman
1. Create new POST request
2. URL: `https://your-app.onrender.com/api/v1/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "email": "admin@myntra.com",
     "password": "Admin123!"
   }
   ```

---

## 🎬 Expected Flow

### First Time Setup:
1. Deploy backend to Render ✅ (Done)
2. Check health: `GET /api/v1/health` ✅
3. Check database: `GET /api/v1/health/db` ✅
4. **Seed database**: `POST /api/v1/seed` ⬅️ **Do this now!**
5. Login: `POST /api/v1/auth/login` ✅

### After Seeding:
You can login with these credentials:

**Admin Account**:
```json
{
  "email": "admin@myntra.com",
  "password": "Admin123!"
}
```

**Customer Account**:
```json
{
  "email": "customer@example.com",
  "password": "Customer123!"
}
```

---

## 🆘 Still Not Working?

Share the **exact error message** from the response:

```bash
curl -X POST https://your-app.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@myntra.com","password":"Admin123!"}'
```

The response will tell us exactly what's wrong:
- "Invalid email or password" → User doesn't exist (seed database)
- "Validation failed" → Request format issue
- "Your account has been deactivated" → User is inactive

---

**Next Step**: Run the seed endpoint, then try login again! 🚀
