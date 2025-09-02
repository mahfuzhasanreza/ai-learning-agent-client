import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Clock, CheckCircle, Circle, BookOpen, Target, Award } from 'lucide-react';

import { Star, Zap, Trophy } from 'lucide-react';
import roadmapData from "../../../src/data/c_roadmap.json";
import FooterSection from '../../components/LandingPage/sections/FooterSection';
import Navigation from '../../components/LandingPage/components/Navigation';
import { div } from 'framer-motion/client';
// import roadmapData from "../../../src/data/python_roadmap.json";


const Roadmap = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [completedItems, setCompletedItems] = useState(new Set());
    const [activeStage, setActiveStage] = useState(0);
    const [visibleStages, setVisibleStages] = useState(new Set([0]));
    const [showConfetti, setShowConfetti] = useState(false);
    const timelineRef = useRef(null);
  
     const data = roadmapData;
  
    const getDifficultyColor = (difficulty) => {
      if (!difficulty) return "bg-gray-500";
      
      const colors = {
        "Easy": "bg-green-500",
        "Beginner": "bg-green-500",
        "Low": "bg-green-500",
        "Medium": "bg-yellow-500",
        "Intermediate": "bg-yellow-500",
        "Moderate": "bg-yellow-500",
        "Hard": "bg-red-500",
        "Advanced": "bg-red-500",
        "Expert": "bg-purple-500",
        "High": "bg-red-500"
      };
      
      const normalizedDifficulty = difficulty.toLowerCase();
      const matchedKey = Object.keys(colors).find(key => 
        key.toLowerCase() === normalizedDifficulty
      );
      
      return colors[matchedKey] || "bg-gray-500";
    };
  
    const getDifficultyTextColor = (difficulty) => {
      const colorMap = {
        "bg-green-500": "text-green-700 bg-green-100 border-green-200",
        "bg-yellow-500": "text-yellow-700 bg-yellow-100 border-yellow-200",
        "bg-red-500": "text-red-700 bg-red-100 border-red-200",
        "bg-purple-500": "text-purple-700 bg-purple-100 border-purple-200",
        "bg-gray-500": "text-gray-700 bg-gray-100 border-gray-200"
      };
      return colorMap[getDifficultyColor(difficulty)] || "text-gray-700 bg-gray-100 border-gray-200";
    };
  
    const toggleCompletion = (stageIndex, itemIndex) => {
      const itemId = `${stageIndex}-${itemIndex}`;
      const newCompleted = new Set(completedItems);
      if (newCompleted.has(itemId)) {
        newCompleted.delete(itemId);
      } else {
        newCompleted.add(itemId);
        // Show confetti animation for completion
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      setCompletedItems(newCompleted);
    };
  
    const isCompleted = (stageIndex, itemIndex) => {
      return completedItems.has(`${stageIndex}-${itemIndex}`);
    };
  
    const getStageProgress = (stageIndex) => {
      const stage = data.stages[stageIndex];
      const completedCount = stage.items.filter((_, itemIndex) => 
        isCompleted(stageIndex, itemIndex)
      ).length;
      return Math.round((completedCount / stage.items.length) * 100);
    };
  
    const getTotalProgress = () => {
      const totalItems = data.stages.reduce((sum, stage) => sum + stage.items.length, 0);
      const completedCount = data.stages.reduce((sum, stage, stageIndex) => 
        sum + stage.items.filter((_, itemIndex) => isCompleted(stageIndex, itemIndex)).length, 0
      );
      return Math.round((completedCount / totalItems) * 100);
    };
  
    const scrollToStage = (stageIndex) => {
      setActiveStage(stageIndex);
      const element = document.getElementById(`stage-${stageIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    };
  
    // Intersection Observer for stage visibility
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const stageIndex = parseInt(entry.target.id.split('-')[1]);
              setVisibleStages(prev => new Set([...prev, stageIndex]));
            }
          });
        },
        { threshold: 0.3 }
      );
  
      const stageElements = document.querySelectorAll('[id^="stage-"]');
      stageElements.forEach(el => observer.observe(el));
  
      return () => observer.disconnect();
    }, []);
  
    // Render additional fields
    const renderAdditionalFields = (item) => {
      const excludeFields = ['name', 'description', 'difficulty', 'timeCommitment'];
      const additionalFields = Object.keys(item).filter(key => !excludeFields.includes(key));
      
      if (additionalFields.length === 0) return null;
  
      return (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Additional Information:</h4>
          {additionalFields.map(field => (
            <div key={field} className="flex">
              <span className="text-xs font-medium text-gray-500 w-24 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}:
              </span>
              <span className="text-xs text-gray-700 flex-1">{String(item[field])}</span>
            </div>
          ))}
        </div>
      );
    };
  
    // Confetti component
    const Confetti = () => (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    );
  
    if (!data) {
      return (
        <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading roadmap data...</p>
          </div>
        </div>
      );
    }
  
    return (
      <>
      <Navigation></Navigation>

      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-400 via-purple-50 to-pink-100 relative overflow-hidden pt-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-yellow-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
  
        {/* Confetti */}
        {showConfetti && <Confetti />}

        {/* Roadmap Summary (below global navbar) */}
        <div className="max-w-7xl mx-auto px-6 py-10">
  <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-white/20">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Title */}
      <div className="flex items-center space-x-4">
        
        {/* <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg">
          <BookOpen className="h-10 w-10" />
        </div> */}
        
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            {data.topic} Roadmap
          </h1>
          <p className="text-gray-600 text-sm mt-1 flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            Track your learning journey
          </p>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="flex  items-center space-x-6 gap-4 w-full md:w-auto">
        <div className=" flex  items-center space-x-3 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl px-6 py-4 shadow-lg">
          <Trophy className="h-7 w-7 mr-4 mt-2 text-yellow-600 animate-bounce" />
          <div>
            <span className="text-2xl font-bold text-gray-900">{getTotalProgress()}%</span>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
        </div>
        <div className="flex-1 md:w-48 bg-gray-200/50 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative"
            style={{ width: `${getTotalProgress()}%` }}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
        </div>


  
        <div className="max-w-7xl gap-7 mx-auto p-6 relative z-10">
          {/* Stage Navigation */}
          <div className="mb-12 ">
            <div className="gap-3 flex items-center justify-center space-x-3 pb-4">
              {data.stages.map((stage, index) => (
                <button
                  key={index}
                  onClick={() => scrollToStage(index)}
                  className={`border border-blue-300 group relative flex items-center space-x-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                    activeStage === index 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25' 
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg'
                  }`}
                >
                  {/* <div className={`w-8 mr-3  h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    getStageProgress(index) === 100 
                      ? 'bg-green-500 text-white' 
                      : activeStage === index ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {getStageProgress(index) === 100 ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </div> */}

                  {getStageProgress(index) === 100 ? <div className={`w-8 mr-3  h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    getStageProgress(index) === 100 
                      ? 'bg-green-500 text-white' 
                      : activeStage === index ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <CheckCircle className="h-5 w-5" />
                  </div> : ""}

                  
                  <div className="text-left">
                    <span className="text-sm font-semibold">Stage {index + 1}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-current h-1 rounded-full transition-all duration-500"
                        style={{ width: `${getStageProgress(index)}%` }}
                      ></div>
                    </div>
                  </div>
                  {activeStage === index && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
  
          {/* Timeline Container */}
          <div className="relative" ref={timelineRef}>
            {/* Main Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-green-300 rounded-full shadow-sm">
              <div className="absolute inset-0 bg-white/50 rounded-full animate-pulse"></div>
            </div>
  
            {/* Stages */}
            <div className="space-y-20">
              {data.stages.map((stage, stageIndex) => (
                <div 
                  key={stageIndex} 
                  id={`stage-${stageIndex}`}
                  className="relative"
                  style={{
                    opacity: visibleStages.has(stageIndex) ? 1 : 0,
                    transform: visibleStages.has(stageIndex) ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out'
                  }}
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-center mb-12">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30"></div>
                      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-3xl text-center border border-white/20">
                        <div className="flex items-center justify-center mb-4">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl w-12 h-12 flex items-center justify-center text-xl font-bold mr-4 shadow-lg">
                            {stageIndex + 1}
                          </div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
                            {stage.title}
                          </h2>
                          {getStageProgress(stageIndex) === 100 && (
                            <div className="ml-4">
                              <Zap className="h-6 w-6 text-yellow-500 animate-bounce" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-base mb-6 leading-relaxed">{stage.description}</p>
                        <div className="flex items-center justify-center space-x-6 mb-4">
                          <div className="flex items-center space-x-2 bg-blue-50 rounded-2xl px-4 py-2">
                            <Target className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">{stage.items.length} items</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-green-50 rounded-2xl px-4 py-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium text-green-700">{getStageProgress(stageIndex)}% complete</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 h-3 rounded-full transition-all duration-1000 ease-out shadow-md relative"
                            style={{ width: `${getStageProgress(stageIndex)}%` }}
                          >
                            <div className="absolute inset-0 bg-white/40 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  {/* Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {stage.items.map((item, itemIndex) => {
                      const isItemCompleted = isCompleted(stageIndex, itemIndex);
                      const isLeft = itemIndex % 2 === 0;
                      
                      return (
                        <div
                          key={itemIndex}
                          className={`relative ${isLeft ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}
                          style={{
                            opacity: visibleStages.has(stageIndex) ? 1 : 0,
                            transform: visibleStages.has(stageIndex) 
                              ? 'translateX(0) scale(1)' 
                              : `translateX(${isLeft ? '-60px' : '60px'}) scale(0.95)`,
                            transition: `all 0.6s ease-out ${itemIndex * 0.1}s`
                          }}
                        >
                          {/* Connection Line to Timeline */}
                          <div className={`hidden md:block absolute top-8 w-12 h-0.5 bg-gradient-to-r ${
                            isLeft ? 'from-purple-300 to-transparent right-0' : 'from-transparent to-purple-300 left-0'
                          } ${isItemCompleted ? 'from-green-400 to-transparent' : ''}`}></div>
                          
                          {/* Timeline Dot */}
                          <div className={`hidden md:block absolute top-7 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 ${
                            isItemCompleted ? 'bg-green-500 shadow-green-500/50 animate-pulse' : 'bg-gray-400'
                          } ${isLeft ? '-right-2' : '-left-2'}`}>
                            {isItemCompleted && (
                              <CheckCircle className="h-3 w-3 text-white absolute -inset-0.5" />
                            )}
                          </div>
  
                          {/* Item Card */}
                          <div 
                            className={`relative group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border cursor-pointer transform hover:-translate-y-2 ${
                              isItemCompleted 
                                ? 'border-green-200 bg-gradient-to-br from-green-50 to-white shadow-green-500/20' 
                                : 'border-white/50 hover:border-blue-300 shadow-purple-500/10'
                            }`}
                            onClick={() => setSelectedItem({...item, stageIndex, itemIndex})}
                          >
                            {/* Hover glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            
                            <div className="relative">
                              <div className="flex items-start justify-between mb-4">
                                <h3 className="font-bold text-gray-900 text-base leading-tight flex-1 mr-4">
                                  {item.name}
                                </h3>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCompletion(stageIndex, itemIndex);
                                  }}
                                  className="flex-shrink-0 transform transition-transform hover:scale-110"
                                >
                                  {isItemCompleted ? (
                                    <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
                                  ) : (
                                    <Circle className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors" />
                                  )}
                                </button>
                              </div>
  
                              <div className="flex items-center space-x-3 mb-4 flex-wrap gap-2">
                                {item.difficulty && (
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 hover:scale-105 ${
                                    getDifficultyTextColor(item.difficulty)
                                  }`}>
                                    {item.difficulty}
                                  </span>
                                )}
                                {item.timeCommitment && (
                                  <div className="flex items-center space-x-1 text-gray-500 bg-gray-50 rounded-full px-3 py-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-xs font-medium">{item.timeCommitment}</span>
                                  </div>
                                )}
                              </div>
  
                              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                {item.description ? item.description.split('\n')[0] : ''}
                              </p>
  
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:text-purple-600 transition-colors">
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  <span>Learn More</span>
                                  <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                                {isItemCompleted && (
                                  <div className="flex items-center space-x-1 text-green-600 text-xs font-medium">
                                    <Star className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
                                    <span>Completed!</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Modal for Selected Item */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div 
              className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20 animate-pulse"
              style={{
                animation: 'modalAppear 0.3s ease-out forwards'
              }}
            >
              <style jsx>{`
                @keyframes modalAppear {
                  from {
                    opacity: 0;
                    transform: scale(0.9) translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                  }
                }
              `}</style>
              
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent flex-1 mr-4">
                    {selectedItem.name}
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl transform hover:scale-110 transition-all hover:rotate-90"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6 flex-wrap gap-2">
                  {selectedItem.difficulty && (
                    <span className={`px-4 py-2 rounded-2xl text-sm font-semibold border ${
                      getDifficultyTextColor(selectedItem.difficulty)
                    }`}>
                      {selectedItem.difficulty}
                    </span>
                  )}
                  {selectedItem.timeCommitment && (
                    <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 rounded-2xl px-4 py-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{selectedItem.timeCommitment}</span>
                    </div>
                  )}
                  <span className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
                    isCompleted(selectedItem.stageIndex, selectedItem.itemIndex)
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {isCompleted(selectedItem.stageIndex, selectedItem.itemIndex) ? '✓ Completed' : 'Not Started'}
                  </span>
                </div>
  
                <div className="prose prose-sm max-w-none mb-6">
                  {selectedItem.description && selectedItem.description.split('\n').map((line, index) => (
                    <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>
                  ))}
                </div>
  
                {renderAdditionalFields(selectedItem)}
  
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => {
                      toggleCompletion(selectedItem.stageIndex, selectedItem.itemIndex);
                    }}
                    className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isCompleted(selectedItem.stageIndex, selectedItem.itemIndex)
                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25'
                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25'
                    }`}
                  >
                    {isCompleted(selectedItem.stageIndex, selectedItem.itemIndex) 
                      ? 'Mark as Incomplete' 
                      : 'Mark as Complete'
                    }
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-6 py-3 rounded-2xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <FooterSection></FooterSection> */}
      
      </>
    );
  };
  
export default Roadmap;



// const Roadmap = () => {
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [completedItems, setCompletedItems] = useState(new Set());
//   const [activeStage, setActiveStage] = useState(0);
//   const timelineRef = useRef(null);

//   const data = roadmapData;

//   const getDifficultyColor = (difficulty) => {
//     if (!difficulty) return "bg-gray-500";
    
//     const colors = {
//       "Easy": "bg-green-500",
//       "Beginner": "bg-green-500",
//       "Low": "bg-green-500",
//       "Medium": "bg-yellow-500",
//       "Intermediate": "bg-yellow-500",
//       "Moderate": "bg-yellow-500",
//       "Hard": "bg-red-500",
//       "Advanced": "bg-red-500",
//       "Expert": "bg-purple-500",
//       "High": "bg-red-500"
//     };
    
//     const normalizedDifficulty = difficulty.toLowerCase();
//     const matchedKey = Object.keys(colors).find(key => 
//       key.toLowerCase() === normalizedDifficulty
//     );
    
//     return colors[matchedKey] || "bg-gray-500";
//   };

//   const getDifficultyTextColor = (difficulty) => {
//     const colorMap = {
//       "bg-green-500": "text-green-700 bg-green-100",
//       "bg-yellow-500": "text-yellow-700 bg-yellow-100",
//       "bg-red-500": "text-red-700 bg-red-100",
//       "bg-purple-500": "text-purple-700 bg-purple-100",
//       "bg-gray-500": "text-gray-700 bg-gray-100"
//     };
//     return colorMap[getDifficultyColor(difficulty)] || "text-gray-700 bg-gray-100";
//   };

//   const toggleCompletion = (stageIndex, itemIndex) => {
//     const itemId = `${stageIndex}-${itemIndex}`;
//     const newCompleted = new Set(completedItems);
//     if (newCompleted.has(itemId)) {
//       newCompleted.delete(itemId);
//     } else {
//       newCompleted.add(itemId);
//     }
//     setCompletedItems(newCompleted);
//   };

//   const isCompleted = (stageIndex, itemIndex) => {
//     return completedItems.has(`${stageIndex}-${itemIndex}`);
//   };

//   const getStageProgress = (stageIndex) => {
//     const stage = data.stages[stageIndex];
//     const completedCount = stage.items.filter((_, itemIndex) => 
//       isCompleted(stageIndex, itemIndex)
//     ).length;
//     return Math.round((completedCount / stage.items.length) * 100);
//   };

//   const getTotalProgress = () => {
//     const totalItems = data.stages.reduce((sum, stage) => sum + stage.items.length, 0);
//     const completedCount = data.stages.reduce((sum, stage, stageIndex) => 
//       sum + stage.items.filter((_, itemIndex) => isCompleted(stageIndex, itemIndex)).length, 0
//     );
//     return Math.round((completedCount / totalItems) * 100);
//   };

//   const scrollToStage = (stageIndex) => {
//     setActiveStage(stageIndex);
//     const element = document.getElementById(`stage-${stageIndex}`);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
//     }
//   };

//   // Render additional fields
//   const renderAdditionalFields = (item) => {
//     const excludeFields = ['name', 'description', 'difficulty', 'timeCommitment'];
//     const additionalFields = Object.keys(item).filter(key => !excludeFields.includes(key));
    
//     if (additionalFields.length === 0) return null;

//     return (
//       <div className="mt-4 space-y-2">
//         <h4 className="text-sm font-semibold text-gray-700">Additional Information:</h4>
//         {additionalFields.map(field => (
//           <div key={field} className="flex">
//             <span className="text-xs font-medium text-gray-500 w-24 capitalize">
//               {field.replace(/([A-Z])/g, ' $1')}:
//             </span>
//             <span className="text-xs text-gray-700 flex-1">{String(item[field])}</span>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (!data) {
//     return (
//       <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading roadmap data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">{data.topic} Roadmap</h1>
//               <p className="text-gray-600 text-sm mt-1">Track your learning journey</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <Award className="h-5 w-5 text-yellow-500" />
//                 <span className="text-sm font-medium text-gray-700">{getTotalProgress()}% Complete</span>
//               </div>
//               <div className="w-32 bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${getTotalProgress()}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Stage Navigation */}
//         <div className="mb-8">
//           <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
//             {data.stages.map((stage, index) => (
//               <button
//                 key={index}
//                 onClick={() => scrollToStage(index)}
//                 className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
//                   activeStage === index 
//                     ? 'bg-blue-500 text-white shadow-lg' 
//                     : 'bg-white text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <span className="text-sm font-medium">Stage {index + 1}</span>
//                 <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Timeline Container */}
//         <div className="relative" ref={timelineRef}>
//           {/* Main Timeline Line */}
//           <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>

//           {/* Stages */}
//           <div className="space-y-16">
//             {data.stages.map((stage, stageIndex) => (
//               <div key={stageIndex} id={`stage-${stageIndex}`} className="relative">
//                 {/* Stage Header */}
//                 <div className="flex items-center justify-center mb-8">
//                   <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl text-center border-2 border-blue-100">
//                     <div className="flex items-center justify-center mb-3">
//                       <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
//                         {stageIndex + 1}
//                       </div>
//                       <h2 className="text-xl font-bold text-gray-900">{stage.title}</h2>
//                     </div>
//                     <p className="text-gray-600 text-sm mb-4">{stage.description}</p>
//                     <div className="flex items-center justify-center space-x-4">
//                       <div className="flex items-center space-x-1">
//                         <Target className="h-4 w-4 text-blue-500" />
//                         <span className="text-xs text-gray-600">{stage.items.length} items</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <CheckCircle className="h-4 w-4 text-green-500" />
//                         <span className="text-xs text-gray-600">{getStageProgress(stageIndex)}% complete</span>
//                       </div>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
//                       <div 
//                         className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${getStageProgress(stageIndex)}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Items Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
//                   {stage.items.map((item, itemIndex) => {
//                     const isItemCompleted = isCompleted(stageIndex, itemIndex);
//                     const isLeft = itemIndex % 2 === 0;
                    
//                     return (
//                       <div
//                         key={itemIndex}
//                         className={`relative ${isLeft ? 'md:pr-8' : 'md:pl-8 md:ml-auto'}`}
//                       >
//                         {/* Connection Line to Timeline */}
//                         <div className={`hidden md:block absolute top-6 w-8 h-0.5 bg-gray-300 ${
//                           isLeft ? 'right-0' : 'left-0'
//                         }`}></div>
                        
//                         {/* Timeline Dot */}
//                         <div className={`hidden md:block absolute top-5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
//                           isItemCompleted ? 'bg-green-500' : 'bg-gray-400'
//                         } ${isLeft ? '-right-1.5' : '-left-1.5'}`}></div>

//                         {/* Item Card */}
//                         <div 
//                           className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border cursor-pointer ${
//                             isItemCompleted 
//                               ? 'border-green-200 bg-green-50' 
//                               : 'border-gray-200 hover:border-blue-300'
//                           }`}
//                           onClick={() => setSelectedItem({...item, stageIndex, itemIndex})}
//                         >
//                           <div className="flex items-start justify-between mb-3">
//                             <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-3">
//                               {item.name}
//                             </h3>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 toggleCompletion(stageIndex, itemIndex);
//                               }}
//                               className="flex-shrink-0"
//                             >
//                               {isItemCompleted ? (
//                                 <CheckCircle className="h-5 w-5 text-green-500" />
//                               ) : (
//                                 <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
//                               )}
//                             </button>
//                           </div>

//                           <div className="flex items-center space-x-3 mb-3">
//                             {item.difficulty && (
//                               <span className={`px-2 py-1 rounded text-xs font-medium ${
//                                 getDifficultyTextColor(item.difficulty)
//                               }`}>
//                                 {item.difficulty}
//                               </span>
//                             )}
//                             {item.timeCommitment && (
//                               <div className="flex items-center space-x-1 text-gray-500">
//                                 <Clock className="h-3 w-3" />
//                                 <span className="text-xs">{item.timeCommitment}</span>
//                               </div>
//                             )}
//                           </div>

//                           <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
//                             {item.description ? item.description.split('\n')[0] : ''}
//                           </p>

//                           <div className="mt-3 flex items-center text-blue-600 text-xs font-medium">
//                             <BookOpen className="h-3 w-3 mr-1" />
//                             <span>Click to learn more</span>
//                             <ChevronRight className="h-3 w-3 ml-1" />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Modal for Selected Item */}
//       {selectedItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-start justify-between">
//                 <h3 className="text-xl font-bold text-gray-900 flex-1 mr-4">
//                   {selectedItem.name}
//                 </h3>
//                 <button
//                   onClick={() => setSelectedItem(null)}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <div className="flex items-center space-x-3 mb-4">
//                 {selectedItem.difficulty && (
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     getDifficultyTextColor(selectedItem.difficulty)
//                   }`}>
//                     {selectedItem.difficulty}
//                   </span>
//                 )}
//                 {selectedItem.timeCommitment && (
//                   <div className="flex items-center space-x-1 text-gray-500">
//                     <Clock className="h-4 w-4" />
//                     <span className="text-sm">{selectedItem.timeCommitment}</span>
//                   </div>
//                 )}
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   isCompleted(selectedItem.stageIndex, selectedItem.itemIndex)
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {isCompleted(selectedItem.stageIndex, selectedItem.itemIndex) ? 'Completed' : 'Not Started'}
//                 </span>
//               </div>

//               <div className="prose prose-sm max-w-none">
//                 {selectedItem.description && selectedItem.description.split('\n').map((line, index) => (
//                   <p key={index} className="mb-2 text-gray-700">{line}</p>
//                 ))}
//               </div>

//               {renderAdditionalFields(selectedItem)}

//               <div className="mt-6 flex space-x-3">
//                 <button
//                   onClick={() => {
//                     toggleCompletion(selectedItem.stageIndex, selectedItem.itemIndex);
//                     setSelectedItem({...selectedItem});
//                   }}
//                   className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
//                     isCompleted(selectedItem.stageIndex, selectedItem.itemIndex)
//                       ? 'bg-green-500 text-white hover:bg-green-600'
//                       : 'bg-blue-500 text-white hover:bg-blue-600'
//                   }`}
//                 >
//                   {isCompleted(selectedItem.stageIndex, selectedItem.itemIndex) 
//                     ? 'Mark as Incomplete' 
//                     : 'Mark as Complete'
//                   }
//                 </button>
//                 <button
//                   onClick={() => setSelectedItem(null)}
//                   className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Roadmap;




