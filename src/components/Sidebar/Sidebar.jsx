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
        <div className='sidebar'>
            <div className="top">
                <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt="" />

                <img className='menu-other' src={assets.home_icon} alt="" />
                <img className='menu-other' src={assets.pillar_icon} alt="" />
                <img className='menu-other' src={assets.man} alt="" />
                <img className='menu-other' src={assets.cal} alt="" />
                <FaRocketchat onClick={() => setDetails(prev => !prev)} className={`${details ? 'details-menu-bg-green' : 'details-menu'}`}/>
                <img className='menu-other' src={assets.not} alt="" />

                {
                    details ?
                    null
                    : null
                }

                <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended
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
                }
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
    );
};

export default Sidebar;