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


const Chat = () => {

    const { ttsSettingsOpen, setTtsSettingsOpen, recentPrompt, onSent, loading, showResult, resultData, setInput, input, conversation, activeChat, courseData, selectedAgent, setSelectedAgent, questions } = useContext(Context);
    const [extended, setExtended] = useState(false);
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Available agents list
    const agents = [
        { id: 'dbms_agent', name: 'DBMS Agent', description: 'Database Management Expert' },
        { id: 'python_agent', name: 'Python Agent', description: 'Python Programming Expert' },
        { id: 'java_agent', name: 'Java Agent', description: 'Java Programming Expert' },
        { id: 'web_agent', name: 'Web Development Agent', description: 'Web Development Expert' },
        { id: 'ml_agent', name: 'ML Agent', description: 'Machine Learning Expert' },
    ];

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
        <div className='main'>
            

            {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        newChat={() => console.log("New chat")}
        setTtsSettingsOpen={() => console.log("TTS Settings")}
      />


            {/* <Navigation></Navigation> */}
            <div className="nav border-b-2 border-gray-300 text-gray-600">
                <div className='relative agent-dropdown-container'>
                    <button
                        onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${selectedAgent
                            ? 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {selectedAgent && (
                            <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                        )}
                        <span className='font-semibold text-sm'>
                            {selectedAgent ? agents.find(a => a.id === selectedAgent)?.name : 'Select Agent'}
                        </span>
                        <img className='cursor-pointer w-4' src={assets.CaretDown} alt="" />
                    </button>

                    {showAgentDropdown && (
                        <div className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg w-72 z-50">
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        setSelectedAgent(null);
                                        setShowAgentDropdown(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${!selectedAgent ? 'bg-blue-50 text-blue-600' : ''}`}
                                >
                                    <p className='font-semibold text-sm'>No Agent (Default)</p>
                                    <p className='text-xs text-gray-500'>Use general AI assistant</p>
                                </button>
                                <div className='border-t border-gray-200 my-2'></div>
                                {agents.map((agent) => (
                                    <button
                                        key={agent.id}
                                        onClick={() => {
                                            setSelectedAgent(agent.id);
                                            setShowAgentDropdown(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${selectedAgent === agent.id ? 'bg-blue-50 text-blue-600' : ''}`}
                                    >
                                        <p className='font-semibold text-sm'>{agent.name}</p>
                                        <p className='text-xs text-gray-500'>{agent.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
                        {conversation
                            .filter(item => item.chat === activeChat)
                            .map((item, index) => {
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
                                                    <p className='w-fit px-5 py-1 font-bold bg-blue-500 text-2xl border-0 rounded-lg text-white align-center items-center content-center justify-center hover:bg-blue-700'>

                                                        {courseData}
                                                    </p>
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

                                        {/* Display Questions if available */}
                                        {questions && questions.length > 0 && (
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