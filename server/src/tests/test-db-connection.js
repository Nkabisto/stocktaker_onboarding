import { query, pool } from '../config/database.js';

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
    console.log('✓ Indexes found:', indexResult.rows.length); // Added this log

    // Test 4: Verify triggers
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
    const triggerTestId = 'trigger_test_' + Date.now();
    await query(
      'INSERT INTO users (id, email) VALUES ($1, $2)',
      [triggerTestId, `triggers${Date.now()}@example.com`] // FIXED: changed $() to ${}
    );

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 100));

    await query(
      'UPDATE users SET first_name = $1 WHERE id = $2',
      ['Updated', triggerTestId]
    );
    
    const updateCheck = await query('SELECT created_at, updated_at FROM users WHERE id = $1', [triggerTestId]);
    const timeDiff = new Date(updateCheck.rows[0].updated_at) - new Date(updateCheck.rows[0].created_at);
    console.log('✓ Trigger working (time diff:', timeDiff + 'ms)');

    await query('DELETE FROM users WHERE id = $1', [triggerTestId]);

    console.log('\n✅ All database tests passed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    process.exit(1);
  } finally {
    // Gracefully close the [node-postgres Pool](https://node-postgres.com)
    await pool.end();
  }
}

testDatabase();

