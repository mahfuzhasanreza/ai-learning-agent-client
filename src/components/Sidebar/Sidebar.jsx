import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { FaRocketchat } from "react-icons/fa6";

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const [details, setDetails] = useState(false);
    const { onSent, newChatPrompts, setRecentPrompt, newChat, setActiveChat } = useContext(Context);

    const loadPrompt = (prompt) => {
        setRecentPrompt(prompt);
        setActiveChat(prompt);
        // await onSent(prompt);
    }

    return (
        <div className='flex'>
            <div className='sidebar'>
                <div className="top">
                    <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt="" />

                    <img className='menu-other' src={assets.home_icon} alt="" />
                    <img className='menu-other' src={assets.pillar_icon} alt="" />
                    <img className='menu-other' src={assets.man} alt="" />
                    <img className='menu-other' src={assets.cal} alt="" />
                    <FaRocketchat onClick={() => setDetails(prev => !prev)} className={`${details ? 'details-menu-bg-green' : 'details-menu'}`} />
                    <img className='menu-other' src={assets.not} alt="" />

                    {/* <div onClick={() => newChat()} className="new-chat">
                        <img src={assets.plus_icon} alt="" />
                        {extended ? <p>New Chat</p> : null}
                    </div> */}
                    {/* {extended
                        ?
                        <div className="recent">
                            <p className="recent-title">Recent</p>
                            {newChatPrompts.map((item, index) => {
                                return (
                                    <div onClick={() => loadPrompt(item)} className="recent-entry" key={index}>
                                        <img src={assets.message_icon} alt="" />
                                        <p>{item.slice(0, 18)} ...</p>
                                    </div>
                                )
                            })}
                        </div>
                        : null
                    } */}
                </div>

                <div className="bottom">
                    {/* <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div> */}
                    <div className="bottom-item recent-entry">
                        <img src={assets.setting_icon} alt="" />
                        {extended ? <p>Settings</p> : null}
                    </div>
                    <img className='user-icon' src={assets.user_icon} alt="" />
                </div>
            </div>
            {
                details ?
                    <div className="min-w-md bg-gray-200 border-l border-r border-gray-300">

                        <div className='px-5 flex menu-other-active mb-2'>
                            <img className='icon' src={assets.crown} alt="" />
                            <p className='text-3xl font-semibold'>COSMOS</p>
                        </div>
                        <div className='border-t-2 mb-8 border-gray-300'></div>
                        <div className='px-5'>
                            <div className='text-lg flex gap-3 cursor-pointer'>
                                <img src={assets.Vector} alt="" />
                                <p className='font-semibold'>Custom Agent</p>
                            </div>
                            <div className=' mt-8'></div>
                            <div className='text-lg flex gap-3 cursor-pointer'>
                                <img src={assets.Lightbulb} alt="" />
                                <p className='font-semibold'>Bookmark Chat</p>
                            </div>
                        </div>

                        <div className='border-t-2 mb-4 border-gray-300 mt-7'></div>

                        <div className='px-3'>
                            <div onClick={() => newChat()} className="text-lg new-chat">
                                <img className='icon' src={assets.plus_icon} alt="" />
                                <p>New Chat</p>
                            </div>
                        </div>

                        <div className='border-t-2 mb-5 border-gray-300 mt-4'></div>

                        <div className="recent">
                            <div className='flex justify-between px-5'>
                                <p className="text-lg font-semibold">Today</p>
                                <div className='text-lg flex gap-1'>
                                    <p className='text-gray-500'>{newChatPrompts.length} Total</p>
                                    <img src={assets.CaretDown} alt="" />
                                </div>
                            </div>
                            
                            {newChatPrompts.map((item, index) => {
                                return (
                                    <div onClick={() => loadPrompt(item)} className="recent-entry" key={index}>
                                        <img className='w-7' src={assets.message_icon} alt="" />
                                        <p className='text-lg'>{item.slice(0, 18)} ...</p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className='border-t-2 mb-5 border-gray-300 mt-4'></div>

                        <div className='flex justify-between px-5'>
                            <p className="text-lg font-semibold">Previous 7 Days</p>
                            <div className='text-lg flex gap-1'>
                                <p className='text-gray-500'>~</p>
                                <img src={assets.CaretDown} alt="" />
                            </div>
                        </div>

                    </div>
                    : null
            }
        </div>
    );
};

export default Sidebar;