# 🔧 Update User Role to ADMIN

## Problem
You have an admin account but its role is set to "CUSTOMER" instead of "ADMIN".

## ✅ Solution - Use the Admin Utils Endpoint

I've created a new utility endpoint to fix this issue.

---

## Step 1: List All Users

First, check which users exist and their current roles:

```bash
curl https://your-app.onrender.com/api/v1/admin-utils/users
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "email": "admin@myntra.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "CUSTOMER",    ⬅️ Wrong role!
      "isActive": true
    },
    {
      "id": "uuid-456",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER",
      "isActive": true
    }
  ]
}
```

---

## Step 2: Update User to ADMIN Role

Replace `admin@myntra.com` with the actual email of the user you want to make admin:

```bash
curl -X POST https://your-app.onrender.com/api/v1/admin-utils/make-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@myntra.com"
  }'
```

**Expected Success Response**:
```json
{
  "success": true,
  "message": "Successfully updated admin@myntra.com to ADMIN role",
  "data": {
    "id": "uuid-123",
    "email": "admin@myntra.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"    ⬅️ Now ADMIN!
  }
}
```

**If already ADMIN**:
```json
{
  "success": true,
  "message": "User admin@myntra.com is already an ADMIN",
  "data": { ... }
}
```

---

## Step 3: Verify the Change

List users again to confirm:

```bash
curl https://your-app.onrender.com/api/v1/admin-utils/users
```

**Should now show**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "email": "admin@myntra.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",    ⬅️ ✅ Fixed!
      "isActive": true
    }
  ]
}
```

---

## Step 4: Test Login with ADMIN Role

Now try logging in with the admin account:

```bash
curl -X POST https://your-app.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@myntra.com",
    "password": "Admin123!"
  }'
```

**Expected Response**:
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
      "role": "ADMIN"    ⬅️ Now shows ADMIN!
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🎯 What You Can Do Now

After updating to ADMIN role, you can:

### Create Products (Admin Only)
```bash
curl -X POST https://your-app.onrender.com/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 999,
    "category": "Test Category",
    "brand": "Test Brand",
    "stock": 10
  }'
```

### Update Products (Admin Only)
```bash
curl -X PUT https://your-app.onrender.com/api/v1/products/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{ "price": 1299 }'
```

### Delete Products (Admin Only)
```bash
curl -X DELETE https://your-app.onrender.com/api/v1/products/:id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 New Admin Utils Endpoints

I've added these utility endpoints:

### 1. List All Users
```
GET /api/v1/admin-utils/users
```
- Shows all users with their roles
- No authentication required (for setup)

### 2. Make User Admin
```
POST /api/v1/admin-utils/make-admin
Body: { "email": "user@example.com" }
```
- Updates specified user's role to ADMIN
- No authentication required (for setup)

---

## 🔒 Security Note

**Important**: These admin utility endpoints are for initial setup only. After you have a working admin account, you should:

1. Remove or secure these endpoints
2. Or add authentication middleware to protect them
3. Or disable them in production after setup

For now, they're needed to fix your role issue!

---

## 🚀 Quick Summary

1. **List users**: `GET /api/v1/admin-utils/users`
2. **Make admin**: `POST /api/v1/admin-utils/make-admin` with `{"email": "admin@myntra.com"}`
3. **Verify**: List users again to confirm role changed
4. **Login**: Try login again - should work now!

---

## 📝 Example Usage

```bash
# Replace with your actual Render URL
BACKEND_URL="https://your-app.onrender.com"

# Step 1: Check current users
curl $BACKEND_URL/api/v1/admin-utils/users

# Step 2: Make admin
curl -X POST $BACKEND_URL/api/v1/admin-utils/make-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@myntra.com"}'

# Step 3: Login as admin
curl -X POST $BACKEND_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@myntra.com", "password": "Admin123!"}'
```

---

## ✅ Changes Made

**New File**:
- `src/routes/admin-utils.routes.ts` - Admin utility endpoints

**Modified**:
- `src/routes/index.ts` - Added admin-utils route

**Built**:
- Compiled successfully to `dist/routes/admin-utils.routes.js`

---

**Push these changes to GitHub, wait for Render to redeploy, then use the make-admin endpoint!** 🚀
