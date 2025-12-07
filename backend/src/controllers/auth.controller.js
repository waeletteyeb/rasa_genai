// ============================================================================
// AUTH CONTROLLER
// ============================================================================

const authService = require('../services/auth.service');
const logger = require('../config/logger');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

module.exports = { login, register, refreshToken, logout };
