// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated rate limiting service

const rateLimitStore = new Map();

// Configuration
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 2; // Max 2 requests per minute per IP (conservative for free tier)

function rateLimiter(req, res, next) {
    const identifier = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Get or create rate limit data for this identifier
    if (!rateLimitStore.has(identifier)) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + WINDOW_MS
        });
        return next();
    }
    
    const limitData = rateLimitStore.get(identifier);
    
    // Reset if window has passed
    if (now > limitData.resetTime) {
        limitData.count = 1;
        limitData.resetTime = now + WINDOW_MS;
        return next();
    }
    
    // Check if limit exceeded
    if (limitData.count >= MAX_REQUESTS) {
        const resetIn = Math.ceil((limitData.resetTime - now) / 1000);
        return res.status(429).json({
            error: "Too Many Requests",
            message: `Rate limit exceeded. Maximum ${MAX_REQUESTS} requests per minute allowed.`,
            retryAfter: resetIn
        });
    }
    
    // Increment counter
    limitData.count++;
    next();
}

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime + WINDOW_MS) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

module.exports = rateLimiter;
