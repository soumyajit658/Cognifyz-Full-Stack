const axios = require("axios");

async function getRandomAdvice() {

    try {

        const response = await axios.get(
            "https://api.adviceslip.com/advice",
            {
                timeout: 5000
            }
        );

        return {
            success: true,
            advice: response.data.slip.advice
        };

    } catch (error) {

        console.error(
            "External API Error:",
            error.message
        );

        return {
            success: false,
            advice: "Unable to fetch advice at the moment."
        };
    }
}

module.exports = {
    getRandomAdvice
};