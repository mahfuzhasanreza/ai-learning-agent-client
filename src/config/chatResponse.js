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

        // Extract questions from retrieved_documents in metadata
        const retrievedDocuments = data.metadata?.retrieved_documents || [];
        const questions = retrievedDocuments.map(doc => ({
            id: doc.id,
            question_number: doc.metadata?.question_number,
            sub_question: doc.metadata?.sub_question,
            course_code: doc.metadata?.course_code,
            exam_type: doc.metadata?.exam_type,
            course_title: doc.metadata?.course_title,
            question_text: doc.metadata?.question,
            has_image: doc.metadata?.has_image,
            image_url: doc.metadata?.image_url,
            has_description: doc.metadata?.has_description,
            description_content: doc.metadata?.description_content,
            marks: doc.metadata?.marks,
            semester_term: doc.metadata?.semester_term,
            pdf_url: doc.metadata?.pdf_url,
            score: doc.score,
        }));

        // Normalize the response to match the format expected by Context.jsx
        const normalizedData = {
            response: actualResponse,
            thread_id: extractedThreadId,
            course: extractedAgentName,
            agent_name: extractedAgentName,
            questions: questions,
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