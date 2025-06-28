import React from 'react';

class TextToSpeech {
  constructor() {
    this.speech = null;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.voices = [];
    this.selectedVoice = null;
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      this.speech = window.speechSynthesis;
      this.loadVoices();
      
      // Listen for voices loaded
      this.speech.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    }
  }

  loadVoices() {
    this.voices = this.speech.getVoices();
    
    // Try to find a good default voice (preferably English)
    this.selectedVoice = this.voices.find(voice => 
      voice.lang.includes('en') && voice.name.includes('Google')
    ) || this.voices.find(voice => 
      voice.lang.includes('en')
    ) || this.voices[0];
  }

  speak(text, options = {}) {
    if (!this.speech || !text) return;

    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set default options
    utterance.voice = options.voice || this.selectedVoice;
    utterance.rate = options.rate || 1.0; // Speed (0.1 to 10)
    utterance.pitch = options.pitch || 1.0; // Pitch (0 to 2)
    utterance.volume = options.volume || 1.0; // Volume (0 to 1)
    utterance.lang = options.lang || 'en-US';

    // Event listeners
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentUtterance = utterance;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      console.error('Speech synthesis error:', event.error);
      if (options.onError) options.onError(event);
    };

    // Start speaking
    this.speech.speak(utterance);
  }

  stop() {
    if (this.speech && this.isSpeaking) {
      this.speech.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  pause() {
    if (this.speech && this.isSpeaking) {
      this.speech.pause();
    }
  }

  resume() {
    if (this.speech) {
      this.speech.resume();
    }
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  getVoices() {
    return this.voices;
  }

  setVoice(voice) {
    this.selectedVoice = voice;
  }

  // Extract text content from React elements
  extractTextFromReactElement(element) {
    if (typeof element === 'string') {
      return element;
    }
    
    if (React.isValidElement(element)) {
      // Handle React elements
      const children = element.props.children;
      if (typeof children === 'string') {
        return children;
      }
      if (Array.isArray(children)) {
        return children.map(child => this.extractTextFromReactElement(child)).join(' ');
      }
      if (React.isValidElement(children)) {
        return this.extractTextFromReactElement(children);
      }
    }
    
    if (Array.isArray(element)) {
      return element.map(item => this.extractTextFromReactElement(item)).join(' ');
    }
    
    return '';
  }
}

// Create a singleton instance
const tts = new TextToSpeech();

export default tts; 