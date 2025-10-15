import React from 'react';

const Title = ({ 
  text, 
  className = '', 
  size = 'default',
  gradient = 'primary'
}) => {
  const sizeClasses = {
    small: 'text-3xl md:text-4xl',
    default: 'text-4xl md:text-5xl lg:text-6xl',
    large: 'text-5xl md:text-6xl lg:text-7xl'
  };

  const gradientClasses = {
    primary: 'bg-gradient-to-r from-[#FF4B00] to-[#fd7f48]',
    secondary: 'bg-gradient-to-r from-[#a200ff] to-[#d665ff]',
    accent: 'bg-gradient-to-r from-[#FF4B00] to-[#a200ff]'
  };

  return (
    <h1 
      className={`
        ${sizeClasses[size]} 
        ${gradientClasses[gradient]} 
        font-bold 
        mb-5 
        bg-clip-text 
        text-transparent 
        relative
        ${className}
      `}
    >
      {text}
    </h1>
  );
};

export default Title;