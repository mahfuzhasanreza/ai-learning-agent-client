import React, { useContext, useEffect, useState, useRef } from 'react';
import './Chat.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion } from 'framer-motion';
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
    const { user } = UserAuth();
    const { isSidebarOpen, setIsSidebarOpen, ttsSettingsOpen, setTtsSettingsOpen, recentPrompt, onSent, loading, showResult, resultData, setInput, input, lastSentPrompt, conversation, activeChat, courseData, selectedAgent, setSelectedAgent, isTyping } = useContext(Context);
    const [extended, setExtended] = useState(false);
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);
    const [agents, setAgents] = useState([]);
    const [loadingAgents, setLoadingAgents] = useState(false);
    const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(true); // State for questions dropdown
    const resultEndRef = useRef(null);

    const { isDark } = useContext(Context)

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

        <div className={`main w-full pt-25 transition-all duration-300 flex`}>
            {/* Sidebar - ChatSidebar will always be open */}
            <ChatSidebar
                isOpen={true}
                setIsOpen={setIsSidebarOpen}
            />


            {/* <Navigation></Navigation> */}


            <motion.div
                className="main-container flex-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.2
                }}
            >
                {!showResult
                    ? <>
                        <div className="greet">
                            <p className="greeting-line-1">
                                <span className="greeting-highlight">Hello, {user.email.split("@")[0].replace(/\d+$/, "")}.</span>
                            </p>
                            <p className="greeting-line-2 text-gray-600">How can I help you today?</p>
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
                                    <div className='flex justify-end'>
                                        <div className="mb-5 w-fit rounded-2xl bg-[#f9fafb]">
                                            <p className="p-2 px-4">{item.input}</p>
                                        </div>
                                    </div>

                                    <div className="result-data">

                                        <div className="message-content flex justify-between">
                                            <div className='flex flex-col'>
                                                <div className='mb-3 flex justify-between'>
                                                    <div className='flex gap-3'>
                                                        {/* <div><img src={assets.logo} alt="" /></div> */}
                                                        <div>
                                                            {/* Show agent name for each message */}
                                                            {(item.agentName || item.courseData) && (
                                                                <p className='w-fit px-3 py-1  bg-orange-500 text-2xl border-0 !text-white rounded-lg align-center items-center content-center justify-center'>
                                                                    {item.agentName || item.courseData}
                                                                </p>
                                                            )}
                                                            {/* Fallback to global courseData if not in item */}
                                                            {!item.agentName && !item.courseData && courseData && (
                                                                <p className='w-fit px-3 py-1  bg-orange-500 text-2xl border-0 !text-white rounded-lg align-center items-center content-center justify-center'>
                                                                    {courseData}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>

                                                <p>
                                                    {item.response}
                                                    {/* Show typing cursor on the last message if typing */}
                                                    {isTyping && index === conversation.length - 1 && (
                                                        <span className="typing-cursor"></span>
                                                    )}
                                                </p>
                                            </div>

                                        </div>
                                        <div>
                                            <ListenButton
                                                text={item.response}
                                                size="small"
                                                className="message-listen-btn"
                                            />
                                        </div>
                                    </div>

                                    {/* Display Questions if available for THIS specific message */}
                                    {item.questions && item.questions.length > 0 && (
                                        <div className="questions-container mt-6 text-gray-700">
                                            {/* Collapsible Header */}
                                            <div
                                                className="flex items-center justify-between mb-6 cursor-pointer p-4 bg-orange-50 rounded-xl border border-gray-200 hover:border-orange-500 transition-all duration-300"
                                                onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
                                            >
                                                <h3 className="text-2xl font-bold text-gray-800">
                                                    Questions Found: <span className="text-orange-500">{item.questions.length}</span>
                                                </h3>
                                                <button className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                                                    {isQuestionsExpanded ? (
                                                        <ChevronUp className="w-6 h-6 text-orange-500" />
                                                    ) : (
                                                        <ChevronDown className="w-6 h-6 text-orange-500" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Collapsible Content */}
                                            {isQuestionsExpanded && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                                                    {item.questions.map((question, qIndex) => (
                                                        <div
                                                            key={question.id || qIndex}
                                                            className="question-card relative bg-white p-5 rounded-2xl border border-gray-200 shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-300 group"
                                                        >
                                                            {/* Gradient Accent Line */}
                                                            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-orange-500" />

                                                            {/* Header */}
                                                            <div className="flex items-start justify-between mb-3">
                                                                <span className="text-sm font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                                                                    Q{question.question_number}
                                                                    {question.sub_question && question.sub_question !== '-' && (
                                                                        <span>.{question.sub_question}</span>
                                                                    )}
                                                                </span>

                                                                <div className="flex gap-2">
                                                                    {question.course_code && (
                                                                        <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-md font-medium">
                                                                            {question.course_code}
                                                                        </span>
                                                                    )}
                                                                    {question.exam_type && (
                                                                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md font-medium uppercase">
                                                                            {question.exam_type}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Course Title */}
                                                            {question.course_title && (
                                                                <p className="text-xs text-gray-600 mb-2 capitalize">
                                                                    {question.course_title}
                                                                </p>
                                                            )}

                                                            {/* Question Text */}
                                                            <p className="text-gray-800 text-sm leading-relaxed mb-3 whitespace-pre-line">
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
                                                                    <div className="mb-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                                        <p className="text-xs font-semibold text-orange-500 mb-1">
                                                                            Description:
                                                                        </p>
                                                                        <p className="text-xs text-gray-700 whitespace-pre-line">
                                                                            {question.description_content}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                            {/* Footer */}
                                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                                                                <div className="flex gap-2 items-center">
                                                                    {question.marks && (
                                                                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                                                            Marks: {question.marks}
                                                                        </span>
                                                                    )}
                                                                    {question.semester_term && (
                                                                        <span className="text-xs text-gray-600">
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
                                                                            className="text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-2 py-1 rounded flex items-center gap-1 transition-all duration-200"
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

                                <div className='flex justify-end'>
                                    <div className="mb-5 w-fit rounded-2xl bg-[#f9fafb]">
                                        <p className="p-2 px-4 text-gray-800">{lastSentPrompt}</p>
                                    </div>
                                </div>

                                <div className="result-data">

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

                <div className="main-bottom ">
                    <div className="search-box  border-2 border-gray-200">
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
                                    ? 'border-orange-500 bg-orange-50 text-orange-500 hover:bg-orange-100'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-orange-500 hover:bg-orange-50'
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
                                <div className="absolute bottom-13 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-55 z-50 overflow-hidden">
                                    <div className="p-2 flex flex-col gap-2">
                                        {/* Default agent */}
                                        <button
                                            onClick={() => {
                                                setSelectedAgent(null);
                                                setShowAgentDropdown(false);
                                            }}
                                            className={` w-full text-left px-3 py-2 rounded-md transition-all duration-200 border border-transparent hover:border-orange-500 hover:bg-orange-50 ${!selectedAgent ? "bg-orange-50 text-orange-500" : "text-gray-700"
                                                }`}
                                        >
                                            <p className="font-semibold text-sm">No Agent (Default)</p>
                                            <p className="text-xs text-gray-600">Use general AI assistant</p>
                                        </button>

                                        <div className="border-t border-gray-200"></div>

                                        {/* Agent list */}
                                        {agents.map((agent) => (
                                            <button
                                                key={agent.id}
                                                onClick={() => {
                                                    setSelectedAgent(agent.id);
                                                    setShowAgentDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 border border-transparent hover:border-orange-500 hover:bg-orange-50 flex flex-col ${selectedAgent === agent.id
                                                    ? "bg-orange-50 text-orange-500"
                                                    : "text-gray-700"
                                                    }`}
                                            >
                                                <p className="font-semibold text-sm">{agent.name}</p>
                                                <p className="text-xs text-gray-600">{agent.description}</p>
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
                                ? 'opacity-60 cursor-not-allowed bg-gray-200'
                                : 'cursor-pointer bg-orange-500 hover:bg-orange-600'
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
                                    stroke={!(input || listening) ? '#9CA3AF' : '#FFFFFF'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <p className="bottom-info text-gray-500">COSMOS can make mistakes. Check our Terms & Conditions.</p>
                </div>
            </motion.div>

            {/* TTS Settings Modal */}
            <TTSSettings
                isOpen={ttsSettingsOpen}
                onClose={() => setTtsSettingsOpen(false)}
            />
        </div>
    );
};

export default Chat;