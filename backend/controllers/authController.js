const db = require('../config/db');

function toMySQLDateTime(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    console.error(`Invalid date string provided: ${isoString}`);
    return null;
  }
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

exports.login = async (req, res) => {
  const { pin } = req.body;
  console.log("📩 Received login request with pin:", pin);

  if (!pin) {
    return res.status(400).json({ error: 'पिन आवश्यक है' });
  }

  try {
    const [results] = await db.query('SELECT * FROM users_ev WHERE Pin = ?', [pin]);
    console.log("✅ Query result:", results);

    if (results.length === 0) {
      return res.status(401).json({ error: 'अमान्य पिन' });
    }

    const user = results[0];

    const visitDateTime = toMySQLDateTime(new Date().toISOString());
    const month = visitDateTime ? visitDateTime.slice(0, 7) : null;

    if (visitDateTime) {
      await db.query(
        'INSERT INTO user_visits (user_id, visit_date_time, month) VALUES (?, ?, ?)',
        [user.ID, visitDateTime, month]
      );
      console.log("📝 Visit logged");
    }

    res.json({
      id: user.ID,
      username: user.User_Name,
      designation: user.Designation,
      pin: user.Pin
    });

  } catch (err) {
    console.error('❌ Database error:', err);
    return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
  }
};

exports.getUserVisits = async (req, res) => {
  try {
    const { user_id } = req.params; 
    const month = new Date().toISOString().slice(0, 7); 

    const [results] = await db.query(
      'SELECT MAX(visit_date_time) as last_visit, COUNT(*) as monthly_count FROM user_visits WHERE user_id = ? AND month = ?',
      [user_id, month]
    );
    res.json(results[0]);
  } catch (err) {
    console.error('❌ Database error:', err);
    return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
  }
};