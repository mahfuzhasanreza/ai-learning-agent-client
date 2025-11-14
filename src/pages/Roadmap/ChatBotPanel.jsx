import { useEffect, useRef, useState, useCallback } from "react";
import { UserAuth } from "../../context/AuthContext";

const ChatBotPanel = ({ topic, threadId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { getToken } = UserAuth();
    const hasInitialized = useRef(false);
    const currentTopic = useRef(null);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(scrollToBottom, [messages]);

    const sendMessage = useCallback(async (text, isInitial = false) => {
      if (!text.trim()) return;
      if (!threadId) {
        setMessages(prev => [...prev, { sender: "bot", text: "Error: No thread ID available. Please generate a roadmap first." }]);
        return;
      }
  
      // Add user's message only if not initial (initial is already added)
      if (!isInitial) {
        setMessages(prev => [...prev, { sender: "user", text }]);
      }
      setInput("");
      setLoading(true);
  
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const token = getToken();
        
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${baseUrl}/api/v1/roadmap/chat`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ 
            thread_id: threadId,
            question: text.trim()
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentEvent = null;
        let botResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            
            if (line.startsWith('event: ')) {
              currentEvent = line.slice(7).trim();
              continue;
            }
            
            if (line.startsWith('data: ')) {
              try {
                let jsonString = line.slice(6).trim();
                
                if (!jsonString) continue;
                if (jsonString.startsWith('event:')) continue;
                if (jsonString.startsWith('data: ')) {
                  jsonString = jsonString.slice(6).trim();
                }
                
                const jsonData = JSON.parse(jsonString);
                
                if (currentEvent === 'explanation' && jsonData.content) {
                  botResponse = jsonData.content;
                }
                
                currentEvent = null;
              } catch (e) {
                console.error('Error parsing SSE data:', e, 'Line:', line);
              }
            }
          }
        }

        if (botResponse) {
          setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
        } else {
          setMessages(prev => [...prev, { sender: "bot", text: "No response received from the AI." }]);
        }
      } catch (err) {
        console.error('Chatbot API error:', err);
        setMessages(prev => [...prev, { sender: "bot", text: "Error: Could not get response from the AI. Please try again." }]);
      } finally {
        setLoading(false);
      }
    }, [threadId, getToken]);

    // Auto-send initial question when topic changes
    useEffect(() => {
      console.log('ChatBotPanel useEffect triggered:', { topic, threadId, hasInit: hasInitialized.current, currentTopic: currentTopic.current });
      
      // Check if topic has changed or it's a new initialization
      if (topic && threadId) {
        // If topic changed, reset initialization
        if (currentTopic.current !== topic) {
          hasInitialized.current = false;
          currentTopic.current = topic;
        }
        
        // Send initial message if not already sent for this topic
        if (!hasInitialized.current) {
          hasInitialized.current = true;
          const initialQuestion = `Please explain: ${topic}`;
          console.log('Auto-sending initial question:', initialQuestion);
          console.log('Thread ID:', threadId);
          setMessages([{ sender: "user", text: initialQuestion }]);
          sendMessage(initialQuestion, true);
        }
      }
    }, [topic, threadId, sendMessage]);
  
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        sendMessage(input);
      }
    };
  
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4 p-2 border rounded bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-1 rounded ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
  
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={threadId ? "Type your message..." : "Generate a roadmap first..."}
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            disabled={!threadId || loading}
          />
          <button
            onClick={() => sendMessage(input)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!threadId || loading}
          >
            Send
          </button>
        </div>
  
        {loading && <p className="text-xs text-gray-500 mt-1">AI is typing...</p>}
        {!threadId && <p className="text-xs text-red-500 mt-1">Please generate a roadmap to start chatting.</p>}
      </div>
    );
  };

  export default ChatBotPanel;