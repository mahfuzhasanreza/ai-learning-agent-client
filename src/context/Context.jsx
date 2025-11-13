import { createContext, useState, useEffect } from "react";
import runChat from "../config/chatResponse";
import Markdown from "react-markdown";
// import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ApiService from "../services/apiService";

export const Context = createContext();

const ContextProvider = (props) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [ttsSettingsOpen, setTtsSettingsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [newChatPrompts, setNewChatPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [conversation, setConversation] = useState([]);
    const [activeChat, setActiveChat] = useState("");
    const [courseData, setCourseData] = useState("");
    const [threadId, setThreadId] = useState(null); // Thread ID for chat session
    const [selectedAgent, setSelectedAgent] = useState(null); // Selected agent name
    const [questions, setQuestions] = useState([]); // Questions array from API
    
    // Dark Mode State
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    // Dark Mode Effect
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        
        if (isDark) {
            html.classList.add("dark");
            body.classList.add("dark");
            localStorage.setItem('darkMode', 'true');
        } else {
            html.classList.remove("dark");
            body.classList.remove("dark");
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDark]);

    const toggleDarkMode = () => {
        setIsDark(prev => !prev);
    };

    // const delayPara = (index, nextWord) => {
    //     setTimeout(function () {
    //         setResultData(prev => prev + nextWord);
    //     }, 40 * index)
    // }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setActiveChat("");
        setThreadId(null); // Reset thread ID for new chat
        setConversation([]); // Clear conversation
        setQuestions([]); // Clear questions
    }

    const loadChatHistory = async (threadId) => {
        try {
            setLoading(true);
            setShowResult(true);
            
            const data = await ApiService.getChatByThreadId(threadId);
            
            if (!data || !data.messages) {
                throw new Error("No messages found");
            }

            // Set the thread ID
            setThreadId(data.thread_id);
            
            // Clear existing conversation
            setConversation([]);
            
            // Process messages and build conversation
            const processedConversation = [];
            
            data.messages.forEach((message) => {
                if (message.type === 'human') {
                    // Store the user input
                    const userInput = message.content;
                    
                    // Find the corresponding AI response (next message)
                    const aiMessageIndex = data.messages.indexOf(message) + 1;
                    if (aiMessageIndex < data.messages.length) {
                        const aiMessage = data.messages[aiMessageIndex];
                        
                        if (aiMessage.type === 'ai') {
                            // Format the AI response with Markdown
                            const formattedResponse = <Markdown
                                children={aiMessage.content}
                                components={{
                                    code(props) {
                                        const { children, className, ...rest } = props
                                        const match = /language-(\w+)/.exec(className || '')
                                        return match ? (
                                            <SyntaxHighlighter
                                                {...rest}
                                                PreTag="div"
                                                children={String(children).replace(/\n$/, '')}
                                                language={match[1]}
                                                style={dark}
                                            />
                                        ) : (
                                            <code {...rest} className={className}>
                                                {children}
                                            </code>
                                        )
                                    }
                                }}
                            />;
                            
                            // Add to conversation
                            processedConversation.push({
                                chat: userInput,
                                input: userInput,
                                response: formattedResponse
                            });
                            
                            // Set agent name if available
                            if (aiMessage.agent_name) {
                                setSelectedAgent(aiMessage.agent_name);
                            }
                        }
                    }
                }
            });
            
            setConversation(processedConversation);
            
            // Set the most recent prompt
            if (processedConversation.length > 0) {
                const lastConversation = processedConversation[processedConversation.length - 1];
                setRecentPrompt(lastConversation.input);
                setActiveChat(lastConversation.chat);
                setResultData(lastConversation.response);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Error loading chat history:", error);
            setLoading(false);
            setResultData(
                <div className="text-red-500">
                    <p>Error: Failed to load chat history. Please try again.</p>
                </div>
            );
        }
    }

    const onSent = async (prompt) => {
        setCourseData("");
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let data;
        let response;
        let currentPrompt;
        
        try {
            if (prompt !== undefined) {
                currentPrompt = prompt;
                setInput(prompt);

                // Pass threadId and selectedAgent to runChat
                data = await runChat(prompt, threadId, selectedAgent);
                
                if (!data) {
                    throw new Error("No response from server");
                }
                
                response = data.response;
                setCourseData(data.course || data.agent_name || "");
                
                // Set questions if available
                if (data.raw?.questions && Array.isArray(data.raw.questions) && data.raw.questions.length > 0) {
                    setQuestions(data.raw.questions);
                } else {
                    setQuestions([]);
                }
                
                // Set thread_id from response if it's the first message
                if (!threadId && data.thread_id) {
                    setThreadId(data.thread_id);
                }
                
                setRecentPrompt(prompt);
            } else {
                currentPrompt = input;
                
                // Pass threadId and selectedAgent to runChat
                data = await runChat(input, threadId, selectedAgent);
                
                if (!data) {
                    throw new Error("No response from server");
                }
                
                response = data.response;
                setCourseData(data.course || data.agent_name || "");
                
                // Set questions if available
                if (data.raw?.questions && Array.isArray(data.raw.questions) && data.raw.questions.length > 0) {
                    setQuestions(data.raw.questions);
                } else {
                    setQuestions([]);
                }
                
                // Set thread_id from response if it's the first message
                if (!threadId && data.thread_id) {
                    setThreadId(data.thread_id);
                }
                
                setRecentPrompt(input);
            }

            // Create formatted response with Markdown
            let newResponse4 = <Markdown
                children={response}
                components={{
                    code(props) {
                        const { children, className, ...rest } = props
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                            <SyntaxHighlighter
                                {...rest}
                                PreTag="div"
                                children={String(children).replace(/\n$/, '')}
                                language={match[1]}
                                style={dark}
                            />
                        ) : (
                            <code {...rest} className={className}>
                                {children}
                            </code>
                        )
                    }
                }}
            />;

            // Add to conversation after response is formatted
            if (!loading && !showResult) {
                setNewChatPrompts(prev => 
                    prev.includes(currentPrompt) ? prev : [...prev, currentPrompt]
                );
                setActiveChat(currentPrompt);
                
                setConversation(prev => [...prev, { chat: currentPrompt, input: currentPrompt, response: newResponse4 }]);
            } else {
                setConversation((prev) => [...prev, { chat: activeChat, input: currentPrompt, response: newResponse4 }]);
            }

            setResultData(newResponse4);
            setLoading(false);
            setInput("");
        } catch (error) {
            console.error("Error in onSent:", error);
            setLoading(false);
            // Set error message in result
            setResultData(
                <div className="text-red-500">
                    <p>Error: {error.message || "Failed to send message. Please try again."}</p>
                    {error.message?.includes('Unauthorized') && (
                        <p className="mt-2">Please log in again to continue.</p>
                    )}
                </div>
            );
        }
    }

    const contextValue = {
        newChatPrompts,
        setNewChatPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        loadChatHistory,
        conversation,
        activeChat,
        setActiveChat,
        courseData,
        threadId,
        setThreadId,
        selectedAgent,
        setSelectedAgent,
        questions,
        setQuestions,
        // Dark Mode values
        isDark,
        setIsDark,
        toggleDarkMode,
        ttsSettingsOpen,
        setTtsSettingsOpen,
        isSidebarOpen,
        setIsSidebarOpen,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;