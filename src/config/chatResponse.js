import ApiService from '../services/apiService';

async function runChat(prompt, threadId = null, agentName = null) {
    try {
        // Print request details for debugging
        console.log('📤 API Request:', {
            url: '/chat/message',
            method: 'POST',
            message: prompt,
            thread_id: threadId,
        });

        const data = await ApiService.sendChatMessage(prompt, threadId, {});

        // Print full API response for debugging
        console.log('📥 Full API Response:', data);

        // Extract fields from the new response structure
        // Response: { content, agent_name, thread_id, metadata }
        const actualResponse = data.content;
        const extractedThreadId = data.thread_id;
        const extractedAgentName = data.agent_name;

        // Normalize the response to match the format expected by Context.jsx
        const normalizedData = {
            response: actualResponse,
            thread_id: extractedThreadId,
            course: extractedAgentName,
            agent_name: extractedAgentName,
            metadata: data.metadata,
            raw: data // Keep the original response for reference
        };

        // Print normalized response data for debugging
        console.log('📥 Normalized Response:', {
            response: actualResponse ? `${actualResponse.substring(0, 100)}...` : actualResponse,
            thread_id: extractedThreadId,
            agent_name: extractedAgentName,
            full_response_length: actualResponse ? actualResponse.length : 0
        });

        return normalizedData;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw to handle in the calling function
    }
}

export default runChat;