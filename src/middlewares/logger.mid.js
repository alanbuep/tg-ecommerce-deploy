import { devLogger, prodLogger } from '../services/logger/logger.config.js';
import dotenv from 'dotenv';

dotenv.config();

const MODE = process.env.MODE || 'DEV';

export const addLogger = (req, res, next) => {
    req.logger = MODE.toUpperCase() === 'DEV' ? devLogger : prodLogger;
    next();
};