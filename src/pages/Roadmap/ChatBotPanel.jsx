import { useEffect, useRef, useState, useCallback } from "react";
import { UserAuth } from "../../context/AuthContext";
import CodeBlock from "../../components/CodeBlock/CodeBlock";

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
        
        console.log('=== Sending Chat Request ===');
        console.log('Base URL:', baseUrl);
        console.log('Thread ID:', threadId);
        console.log('Question:', text);
        
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log('Auth token present:', token.substring(0, 20) + '...');
        }
        
        const requestBody = { 
          thread_id: threadId,
          question: text.trim()
        };
        console.log('Request body:', requestBody);
        
        const response = await fetch(`${baseUrl}/api/v1/roadmap/chat`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentEvent = null;
        let botResponse = '';
        let fullResponseLog = [];

        console.log('=== Starting SSE Response Stream ===');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            // Log every line received
            console.log('SSE Line:', line);
            fullResponseLog.push(line);
            
            if (!line.trim()) continue;
            
            // Handle standard SSE event format
            if (line.startsWith('event: ')) {
              currentEvent = line.slice(7).trim();
              console.log('Event type (standard):', currentEvent);
              continue;
            }
            
            // Handle data lines
            if (line.startsWith('data: ')) {
              try {
                let jsonString = line.slice(6).trim();
                console.log('Raw data string:', jsonString);
                
                if (!jsonString) {
                  console.log('Empty data, skipping');
                  continue;
                }
                
                // Check if this is actually an event declaration inside data
                if (jsonString.startsWith('event: ')) {
                  currentEvent = jsonString.slice(7).trim();
                  console.log('Event type (non-standard):', currentEvent);
                  continue;
                }
                
                // Handle duplicate "data: " prefix
                if (jsonString.startsWith('data: ')) {
                  console.log('Found duplicate "data:" prefix, stripping it');
                  jsonString = jsonString.slice(6).trim();
                  console.log('After stripping:', jsonString);
                }
                
                // Try to parse as JSON
                let jsonData;
                try {
                  jsonData = JSON.parse(jsonString);
                  console.log('Parsed JSON:', jsonData);
                } catch (e) {
                  console.warn('Not JSON, treating as plain text:', jsonString);
                  // If not JSON, treat as plain text (might be thread_id)
                  jsonData = { raw: jsonString };
                }
                
                // Process based on current event type
                if (currentEvent === 'explanation') {
                  if (jsonData.content) {
                    console.log('Got explanation content, length:', jsonData.content.length);
                    botResponse = jsonData.content;
                  }
                } else if (currentEvent === 'thread_id') {
                  console.log('Got thread_id:', jsonData);
                }
                
                // Don't reset currentEvent here - keep it for next data line
              } catch (e) {
                console.error('Error parsing SSE data:', e, 'Line:', line);
              }
            }
          }
        }

        console.log('=== Full SSE Response Log ===');
        console.log(fullResponseLog.join('\n'));
        console.log('=== End SSE Response ===');
        console.log('Final bot response length:', botResponse.length);

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
  
    // Format bot message with markdown-like rendering
    const formatBotMessage = (text) => {
      const lines = text.split('\n');
      const elements = [];
      let inCodeBlock = false;
      let codeLines = [];
      let codeLanguage = 'javascript'; // default language
      let inList = false;
      
      lines.forEach((line, idx) => {
        // Handle code blocks
        if (line.startsWith('```')) {
          if (inCodeBlock) {
            // End code block - use CodeBlock component
            elements.push(
              <CodeBlock key={idx} language={codeLanguage}>
                {codeLines.join('\n')}
              </CodeBlock>
            );
            codeLines = [];
            inCodeBlock = false;
            codeLanguage = 'javascript';
          } else {
            // Start code block
            inCodeBlock = true;
            // Extract language if specified (e.g., ```c or ```javascript)
            const langMatch = line.match(/```(\w+)/);
            if (langMatch) {
              codeLanguage = langMatch[1];
            }
          }
          return;
        }
        
        if (inCodeBlock) {
          codeLines.push(line);
          return;
        }
        
        // Handle headers
        if (line.startsWith('### ')) {
          elements.push(<h3 key={idx} className="text-base font-bold mt-3 mb-2 text-[#FF4B00]">{line.replace('### ', '')}</h3>);
        } else if (line.startsWith('#### ')) {
          elements.push(<h4 key={idx} className="text-sm font-semibold mt-2 mb-1 text-[#a200ff]">{line.replace('#### ', '')}</h4>);
        }
        // Handle bullet points
        else if (line.trim().startsWith('- ')) {
          if (!inList) {
            inList = true;
          }
          elements.push(<li key={idx} className="ml-4 mb-1 text-gray-300">{renderInlineFormatting(line.replace(/^-\s*/, ''))}</li>);
        }
        // Handle numbered lists
        else if (/^\d+\.\s/.test(line.trim())) {
          elements.push(<li key={idx} className="ml-4 mb-1 text-gray-300">{renderInlineFormatting(line.replace(/^\d+\.\s*/, ''))}</li>);
        }
        // Regular paragraph
        else if (line.trim()) {
          if (inList && !line.startsWith('- ')) {
            inList = false;
          }
          elements.push(<p key={idx} className="mb-2 leading-relaxed text-gray-300">{renderInlineFormatting(line)}</p>);
        } else {
          elements.push(<br key={idx} />);
        }
      });
      
      return elements;
    };
    
    // Render inline formatting (bold, code, etc.)
    const renderInlineFormatting = (text) => {
      const parts = [];
      let currentText = text;
      let key = 0;
      
      // Handle bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(currentText)) !== null) {
        if (match.index > lastIndex) {
          parts.push(currentText.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`bold-${key++}`}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < currentText.length) {
        parts.push(currentText.substring(lastIndex));
      }
      
      // Handle inline code `text`
      return parts.map((part, idx) => {
        if (typeof part === 'string') {
          const codeParts = part.split('`');
          return codeParts.map((codePart, codeIdx) => 
            codeIdx % 2 === 1 
              ? <code key={`code-${idx}-${codeIdx}`} className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-xs text-[#FF4B00] font-mono border border-gray-700">{codePart}</code>
              : codePart
          );
        }
        return part;
      });
    };
  
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        sendMessage(input);
      }
    };
  
    return (
      <div className="flex flex-col h-full bg-[#1a1a1a] rounded-lg">
        <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-700 rounded-lg bg-[#0f0f0f]">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-lg ${
                msg.sender === "user" 
                  ? "bg-gradient-to-r from-[#FF4B00] to-[#ff6b2d] text-white shadow-lg" 
                  : "bg-[#1e1e1e] border border-gray-700 text-gray-100 shadow-md"
              }`}>
                {msg.sender === "bot" ? (
                  <div className="prose prose-sm max-w-none text-sm prose-invert">
                    {formatBotMessage(msg.text)}
                  </div>
                ) : (
                  <span className="text-sm">{msg.text}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
  
        <div className="flex gap-2 px-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={threadId ? "Type your message..." : "Generate a roadmap first..."}
            className="flex-1 px-4 py-3 bg-[#1e1e1e] border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a200ff] focus:border-transparent placeholder-gray-500 transition-all"
            disabled={!threadId || loading}
          />
          <button
            onClick={() => sendMessage(input)}
            className="px-2 py-2 bg-gradient-to-r from-[#a200ff] to-[#c240ff] text-white rounded-lg font-medium hover:from-[#b520ff] hover:to-[#d050ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#a200ff]/50"
            disabled={!threadId || loading}
          >
            Send
          </button>
        </div>
  
        {loading && <p className="text-xs text-[#a200ff] mt-2 px-2 animate-pulse">AI is typing...</p>}
        {!threadId && <p className="text-xs text-[#FF4B00] mt-2 px-2">Please generate a roadmap to start chatting.</p>}
      </div>
    );
  };

  export default ChatBotPanel;