import React, { useContext, useEffect, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { IoMdMicOff } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

const Main = () => {

    const { recentPrompt, onSent, loading, showResult, resultData, setInput, input, conversation, activeChat } = useContext(Context);
    const [extended, setExtended] = useState(false);
    // console.log(conversation);
    // console.log(activeChat, "activeChat");

    // const loadPrompt = async(prompt) => {
    //     await onSent(prompt);
    // }

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    useEffect(() => {
        if (listening && transcript) {
            setInput(transcript);
        }
    }, [transcript, listening]);

    return (
        <div className='main'>
            <div className="nav border-b-2 border-gray-300 text-gray-600">
                <div className='flex gap-2'>
                    <p className='ml-3 font-semibold'>Model GPT 7.0</p>
                    <img className='cursor-pointer' src={assets.CaretDown} alt="" />
                </div>
                <div className='flex text-2xl gap-4 mr-16'>
                    <MdOutlineLightMode className='cursor-pointer font-bold text-blue-600' />
                    <MdOutlineDarkMode className='cursor-pointer' />
                </div>
                <div onClick={() => setExtended(prev => !prev)} className={extended ? 'relative mr-3 border border-gray-400 rounded-full w-10 h-10 content-center flex justify-center items-center' : 'relative mr-3 border-gray-400 rounded-full w-10 h-10 content-center flex justify-center items-center'}>
                    <img className='cursor-pointer w-8' src={assets.menu_ico} alt="" />
                </div>
                {extended && (
                    <div className="absolute top-20 right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-100% z-50">
                        <ul className="flex flex-col text-lg text-gray-700">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <div className='min-w-sm flex justify-between items-center'>
                                    <div className='flex gap-2'>
                                        <img className='w-15 rounded-full' src={assets.user_icon} alt="" />
                                        <div>
                                            <p className='font-semibold'>Mahfuz Hasan Reza</p>
                                            <p className='font-extralight'>20k Tokens Used</p>
                                        </div>
                                    </div>
                                    <div>
                                        <img src={assets.CaretDown} className='w-6' alt="" />
                                    </div>
                                </div>
                            </li>
                            <div className='border-t-2 mb-2 border-gray-300'></div>

                            <li className="">
                                <div className='font-semibold text-md text-gray-500 flex justify-between'>
                                    <p className='border-b-2 text-black border-blue-600 px-4 py-2 ml-4 cursor-pointer'>Agents</p>
                                    <p className='px-4 py-2 hover:border-b-2 hover:border-blue-600 cursor-pointer'>Auto Group</p>
                                    <p className='px-4 py-2 mr-2 hover:border-b-2 hover:border-blue-600 cursor-pointer'>Quiz</p>
                                </div>
                            </li>
                            <li className="mt-5 ml-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-md font-semibold text-gray-800">Bring Expert in Discussion</li>
                        </ul>
                    </div>
                )}
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
                            <div onClick={() => onSent("How can I learn C Programme?")} className="card">
                                <div className="card-content">
                                    <p>How can I learn C Programme?</p>
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
                                            <p>{item.input}</p>
                                        </div>
                                        <div className="result-data">
                                            <img src={assets.logo} alt="" />
                                            <p>{item.response}</p>
                                        </div>
                                    </div>
                                )
                            })}

                        {loading ?
                            <>
                                <div className="result-title">
                                    <img src={assets.user_icon} alt="" />
                                    <p>{input}</p>
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

                        {/* <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.logo} alt="" />
                            {loading
                                ? <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                                :
                                // <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                                <p>{resultData}</p>
                            }
                        </div> */}
                    </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <GrAttachment className='attachment-icon' />

                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={listening && transcript ? transcript : input}
                            type="text"
                            placeholder="Talk to AIDA..."
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
                    <p className="bottom-info">AIDA can make mistakes. Check our Terms & Conditions.</p>
                </div>
            </div>
        </div>
    );
};

export default Main;