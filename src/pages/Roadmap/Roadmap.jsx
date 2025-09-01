import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Clock, CheckCircle, Circle, BookOpen, Target, Award } from 'lucide-react';
import roadmapData from "../../../src/data/c_roadmap.json";
// import roadmapData from "../../../src/data/python_roadmap.json";

const Roadmap = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());
  const [activeStage, setActiveStage] = useState(0);
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
      "bg-green-500": "text-green-700 bg-green-100",
      "bg-yellow-500": "text-yellow-700 bg-yellow-100",
      "bg-red-500": "text-red-700 bg-red-100",
      "bg-purple-500": "text-purple-700 bg-purple-100",
      "bg-gray-500": "text-gray-700 bg-gray-100"
    };
    return colorMap[getDifficultyColor(difficulty)] || "text-gray-700 bg-gray-100";
  };

  const toggleCompletion = (stageIndex, itemIndex) => {
    const itemId = `${stageIndex}-${itemIndex}`;
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.topic} Roadmap</h1>
              <p className="text-gray-600 text-sm mt-1">Track your learning journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">{getTotalProgress()}% Complete</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getTotalProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stage Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
            {data.stages.map((stage, index) => (
              <button
                key={index}
                onClick={() => scrollToStage(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeStage === index 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm font-medium">Stage {index + 1}</span>
                <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative" ref={timelineRef}>
          {/* Main Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>

          {/* Stages */}
          <div className="space-y-16">
            {data.stages.map((stage, stageIndex) => (
              <div key={stageIndex} id={`stage-${stageIndex}`} className="relative">
                {/* Stage Header */}
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl text-center border-2 border-blue-100">
                    <div className="flex items-center justify-center mb-3">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                        {stageIndex + 1}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{stage.title}</h2>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{stage.description}</p>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-gray-600">{stage.items.length} items</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-gray-600">{getStageProgress(stageIndex)}% complete</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getStageProgress(stageIndex)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                  {stage.items.map((item, itemIndex) => {
                    const isItemCompleted = isCompleted(stageIndex, itemIndex);
                    const isLeft = itemIndex % 2 === 0;
                    
                    return (
                      <div
                        key={itemIndex}
                        className={`relative ${isLeft ? 'md:pr-8' : 'md:pl-8 md:ml-auto'}`}
                      >
                        {/* Connection Line to Timeline */}
                        <div className={`hidden md:block absolute top-6 w-8 h-0.5 bg-gray-300 ${
                          isLeft ? 'right-0' : 'left-0'
                        }`}></div>
                        
                        {/* Timeline Dot */}
                        <div className={`hidden md:block absolute top-5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                          isItemCompleted ? 'bg-green-500' : 'bg-gray-400'
                        } ${isLeft ? '-right-1.5' : '-left-1.5'}`}></div>

                        {/* Item Card */}
                        <div 
                          className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border cursor-pointer ${
                            isItemCompleted 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedItem({...item, stageIndex, itemIndex})}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-3">
                              {item.name}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompletion(stageIndex, itemIndex);
                              }}
                              className="flex-shrink-0"
                            >
                              {isItemCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center space-x-3 mb-3">
                            {item.difficulty && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                getDifficultyTextColor(item.difficulty)
                              }`}>
                                {item.difficulty}
                              </span>
                            )}
                            {item.timeCommitment && (
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">{item.timeCommitment}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                            {item.description ? item.description.split('\n')[0] : ''}
                          </p>

                          <div className="mt-3 flex items-center text-blue-600 text-xs font-medium">
                            <BookOpen className="h-3 w-3 mr-1" />
                            <span>Click to learn more</span>
                            <ChevronRight className="h-3 w-3 ml-1" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex-1 mr-4">
                  {selectedItem.name}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {selectedItem.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getDifficultyTextColor(selectedItem.difficulty)
                  }`}>
                    {selectedItem.difficulty}
                  </span>
                )}
                {selectedItem.timeCommitment && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{selectedItem.timeCommitment}</span>
                  </div>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCompleted(selectedItem.stageIndex, selectedItem.itemIndex)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isCompleted(selectedItem.stageIndex, selectedItem.itemIndex) ? 'Completed' : 'Not Started'}
                </span>
              </div>

              <div className="prose prose-sm max-w-none">
                {selectedItem.description && selectedItem.description.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 text-gray-700">{line}</p>
                ))}
              </div>

              {renderAdditionalFields(selectedItem)}

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    toggleCompletion(selectedItem.stageIndex, selectedItem.itemIndex);
                    setSelectedItem({...selectedItem});
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isCompleted(selectedItem.stageIndex, selectedItem.itemIndex)
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isCompleted(selectedItem.stageIndex, selectedItem.itemIndex) 
                    ? 'Mark as Incomplete' 
                    : 'Mark as Complete'
                  }
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;







// import React, { useRef, useEffect, useState } from 'react';
// import * as d3 from 'd3';

// const Roadmap = ({ roadmapData }) => {
//   const svgRef = useRef();
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [completedItems, setCompletedItems] = useState(new Set());

//   // Default data for demonstration - your AI agent will replace this
//   const defaultRoadmapData = {
//     "topic": "Learn Python Programming",
//     "introduction": "This roadmap is designed to guide aspiring programmers through a comprehensive journey of learning Python, from foundational concepts to advanced topics and practical application.",
//     "stages": [
//       {
//         "title": "Stage 1: Python Fundamentals & Setup",
//         "description": "This stage covers the absolute basics of Python programming, including setting up your development environment.",
//         "items": [
//           {
//             "name": "1.1 Introduction to Python & Environment Setup",
//             "description": "Learning Outcomes: Understand what Python is used for, install Python, set up a development environment.\nTime Commitment: 4-6 hours\nDifficulty: Easy",
//             "difficulty": "Easy",
//             "timeCommitment": "4-6 hours"
//           },
//           {
//             "name": "1.2 Variables, Data Types & Operators",
//             "description": "Learning Outcomes: Define and use variables, understand fundamental data types.\nTime Commitment: 6-8 hours\nDifficulty: Easy",
//             "difficulty": "Easy",
//             "timeCommitment": "6-8 hours"
//           }
//         ]
//       },
//       {
//         "title": "Stage 2: Core Data Structures & Control Flow",
//         "description": "This stage delves into Python's fundamental data structures.",
//         "items": [
//           {
//             "name": "2.1 Lists & Tuples",
//             "description": "Learning Outcomes: Create, manipulate, and iterate over lists and tuples.\nTime Commitment: 7-9 hours\nDifficulty: Medium",
//             "difficulty": "Medium",
//             "timeCommitment": "7-9 hours"
//           },
//           {
//             "name": "2.2 Functions",
//             "description": "Learning Outcomes: Define and call functions, pass arguments, return values.\nTime Commitment: 8-10 hours\nDifficulty: Medium",
//             "difficulty": "Medium",
//             "timeCommitment": "8-10 hours"
//           }
//         ]
//       }
//     ]
//   };

//   // Use provided data or fall back to default
//   const data = roadmapData || defaultRoadmapData;

//   const transformDataForTree = (inputData) => {
//     const root = {
//       name: inputData.topic,
//       type: "root",
//       description: inputData.introduction,
//       children: inputData.stages.map((stage, stageIndex) => ({
//         name: stage.title,
//         type: "stage",
//         description: stage.description,
//         stageIndex,
//         children: stage.items.map((item, itemIndex) => ({
//           name: item.name,
//           type: "item",
//           description: item.description,
//           difficulty: item.difficulty,
//           timeCommitment: item.timeCommitment,
//           id: `${stageIndex}-${itemIndex}`,
//           stageIndex,
//           itemIndex,
//           // Support additional fields from different topics
//           ...item
//         }))
//       }))
//     };
//     return root;
//   };

//   const getDifficultyColor = (difficulty) => {
//     if (!difficulty) return "#6b7280";
    
//     const colors = {
//       "Easy": "#22c55e",
//       "Beginner": "#22c55e",
//       "Low": "#22c55e",
//       "Medium": "#f59e0b",
//       "Intermediate": "#f59e0b",
//       "Moderate": "#f59e0b",
//       "Hard": "#ef4444",
//       "Advanced": "#ef4444",
//       "Expert": "#dc2626",
//       "High": "#ef4444"
//     };
    
//     // Case-insensitive matching
//     const normalizedDifficulty = difficulty.toLowerCase();
//     const matchedKey = Object.keys(colors).find(key => 
//       key.toLowerCase() === normalizedDifficulty
//     );
    
//     return colors[matchedKey] || "#6b7280";
//   };

//   const getNodeColor = (d) => {
//     if (d.data.type === "root") return "#8b5cf6";
//     if (d.data.type === "stage") return "#3b82f6";
//     return getDifficultyColor(d.data.difficulty);
//   };

//   const toggleCompletion = (nodeId) => {
//     const newCompleted = new Set(completedItems);
//     if (newCompleted.has(nodeId)) {
//       newCompleted.delete(nodeId);
//     } else {
//       newCompleted.add(nodeId);
//     }
//     setCompletedItems(newCompleted);
//   };

//   useEffect(() => {
//     if (!data || !data.stages) return;

//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = 1200;
//     const height = 800;
//     const margin = { top: 50, right: 50, bottom: 50, left: 50 };

//     svg.attr("width", width).attr("height", height);

//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

//     // Create zoom behavior
//     const zoom = d3.zoom()
//       .scaleExtent([0.1, 3])
//       .on("zoom", (event) => {
//         g.attr("transform", event.transform);
//       });

//     svg.call(zoom);

//     const root = d3.hierarchy(transformDataForTree(data));
//     const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

//     treeLayout(root);

//     // Add links
//     const links = g.selectAll(".link")
//       .data(root.links())
//       .enter()
//       .append("path")
//       .attr("class", "link")
//       .attr("d", d3.linkHorizontal()
//         .x(d => d.y)
//         .y(d => d.x))
//       .attr("fill", "none")
//       .attr("stroke", "#94a3b8")
//       .attr("stroke-width", 2)
//       .attr("opacity", 0.6);

//     // Add nodes
//     const nodes = g.selectAll(".node")
//       .data(root.descendants())
//       .enter()
//       .append("g")
//       .attr("class", "node")
//       .attr("transform", d => `translate(${d.y},${d.x})`)
//       .style("cursor", "pointer");

//     // Add circles for nodes
//     nodes.append("circle")
//       .attr("r", d => {
//         if (d.data.type === "root") return 12;
//         if (d.data.type === "stage") return 8;
//         return 6;
//       })
//       .attr("fill", d => getNodeColor(d))
//       .attr("stroke", d => completedItems.has(d.data.id) ? "#10b981" : "#fff")
//       .attr("stroke-width", d => completedItems.has(d.data.id) ? 3 : 2)
//       .on("click", (event, d) => {
//         event.stopPropagation();
//         setSelectedNode(d.data);
//         if (d.data.type === "item") {
//           toggleCompletion(d.data.id);
//         }
//       });

//     // Add completion checkmark for completed items
//     nodes
//       .filter(d => d.data.type === "item" && completedItems.has(d.data.id))
//       .append("text")
//       .attr("text-anchor", "middle")
//       .attr("dy", "0.3em")
//       .attr("font-size", "10px")
//       .attr("fill", "white")
//       .text("✓");

//     // Add labels
//     nodes.append("text")
//       .attr("dy", d => d.data.type === "root" ? -18 : d.data.type === "stage" ? -14 : -12)
//       .attr("text-anchor", "middle")
//       .attr("font-size", d => {
//         if (d.data.type === "root") return "14px";
//         if (d.data.type === "stage") return "12px";
//         return "10px";
//       })
//       .attr("font-weight", d => d.data.type === "root" ? "bold" : d.data.type === "stage" ? "600" : "normal")
//       .attr("fill", "#1f2937")
//       .each(function(d) {
//         const text = d3.select(this);
//         const words = d.data.name.split(/\s+/);
//         const maxWidth = d.data.type === "root" ? 200 : d.data.type === "stage" ? 150 : 120;
        
//         text.text("");
//         let line = [];
//         let lineNumber = 0;
//         const lineHeight = 1.1;

//         words.forEach(word => {
//           line.push(word);
//           text.text(line.join(" "));
//           if (text.node().getComputedTextLength() > maxWidth && line.length > 1) {
//             line.pop();
//             text.text(line.join(" "));
//             text.append("tspan")
//               .attr("x", 0)
//               .attr("dy", `${lineHeight}em`)
//               .text(word);
//             line = [word];
//             lineNumber++;
//           }
//         });
//       });

//     // Initial zoom to fit
//     const bounds = g.node().getBBox();
//     const fullWidth = width;
//     const fullHeight = height;
//     const widthScale = fullWidth / bounds.width;
//     const heightScale = fullHeight / bounds.height;
//     const scale = Math.min(widthScale, heightScale) * 0.8;
    
//     svg.call(zoom.transform, d3.zoomIdentity
//       .translate(fullWidth / 2 - bounds.width * scale / 2, fullHeight / 2 - bounds.height * scale / 2)
//       .scale(scale));

//   }, [completedItems, data]);

//   // Calculate progress
//   const completionPercentage = data.stages ? data.stages.reduce((total, stage) => {
//     const stageCompleted = stage.items.filter((item, itemIndex) => 
//       completedItems.has(`${data.stages.indexOf(stage)}-${itemIndex}`)
//     ).length;
//     return total + stageCompleted;
//   }, 0) : 0;

//   const totalItems = data.stages ? data.stages.reduce((total, stage) => total + stage.items.length, 0) : 0;
//   const progressPercent = totalItems > 0 ? Math.round((completionPercentage / totalItems) * 100) : 0;

//   // Render additional fields in the side panel
//   const renderAdditionalFields = (nodeData) => {
//     const excludeFields = ['name', 'description', 'type', 'difficulty', 'timeCommitment', 'id', 'stageIndex', 'itemIndex'];
//     const additionalFields = Object.keys(nodeData).filter(key => !excludeFields.includes(key));
    
//     if (additionalFields.length === 0) return null;

//     return (
//       <div className="mt-4">
//         <h4 className="text-sm font-semibold text-gray-800 mb-2">Additional Information:</h4>
//         {additionalFields.map(field => (
//           <div key={field} className="mb-2">
//             <span className="text-xs font-medium text-gray-600 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span>
//             <span className="text-sm text-gray-700 ml-2">{String(nodeData[field])}</span>
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
//     <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       {/* Header */}
//       <div className="mb-4 bg-white rounded-lg shadow-md p-4">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.topic} Roadmap</h1>
//         <div className="flex items-center gap-4">
//           <div className="flex-1 bg-gray-200 rounded-full h-3">
//             <div 
//               className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
//               style={{ width: `${progressPercent}%` }}
//             ></div>
//           </div>
//           <span className="text-sm font-medium text-gray-600">
//             {completionPercentage}/{totalItems} completed ({progressPercent}%)
//           </span>
//         </div>
//       </div>

//       <div className="flex gap-4 h-full">
//         {/* Tree visualization */}
//         <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
//           <svg ref={svgRef} className="w-full h-full"></svg>
//         </div>

//         {/* Side panel */}
//         {selectedNode && (
//           <div className="w-96 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
//             <h3 className="text-lg font-bold text-gray-800 mb-3">{selectedNode.name}</h3>
            
//             {selectedNode.type === "item" && (
//               <div className="mb-4 flex items-center gap-3 flex-wrap">
//                 {selectedNode.difficulty && (
//                   <span className={`px-2 py-1 rounded text-xs font-medium ${
//                     getDifficultyColor(selectedNode.difficulty) === "#22c55e" ? "bg-green-100 text-green-800" :
//                     getDifficultyColor(selectedNode.difficulty) === "#f59e0b" ? "bg-yellow-100 text-yellow-800" :
//                     "bg-red-100 text-red-800"
//                   }`}>
//                     {selectedNode.difficulty}
//                   </span>
//                 )}
//                 {selectedNode.timeCommitment && (
//                   <span className="text-sm text-gray-600">{selectedNode.timeCommitment}</span>
//                 )}
//                 {completedItems.has(selectedNode.id) && (
//                   <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
//                     ✓ Completed
//                   </span>
//                 )}
//               </div>
//             )}

//             <div className="text-gray-700 text-sm leading-relaxed">
//               {selectedNode.description && selectedNode.description.split('\n').map((line, index) => (
//                 <p key={index} className="mb-2">{line}</p>
//               ))}
//             </div>

//             {/* Render additional fields */}
//             {renderAdditionalFields(selectedNode)}

//             {selectedNode.type === "item" && (
//               <button
//                 onClick={() => toggleCompletion(selectedNode.id)}
//                 className={`mt-4 w-full px-4 py-2 rounded font-medium transition-colors ${
//                   completedItems.has(selectedNode.id)
//                     ? "bg-green-500 text-white hover:bg-green-600"
//                     : "bg-blue-500 text-white hover:bg-blue-600"
//                 }`}
//               >
//                 {completedItems.has(selectedNode.id) ? "Mark as Incomplete" : "Mark as Complete"}
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Legend */}
//       <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4">
//         <h4 className="text-sm font-bold text-gray-800 mb-2">Legend</h4>
//         <div className="flex flex-col gap-2 text-xs">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-purple-500"></div>
//             <span>Root Topic</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//             <span>Learning Stage</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-green-500"></div>
//             <span>Easy/Beginner</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//             <span>Medium/Intermediate</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-red-500"></div>
//             <span>Hard/Advanced</span>
//           </div>
//         </div>
//         <div className="mt-2 text-xs text-gray-600">
//           Click items to mark complete • Zoom and pan to explore
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Roadmap;