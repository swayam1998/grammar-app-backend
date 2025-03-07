const axios = require('axios');

const checkGrammar = async (req, res) => {
    try {
        const { text } = req.body;

        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a grammar checking assistant. Find grammatical errors and misspelled words in the provided text."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "report_grammar_errors",
                            description: "Report grammatical errors and misspelled words found in the text",
                            parameters: {
                                type: "object",
                                properties: {
                                    errors: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                word: {
                                                    type: "string",
                                                    description: "The incorrect or misspelled word"
                                                },
                                                position: {
                                                    type: "integer",
                                                    description: "The character position of the error in the text"
                                                },
                                                suggestion: {
                                                    type: "string",
                                                    description: "The suggested correction for the error"
                                                }
                                            },
                                            required: ["word", "position", "suggestion"]
                                        }
                                    }
                                },
                                required: ["errors"]
                            }
                        }
                    }
                ],
                tool_choice: {
                    type: "function",
                    function: { name: "report_grammar_errors" }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        let errors = [];

        try {
            // Process the tool call response
            const toolCalls = openaiResponse.data.choices[0].message.tool_calls;

            if (toolCalls && toolCalls.length > 0) {
                // Extract the function arguments
                const functionArguments = JSON.parse(toolCalls[0].function.arguments);
                errors = functionArguments.errors || [];
            }

            // Log the discovered errors for debugging
            console.log('Grammar errors found:', errors);

        } catch (parseError) {
            console.error('Error parsing OpenAI tool call response:', parseError);
            errors = [];
        }

        return res.json({ success: true, errors });

    } catch (error) {
        console.error('Error checking grammar:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking grammar',
            error: error.message
        });
    }
};

module.exports = { checkGrammar };