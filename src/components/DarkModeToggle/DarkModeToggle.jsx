import { useContext } from 'react';
import { Context } from '../../context/Context';
import { MdOutlineDarkMode, MdLightMode } from "react-icons/md";

const DarkModeToggle = () => {
    const { isDark, toggleDarkMode } = useContext(Context);

    return (
        <button
            onClick={toggleDarkMode}
            style={{
                // padding: '8px 16px',
                // borderRadius: '6px',
                // backgroundColor: isDark ? '#374151' : '#e5e7eb',
                // color: isDark ? '#ffffff' : '#000000',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: '10px'
            }}
            
        >
            {isDark ? <MdOutlineDarkMode className='text-gray-200 text-2xl'/> : <MdLightMode className='text-black text-2xl' />}
        </button>
    );
};

export default DarkModeToggle;