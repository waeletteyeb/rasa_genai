// ============================================================================
// AUTH ROUTES - Authentification
// ============================================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateBody } = require('../middlewares/validation.middleware');
const { loginSchema, registerSchema } = require('../validators/auth.validator');

router.post('/login', validateBody(loginSchema), authController.login);
router.post('/register', validateBody(registerSchema), authController.register);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
