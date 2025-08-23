const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload');

router.get('/events', eventController.getEvents);
router.post('/event_view', eventController.markEventAsViewed);

router.post(
  '/event_update',
  upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'media_photos', maxCount: 5 },
    { name: 'pdf', maxCount: 1 }, 
  ]),
  eventController.updateEvent
);

router.post(
  '/event_add',
  upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }, // Add PDF support for new events
  ]),
  eventController.addEvent
);

router.get('/event_pdf/:event_id', eventController.downloadPDF);
router.get('/event_report/:event_id', eventController.getEventReport);
router.get('/event_user_details/:event_id/:user_id', eventController.getUserEventDetails);

// Development-only
router.delete('/events', eventController.deleteEventsByStatus);

module.exports = router;