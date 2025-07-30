// const db = require('../config/db');
// const cloudinary = require('../config/cloudinary'); // Import configured Cloudinary instance

// function toMySQLDateTime(isoString) {
//   const date = new Date(isoString);
//   // Ensure the date is valid before formatting
//   if (isNaN(date.getTime())) {
//     console.error(`Invalid date string provided: ${isoString}`);
//     return null; // Or throw an error, depending on desired behavior
//   }
//   return date.toISOString().slice(0, 19).replace('T', ' ');
// }

// // Cloudinary upload helper
// async function uploadToCloudinary(file, folder) {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: file.mimetype && file.mimetype.startsWith('video/') ? 'video' : 'image'
//       },
//       (err, result) => {
//         if (err) {
//           console.error(`Cloudinary upload error for folder ${folder}:`, err);
//           reject(err);
//         }
//         else resolve(result.secure_url);
//       }
//     ).end(file.buffer);
//   });
// }

// exports.getEvents = (req, res) => {
//   const { status, user_id } = req.query;
//   db.query('SELECT * FROM events WHERE status = ?', [status], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//     }
//     if (!user_id) {
//       // If no user_id, just return events as is
//       return res.json(results);
//     }
//     // For each event, check if user has updated
//     const eventIds = results.map(ev => ev.id || ev.ID);
//     if (eventIds.length === 0) return res.json([]);
//     db.query('SELECT event_id FROM event_updates WHERE user_id = ? AND event_id IN (?)', [user_id, eventIds], (err2, updatedRows) => {
//       if (err2) {
//         console.error('Database error:', err2);
//         return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//       }
//       const updatedEventIds = new Set(updatedRows.map(row => row.event_id));
//       const eventsWithFlag = results.map(ev => ({
//         ...ev,
//         userHasUpdated: updatedEventIds.has(ev.id || ev.ID)
//       }));
//       res.json(eventsWithFlag);
//     });
//   });
// };

// exports.markEventAsViewed = (req, res) => {
//   const { event_id, user_id } = req.body;
//   const viewDateTime = toMySQLDateTime(new Date().toISOString());

//   if (!viewDateTime) {
//     return res.status(400).json({ error: 'अमान्य तिथि/समय' });
//   }

//   db.query(
//     'INSERT IGNORE INTO event_views (event_id, user_id, view_date_time) VALUES (?, ?, ?)',
//     [event_id, user_id, viewDateTime],
//     (err) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//       }
//       res.json({ success: true });
//     }
//   );
// };

// exports.updateEvent = async (req, res) => {
//   try {
//     const {
//       event_id,
//       user_id,
//       name,
//       description,
//       start_date_time,
//       end_date_time,
//       issue_date,
//       location,
//       attendees,
//       type
//     } = req.body;

//     // 🛠️ Format date strings to MySQL-safe format
//     const formattedStart = toMySQLDateTime(start_date_time);
//     const formattedEnd = toMySQLDateTime(end_date_time);
//     const formattedIssue = toMySQLDateTime(issue_date);

//     if (!formattedStart || !formattedEnd || !formattedIssue) {
//       return res.status(400).json({ error: 'अमान्य तिथि/समय प्रारूप' });
//     }

//     const update_date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

//     // 🖼️ Handle photos
//     let photos = [];
//     if (req.files && req.files.photos) {
//       for (const file of req.files.photos) {
//         if (!file || !file.buffer) continue;
//         const url = await uploadToCloudinary(file, 'event_photos');
//         photos.push(url);
//       }
//     }

//     // 🎞️ Handle video
//     let video = null;
//     if (req.files && req.files.video && req.files.video[0]) {
//       const file = req.files.video[0];
//       if (file && file.buffer) {
//         video = await uploadToCloudinary(file, 'event_videos');
//       }
//     }

//     // 📸 Handle media photos
//     let media_photos = [];
//     if (req.files && req.files.media_photos) {
//       for (const file of req.files.media_photos) {
//         if (!file || !file.buffer) continue;
//         const url = await uploadToCloudinary(file, 'event_media_photos');
//         media_photos.push(url);
//       }
//     }

//     // 🧾 Insert into DB
//     db.query(
//       `INSERT INTO event_updates (
//         event_id, user_id, name, description,
//         start_date_time, end_date_time, issue_date,
//         location, attendees, update_date,
//         photos, video, media_photos, type
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         event_id,
//         user_id,
//         name,
//         description,
//         formattedStart,
//         formattedEnd,
//         formattedIssue,
//         location,
//         attendees,
//         update_date,
//         JSON.stringify(photos),
//         video,
//         JSON.stringify(media_photos),
//         type
//       ],
//       (err) => {
//         if (err) {
//           console.error('Database error during event update:', err);
//           return res.status(500).json({ error: 'डेटाबेस त्रुटि', details: err.message });
//         }
//         res.json({ success: true, photos, video, media_photos });
//       }
//     );

//   } catch (error) {
//     console.error('Update event error:', error);
//     res.status(500).json({ error: 'सर्वर त्रुटि', details: error.message });
//   }
// };

// exports.addEvent = async (req, res) => {
//   const { name, description, start_date_time, end_date_time, issue_date, location, type, user } = req.body;

//   let photos = [];
//   if (req.files && req.files.photos) {
//     for (const file of req.files.photos) {
//       const url = await uploadToCloudinary(file, 'event_photos');
//       photos.push(url);
//     }
//   }

//   let video = null;
//   if (req.files && req.files.video && req.files.video[0]) {
//     const file = req.files.video[0];
//     if (file && file.buffer) {
//       video = await uploadToCloudinary(file, 'event_videos');
//     }
//   }

//   const status = new Date(start_date_time) > new Date() ? 'ongoing' : 'previous';

//   db.query(
//     'INSERT INTO events (name, description, start_date_time, end_date_time, issue_date, location, type, status, photos, video) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//     [name, description, start_date_time, end_date_time, issue_date, location, type, status, JSON.stringify(photos), video],
//     (err, result) => {
//       if (err) {
//         console.error('Database error during event add:', err);
//         return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//       }
//       const event_id = result.insertId;
//       // Link to all users if "All Jila Addhyaksh"
//       if (user === 'All Jila Addhyaksh') {
//         db.query('SELECT ID FROM users WHERE Designation != "Admin"', (err, users) => {
//           if (err) {
//             console.error('Database error fetching users for event linking:', err);
//             return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//           }
//           if (users.length === 0) {
//             return res.json({ success: true, message: 'No non-admin users found to link.' });
//           }
//           const values = users.map(u => [event_id, u.ID]);
//           db.query('INSERT INTO event_users (event_id, user_id) VALUES ?', [values], (err) => {
//             if (err) {
//               console.error('Database error inserting event users:', err);
//               return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//             }
//             res.json({ success: true });
//           });
//         });
//       } else {
//         res.json({ success: true });
//       }
//     }
//   );
// };

// exports.getEventReport = (req, res) => {
//   const { event_id } = req.params;
//   db.query(
//     `SELECT u.ID, u.User_Name as name, u.Designation as designation,
//              (SELECT COUNT(*) FROM event_views ev WHERE ev.user_id = u.ID AND ev.event_id = ?) as viewed,
//              (SELECT COUNT(*) FROM event_updates eu WHERE eu.user_id = u.ID AND eu.event_id = ?) as updated
//        FROM users u
//        JOIN event_users eu ON u.ID = eu.user_id
//        WHERE eu.event_id = ? AND u.Designation != "Admin"`,
//     [event_id, event_id, event_id],
//     (err, results) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//       }
//       db.query('SELECT * FROM events WHERE id = ?', [event_id], (err, eventResults) => {
//         if (err) {
//           console.error('Database error:', err);
//           return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//         }
//         res.json({ users: results, event: eventResults[0] });
//       });
//     }
//   );
// };

// exports.getUserEventDetails = (req, res) => {
//   const { event_id, user_id } = req.params;
//   // Fetch the latest update if multiple exist
//   db.query('SELECT * FROM event_updates WHERE event_id = ? AND user_id = ? ORDER BY update_date DESC, id DESC LIMIT 1', [event_id, user_id], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
//     }
//     res.json(results[0] || {});
//   });
// };
const db = require('../config/db');
const cloudinary = require('../config/cloudinary'); // Import configured Cloudinary instance

function toMySQLDateTime(isoString) {
  const date = new Date(isoString);
  // Ensure the date is valid before formatting
  if (isNaN(date.getTime())) {
    console.error(`Invalid date string provided: ${isoString}`);
    return null; // Or throw an error, depending on desired behavior
  }
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Cloudinary upload helper
async function uploadToCloudinary(file, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: file.mimetype && file.mimetype.startsWith('video/') ? 'video' : 'image'
      },
      (err, result) => {
        if (err) {
          console.error(`Cloudinary upload error for folder ${folder}:`, err);
          reject(err);
        }
        else resolve(result.secure_url);
      }
    ).end(file.buffer);
  });
}

exports.getEvents = (req, res) => {
  const { status, user_id } = req.query;
  db.query('SELECT * FROM events WHERE status = ?', [status], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
    }
    if (!user_id) {
      // If no user_id, just return events as is
      return res.json(results);
    }
    // For each event, check if user has updated
    const eventIds = results.map(ev => ev.id || ev.ID);
    if (eventIds.length === 0) return res.json([]);
    db.query('SELECT event_id FROM event_updates WHERE user_id = ? AND event_id IN (?)', [user_id, eventIds], (err2, updatedRows) => {
      if (err2) {
        console.error('Database error:', err2);
        return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
      }
      const updatedEventIds = new Set(updatedRows.map(row => row.event_id));
      const eventsWithFlag = results.map(ev => ({
        ...ev,
        userHasUpdated: updatedEventIds.has(ev.id || ev.ID)
      }));
      res.json(eventsWithFlag);
    });
  });
};

exports.markEventAsViewed = (req, res) => {
  const { event_id, user_id } = req.body;
  const viewDateTime = toMySQLDateTime(new Date().toISOString());

  if (!viewDateTime) {
    return res.status(400).json({ error: 'अमान्य तिथि/समय' });
  }

  db.query(
    'INSERT IGNORE INTO event_views (event_id, user_id, view_date_time) VALUES (?, ?, ?)',
    [event_id, user_id, viewDateTime],
    (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
      }
      res.json({ success: true });
    }
  );
};

exports.updateEvent = async (req, res) => {
  try {
    const {
      event_id,
      user_id,
      name,
      description,
      start_date_time,
      end_date_time,
      issue_date,
      location,
      attendees,
      type
    } = req.body;

    // 🛠️ Format date strings to MySQL-safe format
    const formattedStart = toMySQLDateTime(start_date_time);
    const formattedEnd = toMySQLDateTime(end_date_time);
    const formattedIssue = toMySQLDateTime(issue_date);

    if (!formattedStart || !formattedEnd || !formattedIssue) {
      return res.status(400).json({ error: 'अमान्य तिथि/समय प्रारूप' });
    }

    const update_date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // 🖼️ Handle photos
    let photos = [];
    if (req.files && req.files.photos) {
      for (const file of req.files.photos) {
        if (!file || !file.buffer) continue;
        const url = await uploadToCloudinary(file, 'event_photos');
        photos.push(url);
      }
    }

    // 🎞️ Handle video
    let video = null;
    if (req.files && req.files.video && req.files.video[0]) {
      const file = req.files.video[0];
      if (file && file.buffer) {
        video = await uploadToCloudinary(file, 'event_videos');
      }
    }

    // 📸 Handle media photos
    let media_photos = [];
    if (req.files && req.files.media_photos) {
      for (const file of req.files.media_photos) {
        if (!file || !file.buffer) continue;
        const url = await uploadToCloudinary(file, 'event_media_photos');
        media_photos.push(url);
      }
    }

    // 🧾 Insert into DB
    db.query(
      `INSERT INTO event_updates (
        event_id, user_id, name, description,
        start_date_time, end_date_time, issue_date,
        location, attendees, update_date,
        photos, video, media_photos, type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        user_id,
        name,
        description,
        formattedStart,
        formattedEnd,
        formattedIssue,
        location,
        attendees,
        update_date,
        JSON.stringify(photos),
        video,
        JSON.stringify(media_photos),
        type
      ],
      (err) => {
        if (err) {
          console.error('Database error during event update:', err);
          return res.status(500).json({ error: 'डेटाबेस त्रुटि', details: err.message });
        }
        res.json({ success: true, photos, video, media_photos });
      }
    );

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'सर्वर त्रुटि', details: error.message });
  }
};

exports.addEvent = async (req, res) => {
  const { name, description, start_date_time, end_date_time, issue_date, location, type, user } = req.body;

  let photos = [];
  if (req.files && req.files.photos) {
    for (const file of req.files.photos) {
      const url = await uploadToCloudinary(file, 'event_photos');
      photos.push(url);
    }
  }

  let video = null;
  if (req.files && req.files.video && req.files.video[0]) {
    const file = req.files.video[0];
    if (file && file.buffer) {
      video = await uploadToCloudinary(file, 'event_videos');
    }
  }

  const status = new Date(start_date_time) > new Date() ? 'ongoing' : 'previous';

  db.query(
    'INSERT INTO events (name, description, start_date_time, end_date_time, issue_date, location, type, status, photos, video) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, start_date_time, end_date_time, issue_date, location, type, status, JSON.stringify(photos), video],
    (err, result) => {
      if (err) {
        console.error('Database error during event add:', err);
        return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
      }
      const event_id = result.insertId;
      // Link to all users if "All Jila Addhyaksh"
      if (user === 'All Jila Addhyaksh') {
        db.query('SELECT ID FROM users WHERE Designation != "Admin"', (err, users) => {
          if (err) {
            console.error('Database error fetching users for event linking:', err);
            return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
          }
          if (users.length === 0) {
            return res.json({ success: true, message: 'No non-admin users found to link.' });
          }
          const values = users.map(u => [event_id, u.ID]);
          db.query('INSERT INTO event_users (event_id, user_id) VALUES ?', [values], (err) => {
            if (err) {
              console.error('Database error inserting event users:', err);
              return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
            }
            res.json({ success: true });
          });
        });
      } else {
        res.json({ success: true });
      }
    }
  );
};

exports.getEventReport = (req, res) => {
  const { event_id } = req.params;
  db.query(
    `SELECT u.ID, u.User_Name as name, u.Designation as designation,
             (SELECT COUNT(*) FROM event_views ev WHERE ev.user_id = u.ID AND ev.event_id = ?) as viewed,
             (SELECT COUNT(*) FROM event_updates eu WHERE eu.user_id = u.ID AND eu.event_id = ?) as updated
       FROM users u
       JOIN event_users eu ON u.ID = eu.user_id
       WHERE eu.event_id = ? AND u.Designation != "Admin"`,
    [event_id, event_id, event_id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
      }
      db.query('SELECT * FROM events WHERE id = ?', [event_id], (err, eventResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
        }
        res.json({ users: results, event: eventResults[0] });
      });
    }
  );
};

exports.getUserEventDetails = (req, res) => {
  const { event_id, user_id } = req.params;
  // Fetch the latest update if multiple exist
  db.query('SELECT * FROM event_updates WHERE event_id = ? AND user_id = ? ORDER BY update_date DESC, id DESC LIMIT 1', [event_id, user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'डेटाबेस त्रुटि' });
    }
    res.json(results[0] || {});
  });
};