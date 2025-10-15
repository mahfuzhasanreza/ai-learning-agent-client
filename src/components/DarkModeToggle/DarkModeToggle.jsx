import { useContext } from 'react';
import { Context } from '../../context/Context';

const DarkModeToggle = () => {
    const { isDark, toggleDarkMode } = useContext(Context);

    return (
        <button
            onClick={toggleDarkMode}
            style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: isDark ? '#374151' : '#e5e7eb',
                color: isDark ? '#ffffff' : '#000000',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#4b5563' : '#d1d5db';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#e5e7eb';
            }}
        >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
};

export default DarkModeToggle;