async function runChat(prompt) {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: prompt }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data.response;
    } catch (error) {
        console.error("Error:", error);
    }
}

export default runChat;