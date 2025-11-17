import React, { useContext, useEffect, useState, useRef } from 'react';
import './Chat.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { IoMdMicOff } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { ChevronUp, ChevronDown } from "lucide-react";
import ListenButton from '../ListenButton/ListenButton';
import TTSSettings from '../TTSSettings/TTSSettings';
import Navigation from '../LandingPage/components/Navigation';
import ChatSidebar from './ChatSidebar';
import ApiService from '../../services/apiService';
import { UserAuth } from '../../context/AuthContext';

const Chat = () => {
    const {user} = UserAuth();
    const { isSidebarOpen, setIsSidebarOpen, ttsSettingsOpen, setTtsSettingsOpen, recentPrompt, onSent, loading, showResult, resultData, setInput, input, lastSentPrompt, conversation, activeChat, courseData, selectedAgent, setSelectedAgent, isTyping } = useContext(Context);
    const [extended, setExtended] = useState(false);
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);
    const [agents, setAgents] = useState([]);
    const [loadingAgents, setLoadingAgents] = useState(false);
    const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(true); // State for questions dropdown
    const resultEndRef = useRef(null);

    const agentMap = { "Professor DBMS": "dbms_agent", "Professor General": "fallback_agent", "Professor OOP": "oop_agent", "System Design Specialist": "sad_agent", "Professor SE": "se_agent", "Professor SPL": "spl_agent" };

    function convertDisplayNameToName(displayName) { return agentMap[displayName] || null; }

    // Fetch agents from API
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoadingAgents(true);
                const response = await ApiService.getAgents();

                console.log('=== PROCESSING AGENTS ===');
                console.log('Full API Response:', response);
                console.log('Agents Data:', response.data);
                console.log('Metadata:', response.metadata);

                // Process the agents from the data object
                if (response.data && typeof response.data === 'object') {
                    const formattedAgents = Object.entries(response.data)
                        .filter(([, agent]) => agent.is_active) // Only active agents
                        .map(([, agent]) => {
                            // Remove "Professor" and add "Agent" suffix
                            let displayName = agent.display_name.replace(/^Professor\s+/i, '');
                            displayName = `${displayName} Agent`;

                            return {
                                id: agent.name,
                                name: displayName,
                                description: agent.description,
                                agentId: agent.id
                            };
                        });

                    console.log('Formatted Agents:', formattedAgents);
                    console.log('Total Active Agents:', formattedAgents.length);
                    setAgents(formattedAgents);
                } else {
                    console.log('Unexpected data format:', response);
                    setAgents([]);
                }

                setLoadingAgents(false);
            } catch (error) {
                console.error('Failed to fetch agents:', error);
                setLoadingAgents(false);
                // Fallback to default agents if API fails
                setAgents([
                    { id: 'dbms_agent', name: 'DBMS Agent', description: 'Database Management Expert' },
                    { id: 'python_agent', name: 'Python Agent', description: 'Python Programming Expert' },
                    { id: 'java_agent', name: 'Java Agent', description: 'Java Programming Expert' },
                    { id: 'web_agent', name: 'Web Development Agent', description: 'Web Development Expert' },
                    { id: 'ml_agent', name: 'ML Agent', description: 'Machine Learning Expert' },
                ]);
            }
        };

        fetchAgents();
    }, []);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (listening && transcript) {
            setInput(transcript);
        }
    }, [transcript, listening, setInput]);

    // Auto-scroll to bottom when conversation or loading changes
    useEffect(() => {
        if (resultEndRef.current) {
            resultEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation, loading]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showAgentDropdown && !event.target.closest('.agent-dropdown-container')) {
                setShowAgentDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAgentDropdown]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        // <div className='main'>

        <div className={`main pt-25 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
            {/* Sidebar */}
            <ChatSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}

            />


            <Navigation></Navigation>


            <div className="main-container">
                {!showResult
                    ? <>
                        <div className="greet">
                            <p className="greeting-line-1">
                                <span className="greeting-highlight">Hello, {user.email.split("@")[0].replace(/\d+$/, "")}.</span>
                            </p>
                            <p className="greeting-line-2">How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div onClick={() => onSent("What is C Programming?")} className="card">
                                <div className="card-content">
                                    <p>What is C Programming?</p>
                                    <div className="card-icon">
                                        <img src={assets.compass_icon} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => onSent("Can you provide me any previous trimester question of Structured Programming Language?")} className="card">
                                <div className="card-content">
                                    <p>Can you provide me any previous trimester question of Structured Programming Language?</p>
                                    <div className="card-icon">
                                        <img src={assets.bulb_icon} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => onSent("Give me the details about C Programming including functions, structures, pointers etc")} className="card">
                                <div className="card-content">
                                    <p>Give me the details about C Programming including functions, structures, pointers etc</p>
                                    <div className="card-icon">
                                        <img src={assets.message_icon} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => onSent("As a beginner how can I learn programming? Which language should I learn first?")} className="card">
                                <div className="card-content">
                                    <p>As a beginner how can I learn programming? Which language should I learn first?</p>
                                    <div className="card-icon">
                                        <img src={assets.code_icon} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : <div className='result'>
                        {conversation.map((item, index) => {

                            if (item.courseData && item.courseData != "Professor General" && !selectedAgent) { setSelectedAgent(convertDisplayNameToName(item.courseData)); }

                            return (
                                <div key={index}>
                                    <div className="result-title">
                                        <img src={assets.user_icon} alt="" />
                                        <div className="message-content">
                                            <p>{item.input}</p>
                                            <ListenButton
                                                text={item.input}
                                                size="small"
                                                className="message-listen-btn"
                                            />
                                        </div>
                                    </div>
                                    <div className="result-data">
                                        <img src={assets.logo} alt="" />
                                        <div className="message-content flex justify-between">
                                            <div className='flex flex-col'>
                                                {/* Show agent name for each message */}
                                                {(item.agentName || item.courseData) && (
                                                    <p className='w-fit px-5 py-1 font-bold bg-orange-500 text-2xl border-0 rounded-lg text-white align-center items-center content-center justify-center hover:bg-orange-700'>
                                                        {item.agentName || item.courseData}
                                                    </p>
                                                )}
                                                {/* Fallback to global courseData if not in item */}
                                                {!item.agentName && !item.courseData && courseData && (
                                                    <p className='w-fit px-5 py-1 font-bold bg-orange-500 text-2xl border-0 rounded-lg text-white align-center items-center content-center justify-center hover:bg-orange-700'>
                                                        {courseData}
                                                    </p>
                                                )}
                                                <br />
                                                <p>
                                                    {item.response}
                                                    {/* Show typing cursor on the last message if typing */}
                                                    {isTyping && index === conversation.length - 1 && (
                                                        <span className="typing-cursor"></span>
                                                    )}
                                                </p>
                                            </div>
                                            <ListenButton
                                                text={item.response}
                                                size="small"
                                                className="message-listen-btn"
                                            />
                                        </div>
                                    </div>

                                    {/* Display Questions if available for THIS specific message */}
                                    {item.questions && item.questions.length > 0 && (
                                        <div className="questions-container mt-6 text-gray-200">
                                            {/* Collapsible Header */}
                                            <div
                                                className="flex items-center justify-between mb-6 cursor-pointer p-4 bg-gradient-to-r from-[#FF4B00]/10 to-[#a200ff]/10 rounded-xl border border-white/10 hover:border-[#FF4B00]/50 transition-all duration-300"
                                                onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
                                            >
                                                <h3 className="text-2xl font-bold text-white">
                                                    Questions Found: <span className="text-[#FF4B00]">{item.questions.length}</span>
                                                </h3>
                                                <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                                                    {isQuestionsExpanded ? (
                                                        <ChevronUp className="w-6 h-6 text-[#FF4B00]" />
                                                    ) : (
                                                        <ChevronDown className="w-6 h-6 text-[#FF4B00]" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Collapsible Content */}
                                            {isQuestionsExpanded && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                                                    {item.questions.map((question, qIndex) => (
                                                        <div
                                                            key={question.id || qIndex}
                                                            className="question-card relative bg-[#1b1a27] p-5 rounded-2xl border border-gray-700 shadow-lg hover:shadow-[0_0_20px_rgba(255,75,0,0.2)] transition-all duration-300 group"
                                                        >
                                                            {/* Gradient Accent Line */}
                                                            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-[#FF4B00] to-[#a200ff]" />

                                                            {/* Header */}
                                                            <div className="flex items-start justify-between mb-3">
                                                                <span className="text-sm font-semibold text-[#FF4B00] bg-[#FF4B0015] px-3 py-1 rounded-full">
                                                                    Q{question.question_number}
                                                                    {question.sub_question && question.sub_question !== '-' && (
                                                                        <span>.{question.sub_question}</span>
                                                                    )}
                                                                </span>

                                                                <div className="flex gap-2">
                                                                    {question.course_code && (
                                                                        <span className="text-xs text-gray-300 bg-[#2a2938] px-2 py-1 rounded-md font-medium">
                                                                            {question.course_code}
                                                                        </span>
                                                                    )}
                                                                    {question.exam_type && (
                                                                        <span className="text-xs text-[#a200ff] bg-[#a200ff15] px-2 py-1 rounded-md font-medium uppercase">
                                                                            {question.exam_type}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Course Title */}
                                                            {question.course_title && (
                                                                <p className="text-xs text-gray-400 mb-2 capitalize">
                                                                    {question.course_title}
                                                                </p>
                                                            )}

                                                            {/* Question Text */}
                                                            <p className="text-gray-100 text-sm leading-relaxed mb-3 whitespace-pre-line">
                                                                {question.question_text}
                                                            </p>

                                                            {/* Image Display - Show image directly if available with full width */}
                                                            {question.has_image &&
                                                                question.image_url &&
                                                                question.image_url !== 'N/A' && (
                                                                    <div className="overflow-visible -mx-3 mb-3" style={{ borderRadius: '0' }}>
                                                                        <img
                                                                            src={question.image_url}
                                                                            alt={`Question ${question.question_number} diagram`}
                                                                            className="w-full h-auto min-h-[400px] min-w-[400px] bg-white"
                                                                            style={{ maxHeight: '600px', borderRadius: '0', clipPath: 'none' }}
                                                                            onError={(e) => {
                                                                                // Fallback if image fails to load
                                                                                e.target.style.display = 'none';
                                                                                e.target.nextElementSibling.style.display = 'flex';
                                                                            }}
                                                                        />
                                                                        <div
                                                                            className="hidden items-center justify-center p-4 bg-gray-800/50"
                                                                            style={{ display: 'none' }}
                                                                        >
                                                                            <a
                                                                                href={question.image_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-sm text-[#FF4B00] hover:text-white flex items-center gap-2"
                                                                            >
                                                                                <svg
                                                                                    className="w-4 h-4"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={2}
                                                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                                    />
                                                                                </svg>
                                                                                Image failed to load - Click to open in new tab
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {/* Description Section */}
                                                            {question.has_description &&
                                                                question.description_content &&
                                                                question.description_content !== 'N/A' && (
                                                                    <div className="mb-3 p-3 bg-[#FF4B0010] rounded-lg border border-[#FF4B0030]">
                                                                        <p className="text-xs font-semibold text-[#FF4B00] mb-1">
                                                                            Description:
                                                                        </p>
                                                                        <p className="text-xs text-gray-300 whitespace-pre-line">
                                                                            {question.description_content}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                            {/* Footer */}
                                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                                                                <div className="flex gap-2 items-center">
                                                                    {question.marks && (
                                                                        <span className="text-xs font-medium text-[#10b981] bg-[#10b98115] px-2 py-1 rounded">
                                                                            Marks: {question.marks}
                                                                        </span>
                                                                    )}
                                                                    {question.semester_term && (
                                                                        <span className="text-xs text-gray-400">
                                                                            Term: {question.semester_term}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    {question.pdf_url && question.pdf_url !== 'N/A' && (
                                                                        <a
                                                                            href={question.pdf_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-xs text-[#dc2626] hover:text-white bg-[#dc262615] hover:bg-[#dc2626] px-2 py-1 rounded flex items-center gap-1 transition-all duration-200"
                                                                        >
                                                                            <svg
                                                                                className="w-3 h-3"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                                                />
                                                                            </svg>
                                                                            Full Question
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {loading ?
                            <>
                                <div className="result-title">
                                    <img src={assets.user_icon} alt="" />
                                    <div className="message-content">
                                        <p>{lastSentPrompt}</p>
                                        <ListenButton
                                            text={lastSentPrompt}
                                            size="small"
                                            className="message-listen-btn"
                                        />
                                    </div>
                                </div>
                                <div className="result-data">
                                    <img src={assets.logo} alt="" />
                                    <div className='loader'>
                                        <hr />
                                        <hr />
                                        <hr />
                                    </div>
                                </div>
                            </> : null}

                        {/* Scroll anchor */}
                        <div ref={resultEndRef} />

                    </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <GrAttachment className='attachment-icon' />

                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={listening && transcript ? transcript : input}
                            type="text"
                            placeholder="Talk to COSMOS..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && (input || listening)) {
                                    onSent();
                                    if (listening) {
                                        SpeechRecognition.stopListening();
                                        resetTranscript();
                                    }
                                }
                            }}
                        />

                        {/* <img src={assets.gallery_icon} alt="" /> */}

                        {
                            listening ?
                                <IoMdMicOff
                                    className='cursor-pointer size-5'
                                    onClick={() => {
                                        SpeechRecognition.stopListening();
                                        resetTranscript();
                                    }} />
                                :
                                <img
                                    onClick={() => SpeechRecognition.startListening({ continuous: true })}
                                    src={assets.mic_icon} alt="" />
                        }

                        {/* Agent Dropdown in Input Field */}
                        <div className='relative agent-dropdown-container'>
                            <button
                                onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                                className={`flex items-center gap-1 px-2 py-1 border rounded-lg transition-colors text-xs ${selectedAgent
                                    ? 'border-[#FF4B00] bg-[#FF4B00]/20 text-[#FF4B00] hover:bg-[#FF4B00]/30'
                                    : 'border-gray-600 bg-[#101828] text-gray-300 hover:border-[#FF4B00] hover:bg-[#FF4B00]/10'
                                    }`}
                                title={selectedAgent ? agents.find(a => a.id === selectedAgent)?.name : 'Select Agent'}
                            >

                                <span className='font-semibold'>
                                    {selectedAgent ? agents.find(a => a.id === selectedAgent)?.name.split(' ')[0] : 'Agent'}
                                </span>

                                {
                                    !selectedAgent && (<img className='cursor-pointer w-3' src={assets.CaretDown} alt="" />)
                                }
                            </button>

                            {!selectedAgent && showAgentDropdown && (
                                <div className="absolute bottom-13 right-0 bg-[#1a1f2e] border border-gray-700 rounded-lg shadow-lg w-100 z-50 overflow-hidden">
                                    <div className="p-2 flex flex-col gap-2">
                                        {/* Default agent */}
                                        <button
                                            onClick={() => {
                                                setSelectedAgent(null);
                                                setShowAgentDropdown(false);
                                            }}
                                            className={` w-full text-left px-3 py-2 rounded-md transition-all duration-200 border border-transparent hover:border-[#FF4B00] hover:bg-[#FF4B00]/10 ${!selectedAgent ? "bg-[#FF4B00]/20 text-[#FF4B00]" : "text-gray-300"
                                                }`}
                                        >
                                            <p className="font-semibold text-sm">No Agent (Default)</p>
                                            <p className="text-xs text-gray-400">Use general AI assistant</p>
                                        </button>

                                        <div className="border-t border-gray-700"></div>

                                        {/* Agent list */}
                                        {agents.map((agent) => (
                                            <button
                                                key={agent.id}
                                                onClick={() => {
                                                    setSelectedAgent(agent.id);
                                                    setShowAgentDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 border border-transparent hover:border-[#FF4B00] hover:bg-[#FF4B00]/10 flex flex-col ${selectedAgent === agent.id
                                                    ? "bg-[#FF4B00]/20 text-[#FF4B00]"
                                                    : "text-gray-300"
                                                    }`}
                                            >
                                                <p className="font-semibold text-sm">{agent.name}</p>
                                                <p className="text-xs text-gray-400">{agent.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            )}
                        </div>

                        {/* Send icon - always visible, disabled when no input */}
                        <button
                            onClick={() => {
                                if (input || listening) {
                                    onSent();
                                    if (listening) {
                                        SpeechRecognition.stopListening();
                                        resetTranscript();
                                    }
                                }
                            }}
                            className={`send-icon p-2 rounded-full transition-all duration-200 ${!(input || listening)
                                ? 'opacity-60 cursor-not-allowed bg-gray-600/20'
                                : 'cursor-pointer bg-[#ff4d00ab] hover:bg-[#FF4B00]/90'
                                }`}
                            style={{
                                pointerEvents: !(input || listening) ? 'none' : 'auto'
                            }}
                            disabled={!(input || listening)}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                                    stroke={!(input || listening) ? '#6B7280' : '#FFFFFF'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <p className="bottom-info">COSMOS can make mistakes. Check our Terms & Conditions.</p>
                </div>
            </div>

            {/* TTS Settings Modal */}
            <TTSSettings
                isOpen={ttsSettingsOpen}
                onClose={() => setTtsSettingsOpen(false)}
            />
        </div>
    );
};

export default Chat;