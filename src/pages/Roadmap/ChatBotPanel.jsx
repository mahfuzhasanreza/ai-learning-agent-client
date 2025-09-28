import { useEffect, useRef, useState } from "react";

const ChatBotPanel = ({ topic }) => {
    const [messages, setMessages] = useState([
      { sender: "user", text: `Please provide insights on: ${topic}` }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(scrollToBottom, [messages]);
  
    const sendMessage = async (text) => {
      if (!text.trim()) return;
  
      // Add user's message
      setMessages(prev => [...prev, { sender: "user", text }]);
      setInput("");
      setLoading(true);
  
      // Call your chatbot API (replace this with real API)
      try {
        const response = await mockChatAPI(text); // Example function
        setMessages(prev => [...prev, { sender: "bot", text: response }]);
      } catch (err) {
        setMessages(prev => [...prev, { sender: "bot", text: "Error: could not get response." }]);
      } finally {
        setLoading(false);
      }
    };
  
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
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={() => sendMessage(input)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
  
        {loading && <p className="text-xs text-gray-500 mt-1">AI is typing...</p>}
      </div>
    );
  };
  
  // Mock API example (replace with real API call)
  const mockChatAPI = async (message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a mock response for: "${message}"`);
      }, 1000);
    });
  };
  

  export default ChatBotPanel;