import React, { useContext, useEffect, useState } from 'react';
import './Chat.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { IoMdMicOff } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import ListenButton from '../ListenButton/ListenButton';
import TTSSettings from '../TTSSettings/TTSSettings';
import Navigation from '../LandingPage/components/Navigation';
import ChatSidebar from './ChatSidebar';
import ApiService from '../../services/apiService';


const Chat = () => {

    const { isSidebarOpen, setIsSidebarOpen, ttsSettingsOpen, setTtsSettingsOpen, recentPrompt, onSent, loading, showResult, resultData, setInput, input, conversation, activeChat, courseData, selectedAgent, setSelectedAgent, questions } = useContext(Context);
    const [extended, setExtended] = useState(false);
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);
    const [agents, setAgents] = useState([]);
    const [loadingAgents, setLoadingAgents] = useState(false);


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
                                <span className="greeting-highlight">Hello, User.</span>
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
                                        <div className="message-content">
                                            <div className='flex flex-col'>
                                                {/* Show agent name for each message */}
                                                {(item.agentName || item.courseData) && (
                                                    <p className='w-fit px-5 py-1 font-bold bg-blue-500 text-2xl border-0 rounded-lg text-white align-center items-center content-center justify-center hover:bg-blue-700'>
                                                        {item.agentName || item.courseData}
                                                    </p>
                                                )}
                                                {/* Fallback to global courseData if not in item */}
                                                {!item.agentName && !item.courseData && courseData && (
                                                    <p className='w-fit px-5 py-1 font-bold bg-blue-500 text-2xl border-0 rounded-lg text-white align-center items-center content-center justify-center hover:bg-blue-700'>
                                                        {courseData}
                                                    </p>
                                                )}
                                                <br />
                                                <p>{item.response}</p>
                                            </div>
                                            <ListenButton
                                                text={item.response}
                                                size="small"
                                                className="message-listen-btn"
                                            />
                                        </div>
                                    </div>

                                    {/* Display Questions if available - only on the last message */}
                                    {questions && questions.length > 0 && index === conversation.length - 1 && (
                                        <div className="questions-container mt-6">
                                            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                                                Questions Found: {questions.length}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {questions.map((question, qIndex) => (
                                                    <div
                                                        key={question.id || qIndex}
                                                        className="question-card bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
                                                    >
                                                        {/* Header with Question Number and Course */}
                                                        <div className="flex items-start justify-between mb-3">
                                                            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                                Q{question.question_number}
                                                                {question.sub_question && question.sub_question !== '-' && (
                                                                    <span>.{question.sub_question}</span>
                                                                )}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                {question.course_code && (
                                                                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded font-medium">
                                                                        {question.course_code}
                                                                    </span>
                                                                )}
                                                                {question.exam_type && (
                                                                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded font-medium uppercase">
                                                                        {question.exam_type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Course Title */}
                                                        {question.course_title && (
                                                            <p className="text-xs text-gray-500 mb-2 capitalize">
                                                                {question.course_title}
                                                            </p>
                                                        )}

                                                        {/* Question Text */}
                                                        <p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-line">
                                                            {question.question_text}
                                                        </p>

                                                        {/* Description Content if available */}
                                                        {question.has_description && question.description_content && question.description_content !== 'N/A' && (
                                                            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                                <p className="text-xs font-semibold text-blue-700 mb-1">Description:</p>
                                                                <p className="text-xs text-gray-600 whitespace-pre-line">
                                                                    {question.description_content}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Footer with Marks, Image, and PDF */}
                                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                            <div className="flex gap-2 items-center">
                                                                {question.marks && (
                                                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                                                        Marks: {question.marks}
                                                                    </span>
                                                                )}
                                                                {question.semester_term && (
                                                                    <span className="text-xs text-gray-500">
                                                                        Term: {question.semester_term}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {question.has_image && question.image_url && question.image_url !== 'N/A' && (
                                                                    <a
                                                                        href={question.image_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                        Image
                                                                    </a>
                                                                )}
                                                                {question.pdf_url && question.pdf_url !== 'N/A' && (
                                                                    <a
                                                                        href={question.pdf_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-xs text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                        </svg>
                                                                        PDF
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
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
                                        <p>{input}</p>
                                        <ListenButton
                                            text={input}
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
                        />

                        <img src={assets.gallery_icon} alt="" />

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
                                <img className='cursor-pointer w-3' src={assets.CaretDown} alt="" />
                            </button>

                            {showAgentDropdown && (
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

                        {input || listening ? <img onClick={() => onSent()} className='send-icon' src={assets.send_icon} alt="" /> : null}
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