const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // handles multipart/form-data

const { handleAffirmation } = require('../controllers/affirmationController');

// your other routes...

router.post('/affirmation', upload.single('audio'), handleAffirmation);

module.exports = router;
