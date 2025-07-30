
const db = require("../config/db");
const cloudinary = require("../config/cloudinary"); // configured v2
const { Readable } = require("stream");

const toMySQLDateTime = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return null;
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const uploadToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    Readable.from(file.buffer).pipe(stream);
  });

exports.getEvents = async (req, res) => {
  try {
    const { status, user_id } = req.query;
    const [events] = await db.query("SELECT * FROM events WHERE status = ?", [status]);

    if (!user_id) return res.json(events);

    const eventIds = events.map(ev => ev.id || ev.ID);
    if (eventIds.length === 0) return res.json([]);

    const [updatedRows] = await db.query(
      "SELECT event_id FROM event_updates WHERE user_id = ? AND event_id IN (?)",
      [user_id, eventIds]
    );

    const updatedSet = new Set(updatedRows.map(r => r.event_id));
    const eventsWithFlag = events.map(ev => ({
      ...ev,
      userHasUpdated: updatedSet.has(ev.id || ev.ID),
    }));

    res.json(eventsWithFlag);
  } catch (err) {
    console.error("getEvents error:", err);
    res.status(500).json({ error: "डेटाबेस त्रुटि", details: err.message });
  }
};

exports.markEventAsViewed = async (req, res) => {
  try {
    const { event_id, user_id } = req.body;
    const viewDateTime = toMySQLDateTime(new Date().toISOString());

    await db.query(
      "INSERT IGNORE INTO event_views (event_id, user_id, view_date_time) VALUES (?, ?, ?)",
      [event_id, user_id, viewDateTime]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("markEventAsViewed error:", err);
    res.status(500).json({ error: "डेटाबेस त्रुटि", details: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const {
      event_id, user_id, name, description,
      start_date_time, end_date_time, issue_date, location, attendees, type,
    } = req.body;

    const formattedStart = toMySQLDateTime(start_date_time);
    const formattedEnd = toMySQLDateTime(end_date_time);
    const formattedIssue = toMySQLDateTime(issue_date);

    if (!formattedStart || !formattedEnd || !formattedIssue) {
      return res.status(400).json({ error: "अमान्य तिथि/समय प्रारूप" });
    }

    const update_date = new Date().toISOString().slice(0, 10);

    const photos = [];
    if (req.files?.photos) {
      for (const file of req.files.photos) {
        const url = await uploadToCloudinary(file, "event_photos");
        photos.push(url);
      }
    }

    let video = null;
    if (req.files?.video?.[0]) {
      video = await uploadToCloudinary(req.files.video[0], "event_videos");
    }

    const media_photos = [];
    if (req.files?.media_photos) {
      for (const file of req.files.media_photos) {
        const url = await uploadToCloudinary(file, "event_media_photos");
        media_photos.push(url);
      }
    }

    await db.query(
      `INSERT INTO event_updates 
         (event_id, user_id, name, description, start_date_time, end_date_time, issue_date,
          location, attendees, update_date, photos, video, media_photos, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id, user_id, name, description,
        formattedStart, formattedEnd, formattedIssue,
        location, attendees, update_date,
        JSON.stringify(photos), video, JSON.stringify(media_photos), type,
      ]
    );

    res.json({ success: true, photos, video, media_photos });
  } catch (err) {
    console.error("updateEvent error:", err);
    res.status(500).json({ error: "सर्वर त्रुटि", details: err.message });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const { name, description, start_date_time, end_date_time, issue_date, location, type, user } = req.body;

    const photos = [];
    if (req.files?.photos) {
      for (const file of req.files.photos) {
        const url = await uploadToCloudinary(file, "event_photos");
        photos.push(url);
      }
    }

    let video = null;
    if (req.files?.video?.[0]) {
      video = await uploadToCloudinary(req.files.video[0], "event_videos");
    }

    const status = new Date(start_date_time) > new Date() ? "ongoing" : "previous";

    const [result] = await db.query(
      `INSERT INTO events
         (name, description, start_date_time, end_date_time, issue_date, location, type, status, photos, video)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, start_date_time, end_date_time, issue_date, location, type, status, JSON.stringify(photos), video]
    );

    const event_id = result.insertId;
    if (user === "All Jila Addhyaksh") {
      const [users] = await db.query('SELECT ID FROM users WHERE Designation != "Admin"');
      if (users.length) {
        const values = users.map(u => [event_id, u.ID]);
        await db.query('INSERT INTO event_users (event_id, user_id) VALUES ?', [values]);
      }
    }

    res.json({ success: true, event_id });
  } catch (err) {
    console.error("addEvent error:", err);
    res.status(500).json({ error: "डेटाबेस त्रुटि", details: err.message });
  }
};

exports.getEventReport = async (req, res) => {
  try {
    const { event_id } = req.params;
    const [users] = await db.query(
      `SELECT u.ID, u.User_Name as name, u.Designation as designation,
              (SELECT COUNT(*) FROM event_views ev WHERE ev.user_id = u.ID AND ev.event_id = ?) as viewed,
              (SELECT COUNT(*) FROM event_updates eu WHERE eu.user_id = u.ID AND eu.event_id = ?) as updated
         FROM users u
         JOIN event_users eu ON u.ID = eu.user_id
        WHERE eu.event_id = ? AND u.Designation != "Admin"`,
      [event_id, event_id, event_id]
    );
    const [events] = await db.query('SELECT * FROM events WHERE id = ?', [event_id]);
    res.json({ users, event: events[0] });
  } catch (err) {
    console.error("getEventReport error:", err);
    res.status(500).json({ error: "डेटाबेस त्रुटि", details: err.message });
  }
};

exports.getUserEventDetails = async (req, res) => {
  try {
    const { event_id, user_id } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM event_updates
         WHERE event_id = ? AND user_id = ?
         ORDER BY update_date DESC, id DESC
         LIMIT 1`,
      [event_id, user_id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    console.error("getUserEventDetails error:", err);
    res.status(500).json({ error: "डेटाबेस त्रुटि", details: err.message });
  }
};
