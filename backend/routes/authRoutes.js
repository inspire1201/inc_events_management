const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/user_visits/:user_id', authController.getUserVisits);

module.exports = router;