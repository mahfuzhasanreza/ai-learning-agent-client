async function runChat(prompt, threadId = null, agentName = null) {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
        const requestBody = {
            query: prompt
        };

        // Only include thread_id if it exists (not the first message)
        if (threadId) {
            requestBody.thread_id = threadId;
        }

        // Only include agent_name if user has selected one
        if (agentName) {
            requestBody.agent_name = agentName;
        }

        // Get auth token from localStorage
        const token = localStorage.getItem('authToken');
        
        // Print auth token for debugging
        console.log('🔑 Auth Token:', token ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}` : 'No token found');
        
        const headers = {
            "Content-Type": "application/json",
        };

        // Add Authorization header if token exists
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Print request details for debugging
        console.log('📤 API Request:', {
            url: apiUrl,
            method: 'POST',
            body: requestBody,
            hasToken: !!token
        });

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            // If unauthorized, redirect to login
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Unauthorized - Please login again');
            }
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Print response data for debugging
        console.log('📥 API Response:', {
            response: data.response ? `${data.response.substring(0, 100)}...` : data.response,
            thread_id: data.thread_id,
            course: data.course,
            full_response_length: data.response ? data.response.length : 0
        });

        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Re-throw to handle in the calling function
    }
}

export default runChat;