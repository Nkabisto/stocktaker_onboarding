// server/src/controllers/userController.js
import { query } from '../config/database.js';

export async function getUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ exists: false });
    }

    res.json({
      exists: true,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        hasCompletedForm: result.rows[0].has_completed_form
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user status' });
  }
}

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
    res.status(500).json({ error: error.message });
  }
}

export async function saveFormData(req, res) {
  try {
    const { userId, formData } = req.body;
    
    await query(
      `INSERT INTO form_submissions (user_id, form_data, is_complete)
       VALUES ($1, $2, true)
       ON CONFLICT (user_id) DO UPDATE SET
         form_data = EXCLUDED.form_data,
         is_complete = true`,
      [userId, JSON.stringify(formData)]
    );

    // Update user status
    await query(
      'UPDATE users SET has_completed_form = true WHERE id = $1',
      [userId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

