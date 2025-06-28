import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import tts from '../../utils/textToSpeech';
import './ListenButton.css';

const ListenButton = ({ 
  text, 
  className = '', 
  size = 'medium',
  showLabel = false,
  onStart,
  onEnd,
  onError 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(tts.isSupported());
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isPlaying) {
        tts.stop();
      }
    };
  }, [isPlaying]);

  const handlePlay = () => {
    if (!isSupported || !text) return;

    const extractedText = typeof text === 'string' ? text : tts.extractTextFromReactElement(text);
    
    if (!extractedText.trim()) return;

    tts.speak(extractedText, {
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
        if (onStart) onStart();
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (onEnd) onEnd();
      },
      onError: (error) => {
        setIsPlaying(false);
        setIsPaused(false);
        if (onError) onError(error);
      }
    });
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      tts.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      tts.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    tts.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!isSupported) {
    return null; // Don't render if TTS is not supported
  }

  const sizeClasses = {
    small: 'w-6 h-6 text-sm',
    medium: 'w-8 h-8 text-base',
    large: 'w-10 h-10 text-lg'
  };

  const iconSize = {
    small: 12,
    medium: 16,
    large: 20
  };

  return (
    <div className={`listen-button-container ${className}`}>
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className={`listen-button play-button ${sizeClasses[size]}`}
          title="Listen to this message"
          disabled={!text}
        >
          <FaPlay size={iconSize[size]} />
          {showLabel && <span className="listen-label">Listen</span>}
        </button>
      ) : (
        <div className="listen-controls">
          <button
            onClick={handlePause}
            className={`listen-button ${sizeClasses[size]}`}
            title={isPaused ? "Resume" : "Pause"}
          >
            <FaPause size={iconSize[size]} />
            {showLabel && <span className="listen-label">{isPaused ? "Resume" : "Pause"}</span>}
          </button>
          <button
            onClick={handleStop}
            className={`listen-button stop-button ${sizeClasses[size]}`}
            title="Stop"
          >
            <FaStop size={iconSize[size]} />
            {showLabel && <span className="listen-label">Stop</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default ListenButton; 