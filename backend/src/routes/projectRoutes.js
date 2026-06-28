const express = require('express');
const router = express.Router();
const { getProject, getProjectId, newProject, previousEdit, deleteProject } = require('../controllers/projectController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/getProject', getProject);
router.get('/getProjectId', verifyAdmin, getProjectId);
router.post('/newProject', verifyAdmin, newProject);
router.put('/previousEdit/:projId', verifyAdmin, previousEdit);
router.delete('/deleteProject/:projId', verifyAdmin, deleteProject);

module.exports = router;
