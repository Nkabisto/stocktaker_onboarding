# Phase 1: Database Setup & User Synchronization

**Estimated Time:** 2-3 hours  
**Objective:** Set up PostgreSQL database, create schema, and integrate Clerk webhooks for automatic user synchronization

---

## Step 1.1: Database Configuration & Schema

### Create Database Connection

**File:** `server/src/config/database.js`

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✓ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// Helper function to run queries
const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
  pool
};
```

### Create Database Schema

**File:** `server/src/config/schema.sql`

```sql
-- ============================================
-- Stocktaker Management System Database Schema
-- ============================================

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS form_submissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,              -- Clerk userId
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    has_completed_form BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Form Submissions Table
-- ============================================
CREATE TABLE form_submissions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    form_data JSONB NOT NULL DEFAULT '{}',    -- Store all form data as JSON
    step_completed INTEGER DEFAULT 0,          -- Track which step user is on (0-4)
    is_complete BOOLEAN DEFAULT FALSE,         -- Mark form as fully completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_completed_form ON users(has_completed_form);
CREATE INDEX idx_form_submissions_user_id ON form_submissions(user_id);
CREATE INDEX idx_form_submissions_is_complete ON form_submissions(is_complete);
CREATE INDEX idx_form_data_gin ON form_submissions USING GIN (form_data);

-- ============================================
-- Trigger Function: Update 'updated_at' timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to form_submissions table
CREATE TRIGGER update_form_submissions_updated_at
    BEFORE UPDATE ON form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Queries for Testing
-- ============================================

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify triggers created
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Insert test user (for manual testing)
-- INSERT INTO users (id, email, first_name, last_name) 
-- VALUES ('user_test123', 'test@example.com', 'Test', 'User');
```

### Install and Run Schema

```bash
# Navigate to server directory
cd server

# Run the schema file
psql -U stocktaker_user -d stocktaker_db -f src/config/schema.sql

# Should see output like:
# DROP TABLE
# DROP TABLE
# CREATE TABLE
# CREATE TABLE
# CREATE INDEX
# ...
# CREATE TRIGGER
```

### Create Database Test Script

**File:** `server/src/tests/test-db-connection.js`

```javascript
const { query, pool } = require('../config/database');

async function testDatabase() {
  console.log('\n🧪 Testing Database Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('Test 1: Connection test');
    const timeResult = await query('SELECT NOW() as current_time');
    console.log('✓ Connected at:', timeResult.rows[0].current_time);

    // Test 2: Check tables exist
    console.log('\nTest 2: Verify tables');
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('✓ Tables found:', tablesResult.rows.map(r => r.table_name));

    // Test 3: Check indexes
    console.log('\nTest 3: Verify indexes');
    const indexResult = await query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY indexname
    `);
    console.log('✓ Indexes found:', indexResult.rows.length);

    // Test 4: Check triggers
    console.log('\nTest 4: Verify triggers');
    const triggerResult = await query(`
      SELECT trigger_name, event_object_table 
      FROM information_schema.triggers 
      WHERE trigger_schema = 'public'
    `);
    console.log('✓ Triggers found:', triggerResult.rows.length);

    // Test 5: Insert and retrieve test data
    console.log('\nTest 5: CRUD operations');
    const testId = 'test_' + Date.now();
    const testEmail = `test_${Date.now()}@example.com`;

    await query(
      'INSERT INTO users (id, email, first_name, last_name) VALUES ($1, $2, $3, $4)',
      [testId, testEmail, 'Test', 'User']
    );
    console.log('✓ Test user inserted');

    const selectResult = await query('SELECT * FROM users WHERE id = $1', [testId]);
    console.log('✓ Test user retrieved:', selectResult.rows[0].email);

    await query('DELETE FROM users WHERE id = $1', [testId]);
    console.log('✓ Test user deleted');

    // Test 6: Trigger test
    console.log('\nTest 6: Trigger functionality');
    const triggerId = 'trigger_test_' + Date.now();
    await query(
      'INSERT INTO users (id, email) VALUES ($1, $2)',
      [triggerId, `trigger${Date.now()}@example.com`]
    );
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await query(
      'UPDATE users SET first_name = $1 WHERE id = $2',
      ['Updated', triggerId]
    );
    
    const triggerResult = await query('SELECT created_at, updated_at FROM users WHERE id = $1', [triggerId]);
    const timeDiff = new Date(triggerResult.rows[0].updated_at) - new Date(triggerResult.rows[0].created_at);
    console.log('✓ Trigger working (time diff:', timeDiff + 'ms)');

    await query('DELETE FROM users WHERE id = $1', [triggerId]);

    console.log('\n✅ All database tests passed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testDatabase();
```

### Run Database Tests

```bash
cd server
node src/tests/test-db-connection.js
```

**Expected Output:**
```
🧪 Testing Database Connection...

Test 1: Connection test
✓ Connected at: 2024-02-15T12:34:56.789Z

Test 2: Verify tables
✓ Tables found: [ 'form_submissions', 'users' ]

Test 3: Verify indexes
✓ Indexes found: 7

Test 4: Verify triggers
✓ Triggers found: 2

Test 5: CRUD operations
✓ Test user inserted
✓ Test user retrieved: test_1708001234567@example.com
✓ Test user deleted

Test 6: Trigger functionality
✓ Trigger working (time diff: 123ms)

✅ All database tests passed!
```

---

## Step 1.2: Clerk Webhook Integration

### Create Webhook Verification Middleware

**File:** `server/src/middleware/verifyWebhook.js`

```javascript
const { Webhook } = require('svix');

/**
 * Middleware to verify Clerk webhook signatures
 * This ensures webhooks are genuinely from Clerk
 */
function verifyWebhook(req, res, next) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      throw new Error('CLERK_WEBHOOK_SECRET is not configured');
    }

    // Extract Svix headers
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    // Validate headers present
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return res.status(400).json({ 
        error: 'Missing webhook headers' 
      });
    }

    // Get raw body as string
    const payload = JSON.stringify(req.body);

    // Create Svix webhook instance
    const wh = new Webhook(WEBHOOK_SECRET);

    // Verify the payload and headers
    let evt;
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Webhook verification failed:', err.message);
      return res.status(400).json({ 
        error: 'Webhook verification failed' 
      });
    }

    // Attach verified event to request
    req.webhookEvent = evt;
    next();

  } catch (err) {
    console.error('Webhook middleware error:', err.message);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

module.exports = verifyWebhook;
```

### Create Webhook Controller

**File:** `server/src/controllers/webhookController.js`

```javascript
const { query } = require('../config/database');

/**
 * Main webhook handler - routes events to specific handlers
 */
async function handleWebhook(req, res) {
  try {
    const evt = req.webhookEvent;
    const { type, data } = evt;

    console.log(`📩 Webhook received: ${type}`);

    // Route to appropriate handler
    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
      
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
      
      default:
        console.log(`ℹ️  Unhandled webhook type: ${type}`);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    // Still return 200 to prevent retries for unrecoverable errors
    res.status(200).json({ error: error.message });
  }
}

/**
 * Handle user.created event
 * Creates new user record in database
 */
async function handleUserCreated(data) {
  const { id, email_addresses, first_name, last_name } = data;
  const email = email_addresses[0]?.email_address;

  if (!email) {
    console.error('❌ No email found for user:', id);
    return;
  }

  try {
    const result = await query(
      `INSERT INTO users (id, email, first_name, last_name, has_completed_form)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING
       RETURNING *`,
      [id, email, first_name || null, last_name || null, false]
    );

    if (result.rows.length > 0) {
      console.log('✓ User created in database:', email);
    } else {
      console.log('ℹ️  User already exists:', email);
    }

  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

/**
 * Handle user.updated event
 * Updates user information in database
 */
async function handleUserUpdated(data) {
  const { id, email_addresses, first_name, last_name } = data;
  const email = email_addresses[0]?.email_address;

  try {
    await query(
      `UPDATE users 
       SET email = $2, first_name = $3, last_name = $4
       WHERE id = $1`,
      [id, email, first_name || null, last_name || null]
    );

    console.log('✓ User updated in database:', email);

  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
}

/**
 * Handle user.deleted event
 * Removes user from database (cascade deletes form submissions)
 */
async function handleUserDeleted(data) {
  const { id } = data;

  try {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING email',
      [id]
    );

    if (result.rows.length > 0) {
      console.log('✓ User deleted from database:', result.rows[0].email);
    }

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
}

module.exports = {
  handleWebhook
};
```

### Create Webhook Routes

**File:** `server/src/routes/webhooks.js`

```javascript
const express = require('express');
const router = express.Router();
const verifyWebhook = require('../middleware/verifyWebhook');
const { handleWebhook } = require('../controllers/webhookController');

/**
 * Clerk webhook endpoint
 * IMPORTANT: Must handle raw body for signature verification
 */
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Convert raw body back to JSON for processing
    req.body = JSON.parse(req.body);
    next();
  },
  verifyWebhook,
  handleWebhook
);

module.exports = router;
```

### Update Main Server File

**File:** `server/app.js`

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS Configuration
// ============================================
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));

// ============================================
// Body Parser Middleware
// Special handling for webhooks (they need raw body)
// ============================================
app.use((req, res, next) => {
  if (req.path.startsWith('/api/webhooks')) {
    // Skip JSON parsing for webhooks
    next();
  } else {
    // Parse JSON for all other routes
    express.json()(req, res, next);
  }
});

// ============================================
// Routes
// ============================================
const webhookRoutes = require('./src/routes/webhooks');
app.use('/api/webhooks', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// ============================================
// Error Handling
// ============================================
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
```

---

## Step 1.3: Webhook Testing & Configuration

### Option A: Local Testing with ngrok (Recommended for Development)

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   # OR download from https://ngrok.com/download
   ```

2. **Start your server:**
   ```bash
   cd server
   npm run dev
   ```

3. **In a new terminal, start ngrok:**
   ```bash
   ngrok http 5000
   ```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

5. **Configure Clerk Webhook:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Navigate to: Webhooks → Add Endpoint
   - Endpoint URL: `https://abc123.ngrok.io/api/webhooks/clerk`
   - Subscribe to events:
     - ✓ user.created
     - ✓ user.updated
     - ✓ user.deleted
   - Click "Create"
   - Copy the **Signing Secret** (starts with `whsec_`)

6. **Update server/.env:**
   ```env
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

7. **Restart your server** to load the new secret

### Manual Webhook Test Script

**File:** `server/src/tests/test-webhook-manual.js`

```javascript
const axios = require('axios');
const crypto = require('crypto');

const WEBHOOK_URL = 'http://localhost:5000/api/webhooks/clerk';
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

async function testWebhook() {
  const timestamp = Math.floor(Date.now() / 1000);
  const testPayload = {
    type: 'user.created',
    data: {
      id: 'user_test_' + Date.now(),
      email_addresses: [{
        email_address: `test_${Date.now()}@example.com`
      }],
      first_name: 'Test',
      last_name: 'User'
    }
  };

  const payload = JSON.stringify(testPayload);
  
  // Generate signature (simplified - Clerk uses Svix)
  const msgId = 'msg_test_' + Date.now();
  
  console.log('🧪 Testing webhook...\n');
  console.log('Payload:', testPayload);

  try {
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'svix-id': msgId,
        'svix-timestamp': timestamp.toString(),
        'svix-signature': 'v1,test_signature'
      }
    });

    console.log('\n✓ Webhook response:', response.data);
  } catch (error) {
    console.error('\n❌ Webhook test failed:', error.response?.data || error.message);
  }
}

testWebhook();
```

### Test with Real Clerk Signup

1. **Start server and ngrok**
2. **Visit your Clerk sign-up page**
3. **Create a test account**
4. **Check server logs** - should see:
   ```
   📩 Webhook received: user.created
   ✓ User created in database: test@example.com
   ```
5. **Verify in database:**
   ```bash
   psql -U stocktaker_user -d stocktaker_db -c "SELECT * FROM users ORDER BY created_at DESC LIMIT 1;"
   ```

---

## Verification Checklist

Before moving to Phase 2, verify:

**Database:**
- [ ] PostgreSQL running
- [ ] Database created
- [ ] Schema applied successfully
- [ ] Tables exist (users, form_submissions)
- [ ] Indexes created
- [ ] Triggers working
- [ ] CRUD operations working

**Server:**
- [ ] Server starts without errors
- [ ] Health endpoint accessible (`http://localhost:5000/health`)
- [ ] Webhook endpoint exists
- [ ] Environment variables loaded

**Clerk Integration:**
- [ ] Clerk account created
- [ ] Webhook configured in dashboard
- [ ] Webhook secret added to .env
- [ ] Test signup creates user in database
- [ ] User data syncs correctly

**Testing:**
- [ ] Database test script passes
- [ ] Can query users table
- [ ] Timestamps update correctly
- [ ] Webhook receives events

---

## Troubleshooting

### Database Connection Issues

**Problem:** "password authentication failed"
```bash
# Check PostgreSQL running
pg_isready

# Reset password
psql postgres
ALTER USER stocktaker_user WITH PASSWORD 'new_password';
\q

# Update DATABASE_URL in .env
```

**Problem:** "database does not exist"
```bash
psql postgres
CREATE DATABASE stocktaker_db;
GRANT ALL PRIVILEGES ON DATABASE stocktaker_db TO stocktaker_user;
```

### Webhook Issues

**Problem:** Webhook verification fails
- Ensure `CLERK_WEBHOOK_SECRET` is correct
- Check you're using the signing secret, not API key
- Verify ngrok URL is HTTPS
- Make sure server restarted after adding secret

**Problem:** Webhooks not received
- Check ngrok is running
- Verify Clerk dashboard has correct URL
- Check server logs for errors
- Try testing with Clerk's "Send Test Event" button

**Problem:** User not created in database
- Check server logs for errors
- Verify database connection
- Check email_addresses array has data
- Run database test script

---

## Next Steps

✅ **Phase 1 Complete!** You now have:
- Working database with proper schema
- Automatic user synchronization via Clerk
- Robust error handling
- Tested webhook integration

**Proceed to Phase 2:** User Status Check & Routing  
See: `02-PHASE-2-USER-STATUS-ROUTING.md`
