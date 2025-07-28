const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const uploadCloud = require('../middleware/upload'); // Import the multer setup for Cloudinary

router.get('/events', eventController.getEvents);
router.post('/event_view', eventController.markEventAsViewed);

router.post(
  '/event_update',
  uploadCloud.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'media_photos', maxCount: 5 },
  ]),
  eventController.updateEvent
);

router.post(
  '/event_add',
  uploadCloud.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'video', maxCount: 1 },
  ]),
  eventController.addEvent
);

router.get('/event_report/:event_id', eventController.getEventReport);
router.get('/event_user_details/:event_id/:user_id', eventController.getUserEventDetails);

module.exports = router;