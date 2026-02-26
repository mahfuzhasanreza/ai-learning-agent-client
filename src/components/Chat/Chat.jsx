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
import QuestionPanel from './QuestionPanel';
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
    const [panelQuestions, setPanelQuestions] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
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

                                    {/* Questions button - only shown when questions are available */}
                                    {item.questions && item.questions.length > 0 && (
                                        <div className="mt-4 ml-2">
                                            <button
                                                onClick={() => {
                                                    setPanelQuestions(item.questions);
                                                    setIsPanelOpen(true);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                View {item.questions.length} Question{item.questions.length !== 1 ? 's' : ''}
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
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

            {/* Question Panel */}
            <QuestionPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                questions={panelQuestions}
            />
        </div>
    );
};

export default Chat;