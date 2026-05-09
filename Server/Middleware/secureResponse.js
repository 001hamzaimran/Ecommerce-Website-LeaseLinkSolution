/**
 * Secure Response Middleware
 * Obfuscates the JSON payload to prevent casual inspection in the browser
 */
export const secureResponse = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
        // Only obfuscate success responses for API routes
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const jsonString = JSON.stringify(data);
            // Simple Base64 masking - can be upgraded to AES if needed
            const maskedData = Buffer.from(jsonString).toString('base64');
            
            return originalJson.call(this, { 
                _s: true, // Secure flag
                _d: maskedData // Masked data
            });
        }
        
        return originalJson.call(this, data);
    };

    next();
};
