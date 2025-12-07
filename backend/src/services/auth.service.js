// ============================================================================
// AUTH SERVICE
// ============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'sofrecom-secret-key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    logger.info(`User logged in: ${email}`);

    return {
        token,
        user: { id: user._id, email: user.email, name: user.name, role: user.role }
    };
};

const register = async (userData) => {
    const { email, password, name } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword, name, role: 'admin' });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    logger.info(`User registered: ${email}`);

    return {
        token,
        user: { id: user._id, email: user.email, name: user.name, role: user.role }
    };
};

const refreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
        const newToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        return { token: newToken };
    } catch (error) {
        const err = new Error('Invalid token');
        err.statusCode = 401;
        throw err;
    }
};

module.exports = { login, register, refreshToken };
