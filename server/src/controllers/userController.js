import { query, pool } from '../config/database.js'; // Assumes pool is exported for transactions

/**
 * GET /user/status/:userId
 */
export async function getUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const result = await query(
      'SELECT id, email, first_name, last_name, has_completed_form FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ exists: false });
    }

    const user = result.rows[0];
    res.json({
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        hasCompletedForm: user.has_completed_form
      }
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /user/upsert
 */
export async function upsertUser(req, res) {
  try {
    const { userId, email, firstName, lastName } = req.body;
    
    await query(
      `INSERT INTO users (id, email, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name`,
      [userId, email, firstName, lastName]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Upsert error:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
}

// Immutable mapping to prevent prototype pollution / SQL injection
const COLUMN_MAPPING = Object.freeze({
  firstnames: 'firstnames',
  surname: 'surname',
  gender: 'gender',
  birthdate: {
    column: 'birthdate',
    format: (v) => {
      if (!v) return null;
      // Using UTC methods to prevent timezone shifting (e.g., midnight becoming 11PM previous day)
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    }
  },
  said: 'said',
  southAfricanCitizen: 'south_african_citizen',
  race: 'race',
  email: 'email',
  contactnumber: 'contactnumber',
  secondarycontact: 'secondarycontact',
  facebookurl: 'facebookurl',
  address: 'address',
  suburb: 'suburb',
  city: 'city',
  postcode: 'postcode',
  highestGrade: 'highest_grade',
  tertiaryInstitution: 'tertiary_institution',
  fieldOfStudy: 'field_of_study',
  yearCompleted: {
    column: 'year_completed',
    format: (v) => {
      const num = parseInt(v, 10);
      return isNaN(num) ? null : num;
    }
  },
  skillsInterest: 'skills_interest',
  driversLicense: 'drivers_license',
  otherSkills: 'other_skills',
  availability: 'availability',
  howHeard: 'how_heard',
  otherHowHeard: 'other_how_heard',
  trainingFeeAware: 'training_fee_aware',
  transportAware: 'transport_aware',
  interviewDate: {
    column: 'interview_date',
    format: (v) => {
      if (!v) return null;
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    }
  },
  interviewTime: {
    column: 'interview_time',
    format: (v) => {
      if (typeof v !== 'string' || !v.includes(':')) return null;
      const parts = v.split(':');
      // Enforce HH:MM:SS format for Postgres time type
      return parts.length >= 2 ? `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00` : null;
    }
  }
});

/**
 * POST /form/save
 */
export async function saveFormData(req, res) {
  const { userId, formData } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  // Use a transaction to ensure both updates succeed or fail together
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const columns = [];
    const values = [];
    const placeholders = [];

    // Construct query from verified mapping only
    Object.entries(COLUMN_MAPPING).forEach(([key, mapping], index) => {
      const rawValue = formData[key];
      const columnName = typeof mapping === 'string' ? mapping : mapping.column;
      let value = typeof mapping === 'string' ? rawValue : mapping.format(rawValue);

      if (value === '' || value === undefined) value = null;

      columns.push(columnName);
      values.push(value);
      placeholders.push(`$${index + 1}`);
    });

    // Append userId and completion status
    const finalValues = [...values, userId];
    const insertQuery = `
      INSERT INTO form_submissions (${columns.join(', ')}, user_id, is_complete)
      VALUES (${placeholders.join(', ')}, $${finalValues.length}, true)
      ON CONFLICT (user_id) DO UPDATE SET
        ${columns.map(col => `${col} = EXCLUDED.${col}`).join(', ')},
        is_complete = true,
        updated_at = NOW()
    `;

    await client.query(insertQuery, finalValues);

    // Sync status to users table
    await client.query(
      'UPDATE users SET has_completed_form = true WHERE id = $1',
      [userId]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Application submitted successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction Error:', error);
    res.status(500).json({ error: 'An error occurred while saving your application.' });
  } finally {
    client.release(); // Return connection to pool
  }
}

