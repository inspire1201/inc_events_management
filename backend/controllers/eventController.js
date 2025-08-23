const db = require("../config/db");
const s3 = require("../config/s3");

const toMySQLDateTime = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return null;
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const uploadToS3 = (file, folder) =>
  new Promise((resolve, reject) => {
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      //      ACL: "public-read", // use 'private' for signed URLs
    };

    s3.upload(params, (err, data) => {
      if (err) return reject(err);
      resolve(data.Location);
    });
  });

// --------------------- EVENT CONTROLLERS --------------------- //

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

//make fro pdf upload 24
exports.updateEvent = async (req, res) => {
  try {
    const {
      event_id, user_id, name, description,
      start_date_time, end_date_time, issue_date, location, 
      attendees, type, media_video_urls, media_other_urls
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
        const url = await uploadToS3(file, "event_photos");
        photos.push(url);
      }
    }

    let video = null;
    if (req.files?.video?.[0]) {
      video = await uploadToS3(req.files.video[0], "event_videos");
    }

    let pdf = null;
    if (req.files?.pdf?.[0]) {
      pdf = await uploadToS3(req.files.pdf[0], "event_pdfs");
    }

    const media_photos = [];
    if (req.files?.media_photos) {
      for (const file of req.files.media_photos) {
        const url = await uploadToS3(file, "event_media_photos");
        media_photos.push(url);
      }
    }

    // Validate URLs if provided
    if (media_video_urls && !isValidUrl(media_video_urls)) {
      return res.status(400).json({ error: "अमान्य YouTube URL प्रारूप" });
    }

    if (media_other_urls) {
      const urls = media_other_urls.split(',');
      for (const url of urls) {
        if (url.trim() && !isValidUrl(url.trim())) {
          return res.status(400).json({ 
            error: `अमान्य URL प्रारूप: ${url}` 
          });
        }
      }
    }

    const [existing] = await db.query(
      'SELECT id FROM event_updates WHERE event_id = ? AND user_id = ?',
      [event_id, user_id]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE event_updates
         SET name = ?, description = ?, start_date_time = ?, end_date_time = ?,
             issue_date = ?, location = ?, attendees = ?, update_date = ?,
             photos = ?, video = ?, pdf = ?, media_photos = ?, type = ?,
             media_video_urls = ?, media_other_urls = ?
         WHERE event_id = ? AND user_id = ?`,
        [
          name, description, formattedStart, formattedEnd,
          formattedIssue, location, attendees, update_date,
          JSON.stringify(photos), video, pdf, JSON.stringify(media_photos), type,
          media_video_urls || null, media_other_urls || null,
          event_id, user_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO event_updates
           (event_id, user_id, name, description, start_date_time, end_date_time, issue_date,
            location, attendees, update_date, photos, video, pdf, media_photos, type,
            media_video_urls, media_other_urls)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event_id, user_id, name, description,
          formattedStart, formattedEnd, formattedIssue,
          location, attendees, update_date,
          JSON.stringify(photos), video, pdf, JSON.stringify(media_photos), type,
          media_video_urls || null, media_other_urls || null
        ]
      );
    }

    res.json({ 
      success: true, 
      photos, 
      video, 
      pdf, 
      media_photos,
      media_video_urls,
      media_other_urls
    });
  } catch (err) {
    console.error("updateEvent error:", err);
    res.status(500).json({ error: "सर्वर त्रुटि", details: err.message });
  }
};
exports.addEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      start_date_time,
      end_date_time,
      issue_date,
      location,
      type,
      user
    } = req.body;

    const photos = [];
    if (req.files?.photos) {
      for (const file of req.files.photos) {
        const url = await uploadToS3(file, "event_photos");
        photos.push(url);
      }
    }

    let video = null;
    if (req.files?.video?.[0]) {
      video = await uploadToS3(req.files.video[0], "event_videos");
    }

    let pdf = null;
    if (req.files?.pdf?.[0]) {
      pdf = await uploadToS3(req.files.pdf[0], "event_pdfs");
    }

    const endDate = new Date(end_date_time);
    const now = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(now.getDate() - 5);
    const status = endDate < fiveDaysAgo ? "previous" : "ongoing";

    const [result] = await db.query(
      `INSERT INTO events
         (name, description, start_date_time, end_date_time, issue_date, location, type, status, photos, video, pdf)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        start_date_time,
        end_date_time,
        issue_date,
        location,
        type,
        status,
        JSON.stringify(photos),
        video,
        pdf
      ]
    );

    const event_id = result.insertId;

    if (user === "All Jila Addhyaksh") {
      const [users] = await db.query('SELECT ID FROM users_ev WHERE Designation != "Admin"');
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
         FROM users_ev u
         JOIN event_users eu ON u.ID = eu.user_id
        WHERE eu.event_id = ? AND u.Designation != "Admin"`,
      [event_id, event_id, event_id]
    );
    
    // Get event data including the URL fields
    const [events] = await db.query(
      `SELECT e.*, 
              eu.media_video_urls, eu.media_other_urls
       FROM events e
       LEFT JOIN event_updates eu ON e.id = eu.event_id
       WHERE e.id = ?
       LIMIT 1`,
      [event_id]
    );
    
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
      `SELECT *, media_video_urls, media_other_urls 
       FROM event_updates
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

exports.deleteEventsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status || (status !== 'ongoing' && status !== 'previous')) {
      return res.status(400).json({ error: 'Invalid or missing status. Must be "ongoing" or "previous".' });
    }

    const [events] = await db.query('SELECT id FROM events WHERE status = ?', [status]);
    const eventIds = events.map(ev => ev.id);
    if (eventIds.length === 0) return res.json({ message: `No ${status} events found to delete.` });

    await db.query('DELETE FROM event_users WHERE event_id IN (?)', [eventIds]);
    await db.query('DELETE FROM event_views WHERE event_id IN (?)', [eventIds]);
    await db.query('DELETE FROM event_updates WHERE event_id IN (?)', [eventIds]);
    const [result] = await db.query('DELETE FROM events WHERE status = ?', [status]);

    res.json({ message: `✅ ${result.affectedRows} "${status}" event(s) deleted successfully.` });
  } catch (err) {
    console.error("deleteEventsByStatus error:", err);
    res.status(500).json({ error: "डेटाबेस त्रुटि", details: err.message });
  }
};


exports.downloadPDF = async (req, res) => {
  try {
    const { event_id } = req.params;
    
    const [events] = await db.query('SELECT pdf FROM events WHERE id = ?', [event_id]);
    
    if (!events.length || !events[0].pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    
    const pdfUrl = events[0].pdf;
    
    const urlParts = pdfUrl.split('/');
    const key = urlParts.slice(3).join('/');
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };
    
    const headResult = await s3.headObject(params).promise();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', headResult.ContentLength);
    res.setHeader('Content-Disposition', `inline; filename="${key.split('/').pop()}"`);
    
    const fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(res);
    
  } catch (err) {
    console.error("downloadPDF error:", err);
    res.status(500).json({ error: "सर्वर त्रुटि", details: err.message });
  }
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};