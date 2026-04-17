const express = require('express');
const { signup, login, getMe, updateBudget } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/budget', auth, updateBudget);

module.exports = router;
