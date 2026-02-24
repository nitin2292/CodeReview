const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {

    const code = req.body.code;

    if (!code) {
        return res.status(400).json({ 
            error: "Code is required",
            message: "Please provide code to review" 
        });
    }

    try {
        const response = await aiService(code);
        res.json({ review: response });
    } catch (error) {
        console.error("Error in getReview controller:", error);
        
        // Handle quota exhausted errors
        if (error.message === 'QUOTA_EXHAUSTED' || error.status === 429) {
            return res.status(429).json({
                error: "Rate Limit Exceeded",
                message: "The AI service has reached its quota limit. Please try again later.",
                details: error.details || "Google Gemini API quota exhausted",
                retryAfter: error.retryAfter || 60
            });
        }
        
        // Handle other errors
        res.status(500).json({
            error: "Internal Server Error",
            message: "An error occurred while processing your request",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

}

// exports.getResponse = async (req, res) => {
//   try {
//     const { code } = req.body;   // <-- req.body must exist here
//     console.log("Received code:", code);

//     // Call AI service (mock for now)
//     const response = { review: "This is a mock review for your code." };

//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
