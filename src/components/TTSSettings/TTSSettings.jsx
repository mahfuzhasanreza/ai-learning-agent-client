import React, { useState, useEffect } from 'react';
import { FaCog, FaTimes, FaVolumeUp, FaPlay, FaStop } from 'react-icons/fa';
import tts from '../../utils/textToSpeech';
import './TTSSettings.css';

const TTSSettings = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [testText, setTestText] = useState('Hello! This is a test of the text-to-speech settings.');

  useEffect(() => {
    if (isOpen && tts.isSupported()) {
      const availableVoices = tts.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0] || null);
    }
  }, [isOpen]);

  const handleVoiceChange = (voiceIndex) => {
    const voice = voices[voiceIndex];
    setSelectedVoice(voice);
    tts.setVoice(voice);
  };

  const handleTest = () => {
    tts.speak(testText, {
      voice: selectedVoice,
      rate: rate,
      pitch: pitch,
      volume: volume
    });
  };

  const handleStop = () => {
    tts.stop();
  };

  if (!isOpen || !tts.isSupported()) return null;

  return (
    <div className="tts-settings-overlay">
      <div className="tts-settings-modal">
        <div className="tts-settings-header">
          <h3 className="tts-settings-title">
            <FaVolumeUp className="tts-icon" />
            Text-to-Speech Settings
          </h3>
          <button onClick={onClose} className="tts-close-btn">
            <FaTimes />
          </button>
        </div>

        <div className="tts-settings-content">
          {/* Voice Selection */}
          <div className="tts-setting-group">
            <label className="tts-label">Voice</label>
            <select 
              className="tts-select"
              onChange={(e) => handleVoiceChange(e.target.value)}
              value={voices.indexOf(selectedVoice)}
            >
              {voices.map((voice, index) => (
                <option key={index} value={index}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speed Control */}
          <div className="tts-setting-group">
            <label className="tts-label">
              Speed: {rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="tts-slider"
            />
          </div>

          {/* Pitch Control */}
          <div className="tts-setting-group">
            <label className="tts-label">
              Pitch: {pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="tts-slider"
            />
          </div>

          {/* Volume Control */}
          <div className="tts-setting-group">
            <label className="tts-label">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="tts-slider"
            />
          </div>

          {/* Test Section */}
          <div className="tts-setting-group">
            <label className="tts-label">Test Settings</label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="tts-test-textarea"
              placeholder="Enter text to test the voice settings..."
              rows="3"
            />
            <div className="tts-test-controls">
              <button onClick={handleTest} className="tts-test-btn">
                <FaPlay />
                Test
              </button>
              <button onClick={handleStop} className="tts-stop-btn">
                <FaStop />
                Stop
              </button>
            </div>
          </div>
        </div>

        <div className="tts-settings-footer">
          <button onClick={onClose} className="tts-save-btn">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TTSSettings; 