const express = require('express');
const router = express.Router();
const grammarController = require('../controllers/grammarController');
const { authenticateToken } = require('../middleware/auth');

router.post('/check-grammar', authenticateToken, grammarController.checkGrammar);

module.exports = router;