module.exports = async function handler(req, res) {
    // Allow POST requests only
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");

        return res.status(405).json({
            error: "Method not allowed."
        });
    }

    // Read the API key from Vercel's environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "AI service is not configured."
        });
    }

    try {
        const { messages } = req.body || {};

        // Validate incoming messages
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: "Please provide a message."
            });
        }

        // Limit conversation size
        if (messages.length > 20) {
            return res.status(400).json({
                error: "Conversation limit reached. Start a new chat."
            });
        }

        const contents = [];

        for (const message of messages) {
            if (
                !message ||
                !["user", "assistant"].includes(message.role) ||
                typeof message.content !== "string" ||
                !message.content.trim()
            ) {
                return res.status(400).json({
                    error: "Invalid message format."
                });
            }

            if (message.content.length > 10000) {
                return res.status(400).json({
                    error: "A message is too long."
                });
            }

            contents.push({
                role: message.role === "assistant" ? "model" : "user",
                parts: [{ text: message.content }]
            });
        }

        // Gemini requires the conversation to start with a user message.
        if (contents[0].role !== "user") {
            return res.status(400).json({
                error: "Conversation must start with a user message."
            });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{
                            text: [
                                "You are MKRON AI, the AI assistant developed for MK LABS.",
                                "Be helpful, clear, accurate, and conversational.",
                                "Help users with programming, technology, learning,",
                                "creative ideas, and everyday questions.",
                                "Never claim to have performed an action you did not perform.",
                                "If you are unsure of an answer, say so honestly."
                            ].join(" ")
                        }]
                    },
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
    console.error(
        "Gemini API error:",
        "HTTP", response.status,
        data.error?.status || "UNKNOWN",
        data.error?.message || "No error message returned"
    );

    return res.status(502).json({
        error: "MKRON AI could not generate a response. Please try again."
    });
}

        const answer = data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

        if (!answer) {
            return res.status(502).json({
                error: "MKRON AI returned an empty response. Please try again."
            });
        }

        return res.status(200).json({
            reply: answer
        });

    } catch (error) {
        console.error("MKRON AI backend error:", error.message);

        return res.status(500).json({
            error: "An unexpected error occurred. Please try again."
        });
    }
};