/**
 * Security Middleware for LeaseLink Solution
 * Implements manual security headers and basic rate limiting
 */

const requestCounts = new Map();
const RATE_LIMIT = 100; // max requests
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const securityMiddleware = (req, res, next) => {
    // 1. Basic Rate Limiting
    const ip = req.ip;
    const now = Date.now();
    const userData = requestCounts.get(ip) || { count: 0, startTime: now };

    if (now - userData.startTime > WINDOW_MS) {
        userData.count = 1;
        userData.startTime = now;
    } else {
        userData.count++;
    }

    requestCounts.set(ip, userData);

    if (userData.count > RATE_LIMIT) {
        return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    // 2. Security Headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none';");

    // 3. API Integrity Check (Client Secret)
    // We expect a specific header from our frontend
    const clientSecret = req.headers['x-app-integrity'];
    const expectedSecret = process.env.API_INTEGRITY_SECRET || 'leaselink_secure_2026';

    // Protect destructive methods
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        if (clientSecret !== expectedSecret) {
            return res.status(403).json({ message: "Unauthorized request origin." });
        }
    }

    next();
};
