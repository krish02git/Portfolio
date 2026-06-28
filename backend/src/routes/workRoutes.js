const express = require('express');
const router = express.Router();
const { getWork, newWork, previousEdit, deleteWork, getWorkId } = require('../controllers/workController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/getWork', getWork);
router.get('/getWorkId', verifyAdmin, getWorkId);
router.post('/newWork', verifyAdmin, newWork);
router.put('/previousEdit/:expId', verifyAdmin, previousEdit);
router.delete('/deleteWork/:expId', verifyAdmin, deleteWork);

module.exports = router;
