-- =============================================
-- Stocktaker Management System Database Schema
-- ============================================

--Drop tables if they exist (for development)
DROP TABLE IF EXISTS form_submissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users(
  id VARCHAR(255) PRIMARY KEY,  -- Clerk useId
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

