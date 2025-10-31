const express = require('express');
const router = express.Router();
const controller = require('../controllers/messageController');

// verification endpoint
router.get('/', controller.verifyWebhook);
// incoming messages
router.post('/', controller.handleIncoming);

module.exports = router;
