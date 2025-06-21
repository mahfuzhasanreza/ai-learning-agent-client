import React, { useContext, useEffect } from 'react';
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
                    <MdOutlineDarkMode className='cursor-pointer'/>
                </div>
                <div className='mr-3'>
                    <img className='cursor-pointer w-8' src={assets.menu_ico} alt="" />
                </div>
            </div>

            <div className="main-container">

                {!showResult
                    ? <>
                        <div className="greet">
                            <p><span>Hello, User.</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div onClick={() => onSent("What is C Programming?")} className="card">
                                <p>What is C Programming?</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div onClick={() => onSent("How can I learn C Programme?")} className="card">
                                <p>How can I learn C Programme?</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div onClick={() => onSent("Give me the details about C Programming including functions, structures, pointers etc")} className="card">
                                <p>Give me the details about C Programming including functions, structures, pointers etc</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div onClick={() => onSent("As a beginner how can I learn programming? Which language should I learn first?")} className="card">
                                <p>As a beginner how can I learn programming? Which language should I learn first?</p>
                                <img src={assets.code_icon} alt="" />
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