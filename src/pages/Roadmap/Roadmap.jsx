import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const Roadmap = () => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());

  const roadmapData = {
    "topic": "Learn Python Programming",
    "introduction": "This roadmap is designed to guide aspiring programmers through a comprehensive journey of learning Python, from foundational concepts to advanced topics and practical application.",
    "stages": [
      {
        "title": "Stage 1: Python Fundamentals & Setup",
        "description": "This stage covers the absolute basics of Python programming, including setting up your development environment, understanding core syntax, variables, data types, and basic control flow.",
        "items": [
          {
            "name": "1.1 Introduction to Python & Environment Setup",
            "description": "Learning Outcomes: Understand what Python is used for, install Python, set up a development environment (IDE/text editor), and run your first 'Hello World' program.\nTime Commitment: 4-6 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "4-6 hours"
          },
          {
            "name": "1.2 Variables, Data Types & Operators",
            "description": "Learning Outcomes: Define and use variables, understand fundamental data types (integers, floats, strings, booleans), and apply arithmetic, comparison, and logical operators.\nTime Commitment: 6-8 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "6-8 hours"
          },
          {
            "name": "1.3 Basic Input/Output & Type Conversion",
            "description": "Learning Outcomes: Take user input using input(), display output using print(), and convert between different data types.\nTime Commitment: 3-4 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "3-4 hours"
          },
          {
            "name": "1.4 Conditional Statements (if/elif/else)",
            "description": "Learning Outcomes: Implement decision-making logic using if, elif, and else statements. Understand indentation and logical flow.\nTime Commitment: 5-7 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "5-7 hours"
          }
        ]
      },
      {
        "title": "Stage 2: Core Data Structures & Control Flow",
        "description": "This stage delves into Python's fundamental data structures for organizing data and introduces more advanced control flow mechanisms like loops and functions.",
        "items": [
          {
            "name": "2.1 Lists & Tuples",
            "description": "Learning Outcomes: Create, manipulate, and iterate over lists and tuples. Understand their differences and when to use each.\nTime Commitment: 7-9 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "7-9 hours"
          },
          {
            "name": "2.2 Dictionaries & Sets",
            "description": "Learning Outcomes: Create, manipulate, and iterate over dictionaries (key-value pairs) and sets (unique elements).\nTime Commitment: 7-9 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "7-9 hours"
          },
          {
            "name": "2.3 Loops (for & while)",
            "description": "Learning Outcomes: Use for loops to iterate over sequences and while loops for conditional repetition.\nTime Commitment: 6-8 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "6-8 hours"
          },
          {
            "name": "2.4 Functions",
            "description": "Learning Outcomes: Define and call functions, pass arguments, return values, understand scope.\nTime Commitment: 8-10 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "8-10 hours"
          }
        ]
      },
      {
        "title": "Stage 3: Modularity, Error Handling & File I/O",
        "description": "This stage focuses on making your code more organized, robust, and capable of interacting with external data sources.",
        "items": [
          {
            "name": "3.1 Modules & Packages",
            "description": "Learning Outcomes: Create and import custom modules, understand how to organize code into packages.\nTime Commitment: 5-7 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "5-7 hours"
          },
          {
            "name": "3.2 Error and Exception Handling",
            "description": "Learning Outcomes: Understand different types of errors, use try, except, else, and finally blocks.\nTime Commitment: 6-8 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "6-8 hours"
          },
          {
            "name": "3.3 File Input/Output (I/O)",
            "description": "Learning Outcomes: Open, read from, and write to text files. Understand different file modes.\nTime Commitment: 7-9 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "7-9 hours"
          }
        ]
      },
      {
        "title": "Stage 4: Object-Oriented Programming (OOP)",
        "description": "This stage introduces the powerful paradigm of Object-Oriented Programming (OOP), essential for building complex applications.",
        "items": [
          {
            "name": "4.1 Classes & Objects",
            "description": "Learning Outcomes: Define classes, create objects (instances), understand attributes and methods.\nTime Commitment: 8-10 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "8-10 hours"
          },
          {
            "name": "4.2 Inheritance & Polymorphism",
            "description": "Learning Outcomes: Understand inheritance for code reuse, create subclasses, override methods.\nTime Commitment: 7-9 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "7-9 hours"
          },
          {
            "name": "4.3 Encapsulation & Abstraction",
            "description": "Learning Outcomes: Understand encapsulation through private/protected attributes, use properties.\nTime Commitment: 6-8 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "6-8 hours"
          }
        ]
      },
      {
        "title": "Stage 5: Advanced Topics & Standard Libraries",
        "description": "This stage introduces more advanced Python features and explores Python's extensive standard library.",
        "items": [
          {
            "name": "5.1 Generators & Decorators",
            "description": "Learning Outcomes: Understand and implement generators for memory-efficient iteration, use decorators.\nTime Commitment: 8-10 hours\nDifficulty: Hard",
            "difficulty": "Hard",
            "timeCommitment": "8-10 hours"
          },
          {
            "name": "5.2 Context Managers (with statement)",
            "description": "Learning Outcomes: Understand context managers for resource management.\nTime Commitment: 4-6 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "4-6 hours"
          },
          {
            "name": "5.3 Working with Standard Libraries",
            "description": "Learning Outcomes: Utilize common modules from Python's standard library (os, sys, datetime, json).\nTime Commitment: 10-12 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "10-12 hours"
          },
          {
            "name": "5.4 Introduction to Third-Party Libraries",
            "description": "Learning Outcomes: Install and use third-party libraries using pip (requests, pandas, numpy).\nTime Commitment: 8-10 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "8-10 hours"
          }
        ]
      },
      {
        "title": "Stage 6: Practical Application & Project Development",
        "description": "This final stage focuses on consolidating knowledge through larger projects and introducing best practices.",
        "items": [
          {
            "name": "6.1 Version Control with Git & GitHub",
            "description": "Learning Outcomes: Understand version control basics, use Git repositories, work with GitHub.\nTime Commitment: 10-12 hours\nDifficulty: Medium",
            "difficulty": "Medium",
            "timeCommitment": "10-12 hours"
          },
          {
            "name": "6.2 Virtual Environments",
            "description": "Learning Outcomes: Create and manage virtual environments, handle project dependencies.\nTime Commitment: 3-5 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "3-5 hours"
          },
          {
            "name": "6.3 Introduction to a Python Framework/Domain",
            "description": "Learning Outcomes: Choose a specialization path (Web Dev, Data Science, GUI, Automation).\nTime Commitment: 15-20 hours\nDifficulty: Medium to Hard",
            "difficulty": "Hard",
            "timeCommitment": "15-20 hours"
          },
          {
            "name": "6.4 Final Capstone Project",
            "description": "Learning Outcomes: Apply all learned concepts to build a significant project from scratch.\nTime Commitment: 20-40 hours\nDifficulty: Hard",
            "difficulty": "Hard",
            "timeCommitment": "20-40 hours"
          },
        ]
      }
    ]
  };

  const transformDataForTree = (data) => {
    const root = {
      name: data.topic,
      type: "root",
      description: data.introduction,
      children: data.stages.map((stage, stageIndex) => ({
        name: stage.title,
        type: "stage",
        description: stage.description,
        stageIndex,
        children: stage.items.map((item, itemIndex) => ({
          name: item.name,
          type: "item",
          description: item.description,
          difficulty: item.difficulty,
          timeCommitment: item.timeCommitment,
          id: `${stageIndex}-${itemIndex}`,
          stageIndex,
          itemIndex
        }))
      }))
    };
    return root;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      "Easy": "#22c55e",
      "Medium": "#f59e0b",
      "Hard": "#ef4444"
    };
    return colors[difficulty] || "#6b7280";
  };

  const getNodeColor = (d) => {
    if (d.data.type === "root") return "#8b5cf6";
    if (d.data.type === "stage") return "#3b82f6";
    return getDifficultyColor(d.data.difficulty);
  };

  const toggleCompletion = (nodeId) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(nodeId)) {
      newCompleted.delete(nodeId);
    } else {
      newCompleted.add(nodeId);
    }
    setCompletedItems(newCompleted);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1400;
    const height = 1800;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    svg.attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const root = d3.hierarchy(transformDataForTree(roadmapData));
    // const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    const treeLayout = d3.tree().nodeSize([60, 250]); 

  //   const treeLayout = d3.tree()
  // .nodeSize([40, 250]) // base spacing
  // .separation((a, b) => {
  //   // Stage nodes (depth 1) are closer
  //   if (a.data.type === "stage" && b.data.type === "stage") return 0.1; 

  //   // Items under a stage (depth 2) are spread more
  //   if (a.data.type === "item" && b.data.type === "item") return 3.5;

  //   // Default spacing
  //   return 1.5;
  // });


    treeLayout(root);

    // Add links
    const links = g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6);

    // Add nodes
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer");

    // Add circles for nodes
    nodes.append("circle")
      .attr("r", d => {
        if (d.data.type === "root") return 12;
        if (d.data.type === "stage") return 8;
        return 6;
      })
      .attr("fill", d => getNodeColor(d))
      .attr("stroke", d => completedItems.has(d.data.id) ? "#10b981" : "#fff")
      .attr("stroke-width", d => completedItems.has(d.data.id) ? 3 : 2)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.data);
        if (d.data.type === "item") {
          toggleCompletion(d.data.id);
        }
      });

    // Add completion checkmark for completed items
    nodes
      .filter(d => d.data.type === "item" && completedItems.has(d.data.id))
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .text("✓");

    // Calculate text dimensions for each node
    const textDimensions = new Map();

    // Temporarily create text elements to measure them
    const tempText = g.selectAll(".temp-text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("font-size", d => {
        if (d.data.type === "root") return "14px";
        if (d.data.type === "stage") return "12px";
        return "10px";
      })
      .attr("font-weight", d => d.data.type === "root" ? "bold" : d.data.type === "stage" ? "600" : "normal")
      .each(function(d) {
        const text = d3.select(this);
        const words = d.data.name.split(/\s+/);
        const maxWidth = d.data.type === "root" ? 200 : d.data.type === "stage" ? 150 : 120;
        
        text.text("");
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        let lines = [];

        words.forEach(word => {
          line.push(word);
          text.text(line.join(" "));
          if (text.node().getComputedTextLength() > maxWidth && line.length > 1) {
            line.pop();
            lines.push(line.join(" "));
            line = [word];
            lineNumber++;
          }
        });
        if (line.length > 0) {
          lines.push(line.join(" "));
        }

        // Calculate dimensions
        const fontSize = parseInt(text.attr("font-size"));
        const textWidth = Math.max(...lines.map(lineText => {
          text.text(lineText);
          return text.node().getComputedTextLength();
        }));
        const textHeight = lines.length * fontSize * lineHeight;
        
        textDimensions.set(d, {
          width: textWidth + 16, // Add padding
          height: textHeight + 12, // Add padding
          lines: lines,
          lineHeight: lineHeight,
          fontSize: fontSize
        });
      });

    // Remove temporary text elements
    tempText.remove();

    // Add background rectangles
    nodes.append("rect")
      .attr("class", "text-background")
      .attr("x", d => {
        const dims = textDimensions.get(d);
        return -dims.width / 2;
      })
      .attr("y", d => {
        const dims = textDimensions.get(d);
        const yOffset = d.data.type === "root" ? -25 : d.data.type === "stage" ? -35 : -18;
        return yOffset - dims.fontSize + dims.fontSize * 0.2 - 6; // Adjust for padding
      })
      .attr("width", d => textDimensions.get(d).width)
      .attr("height", d => textDimensions.get(d).height)
      .attr("fill", "yellow")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("rx", 4) // Border radius
      .attr("ry", 4);

    // Add labels
    nodes.append("text")
      // .attr("dy", d => d.data.type === "root" ? -18 : d.data.type === "stage" ? -14 : -12)
      
      .attr("dy", d => 
        d.data.type === "root" ? -25 :   // was -18
        d.data.type === "stage" ? -35 :  // was -14
        -18                              // was -12
      )
      
      .attr("text-anchor", "middle")
      .attr("font-size", d => {
        if (d.data.type === "root") return "14px";
        if (d.data.type === "stage") return "12px";
        return "10px";
      })
      .attr("font-weight", d => d.data.type === "root" ? "bold" : d.data.type === "stage" ? "600" : "normal")
      .attr("fill", "#1f2937")
      .each(function(d) {
        const text = d3.select(this);
        const dims = textDimensions.get(d);
        
        text.text("");
        dims.lines.forEach((lineText, index) => {
          if (index === 0) {
            text.text(lineText);
          } else {
            text.append("tspan")
              .attr("x", 0)
              .attr("dy", `${dims.lineHeight}em`)
              .text(lineText);
          }
        });
      });

    // Initial zoom to fit
    const bounds = g.node().getBBox();
    const fullWidth = width;
    const fullHeight = height;
    const widthScale = fullWidth / bounds.width;
    const heightScale = fullHeight / bounds.height;
    const scale = Math.min(widthScale, heightScale) * 0.8;
    
    svg.call(zoom.transform, d3.zoomIdentity
      .translate(fullWidth / 2 - bounds.width * scale / 2, fullHeight / 2 - bounds.height * scale / 2)
      .scale(scale));

  }, [completedItems]);

  const completionPercentage = roadmapData.stages.reduce((total, stage) => {
    const stageCompleted = stage.items.filter((item, itemIndex) => 
      completedItems.has(`${roadmapData.stages.indexOf(stage)}-${itemIndex}`)
    ).length;
    return total + stageCompleted;
  }, 0);

  const totalItems = roadmapData.stages.reduce((total, stage) => total + stage.items.length, 0);
  const progressPercent = Math.round((completionPercentage / totalItems) * 100);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="mb-4 bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Python Learning Roadmap</h1>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-600">
            {completionPercentage}/{totalItems} completed ({progressPercent}%)
          </span>
        </div>
      </div>

      <div className="flex gap-4 h-full">
        {/* Tree visualization */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>

        {/* Side panel */}
        {selectedNode && (
          <div className="w-96 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-3">{selectedNode.name}</h3>
            
            {selectedNode.type === "item" && (
              <div className="mb-4 flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedNode.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                  selectedNode.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {selectedNode.difficulty}
                </span>
                <span className="text-sm text-gray-600">{selectedNode.timeCommitment}</span>
                {completedItems.has(selectedNode.id) && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    ✓ Completed
                  </span>
                )}
              </div>
            )}

            <div className="text-gray-700 text-sm leading-relaxed">
              {selectedNode.description.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>

            {selectedNode.type === "item" && (
              <button
                onClick={() => toggleCompletion(selectedNode.id)}
                className={`mt-4 w-full px-4 py-2 rounded font-medium transition-colors ${
                  completedItems.has(selectedNode.id)
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {completedItems.has(selectedNode.id) ? "Mark as Incomplete" : "Mark as Complete"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-bold text-gray-800 mb-2">Legend</h4>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Root Topic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Learning Stage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Easy Item</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium Item</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Hard Item</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Click items to mark complete • Zoom and pan to explore
        </div>
      </div>
    </div>
  );
};

export default Roadmap;

























// import React, { useState, useRef, useEffect } from 'react';
// import { ChevronRight, Clock, CheckCircle, Circle, BookOpen, Target, Award } from 'lucide-react';
// import { Star, Zap, Trophy } from 'lucide-react';
// import roadmapData from "../../../src/data/c_roadmap.json";
// import FooterSection from '../../components/LandingPage/sections/FooterSection';
// import Navigation from '../../components/LandingPage/components/Navigation';
// // import roadmapData from "../../../src/data/python_roadmap.json";
// import * as Tone from 'tone';


// const Roadmap = () => {
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [completedItems, setCompletedItems] = useState(new Set());
//     const [activeStage, setActiveStage] = useState(0);
//     const [visibleStages, setVisibleStages] = useState(new Set([0]));
//     const [showConfetti, setShowConfetti] = useState(false);
//     const timelineRef = useRef(null);
//      const data = roadmapData;
  
//     const getDifficultyColor = (difficulty) => {
//       if (!difficulty) return "bg-gray-500";
      
//       const colors = {
//         "Easy": "bg-green-500",
//         "Beginner": "bg-green-500",
//         "Low": "bg-green-500",
//         "Medium": "bg-yellow-500",
//         "Intermediate": "bg-yellow-500",
//         "Moderate": "bg-yellow-500",
//         "Hard": "bg-red-500",
//         "Advanced": "bg-red-500",
//         "Expert": "bg-purple-500",
//         "High": "bg-red-500"
//       };
      
//       const normalizedDifficulty = difficulty.toLowerCase();
//       const matchedKey = Object.keys(colors).find(key => 
//         key.toLowerCase() === normalizedDifficulty
//       );
      
//       return colors[matchedKey] || "bg-gray-500";
//     };
  
//     const getDifficultyTextColor = (difficulty) => {
//       const colorMap = {
//         "bg-green-500": "text-green-700 bg-green-100 border-green-200",
//         "bg-yellow-500": "text-yellow-700 bg-yellow-100 border-yellow-200",
//         "bg-red-500": "text-red-700 bg-red-100 border-red-200",
//         "bg-purple-500": "text-purple-700 bg-purple-100 border-purple-200",
//         "bg-gray-500": "text-gray-700 bg-gray-100 border-gray-200"
//       };
//       return colorMap[getDifficultyColor(difficulty)] || "text-gray-700 bg-gray-100 border-gray-200";
//     };
  
//     const toggleCompletion = (stageIndex, itemIndex) => {
//       const itemId = `${stageIndex}-${itemIndex}`;
//       const newCompleted = new Set(completedItems);
//       if (newCompleted.has(itemId)) {
//         newCompleted.delete(itemId);
//       } else {
//         newCompleted.add(itemId);
//         // Show confetti animation for completion
//         triggerConfetti();
//       }
//       setCompletedItems(newCompleted);
//     };
  
//     const isCompleted = (stageIndex, itemIndex) => {
//       return completedItems.has(`${stageIndex}-${itemIndex}`);
//     };
  
//     const getStageProgress = (stageIndex) => {
//       const stage = data.stages[stageIndex];
//       const completedCount = stage.items.filter((_, itemIndex) => 
//         isCompleted(stageIndex, itemIndex)
//       ).length;
//       return Math.round((completedCount / stage.items.length) * 100);
//     };
  
//     const getTotalProgress = () => {
//       const totalItems = data.stages.reduce((sum, stage) => sum + stage.items.length, 0);
//       const completedCount = data.stages.reduce((sum, stage, stageIndex) => 
//         sum + stage.items.filter((_, itemIndex) => isCompleted(stageIndex, itemIndex)).length, 0
//       );
//       return Math.round((completedCount / totalItems) * 100);
//     };
  
//     const scrollToStage = (stageIndex) => {
//       setActiveStage(stageIndex);
//       const element = document.getElementById(`stage-${stageIndex}`);
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
//       }
//     };
  
//     // Intersection Observer for stage visibility
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         (entries) => {
//           entries.forEach(entry => {
//             if (entry.isIntersecting) {
//               const stageIndex = parseInt(entry.target.id.split('-')[1]);
//               setVisibleStages(prev => new Set([...prev, stageIndex]));
//             }
//           });
//         },
//         { threshold: 0.3 }
//       );
  
//       const stageElements = document.querySelectorAll('[id^="stage-"]');
//       stageElements.forEach(el => observer.observe(el));
  
//       return () => observer.disconnect();
//     }, []);
  
//     // Render additional fields
//     const renderAdditionalFields = (item) => {
//       const excludeFields = ['name', 'description', 'difficulty', 'timeCommitment'];
//       const additionalFields = Object.keys(item).filter(key => !excludeFields.includes(key));
      
//       if (additionalFields.length === 0) return null;
  
//       return (
//         <div className="mt-4 space-y-2">
//           <h4 className="text-sm font-semibold text-gray-700">Additional Information:</h4>
//           {additionalFields.map(field => (
//             <div key={field} className="flex">
//               <span className="text-xs font-medium text-gray-500 w-24 capitalize">
//                 {field.replace(/([A-Z])/g, ' $1')}:
//               </span>
//               <span className="text-xs text-gray-700 flex-1">{String(item[field])}</span>
//             </div>
//           ))}
//         </div>
//       );
//     };
  

  
//     if (!data) {
//       return (
//         <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading roadmap data...</p>
//           </div>
//         </div>
//       );
//     }

//   // Initialize audio context
//   const initAudio = async () => {
//     if (Tone.context.state !== 'running') {
//       await Tone.start();
//     }
//   };

//   // Celebration sound effect
//   const playCelebrationSound = async () => {
//     try {
//       await initAudio();
      
//       // Create a synth for the celebration sound
//       const synth = new Tone.Synth({
//         oscillator: {
//           type: "sine"
//         },
//         envelope: {
//           attack: 0.01,
//           decay: 0.3,
//           sustain: 0.1,
//           release: 0.8
//         }
//       }).toDestination();

//       // Play a celebratory chord progression
//       const notes = ["C5", "E5", "G5", "C6"];
//       const times = [0, 0.1, 0.2, 0.3];
      
//       notes.forEach((note, index) => {
//         synth.triggerAttackRelease(note, "8n", `+${times[index]}`);
//       });

//       // Add some sparkle sounds
//       setTimeout(() => {
//         const sparkleNotes = ["E6", "G6", "B6"];
//         sparkleNotes.forEach((note, index) => {
//           synth.triggerAttackRelease(note, "16n", `+${index * 0.05}`);
//         });
//       }, 500);

//       // Clean up
//       setTimeout(() => {
//         synth.dispose();
//       }, 2000);

//     } catch (error) {
//       console.log('Audio not available:', error);
//     }
//   };

//   // Confetti Animation
//   const Confetti = () => {
//     const confettiPieces = Array.from({ length: 50 }, (_, i) => (
//       <div
//         key={i}
//         className="absolute animate-pulse"
//         style={{
//           left: `${Math.random() * 100}%`,
//           backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'][Math.floor(Math.random() * 6)],
//           width: `${Math.random() * 8 + 4}px`,
//           height: `${Math.random() * 8 + 4}px`,
//           borderRadius: Math.random() > 0.5 ? '50%' : '0',
//           animation: `confettiFall ${Math.random() * 3 + 2}s linear infinite`,
//           animationDelay: `${Math.random() * 2}s`,
//           transform: `rotate(${Math.random() * 360}deg)`,
//         }}
//       />
//     ));

//     return (
//       <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
//         {confettiPieces}
//         <style jsx>{`
//           @keyframes confettiFall {
//             to {
//               transform: translateY(100vh) rotate(360deg);
//             }
//           }
//         `}</style>
//       </div>
//     );
//   };

//   // Floating Balloons Animation
//   const FloatingBalloons = () => {
//     const balloons = Array.from({ length: 8 }, (_, i) => (
//       <div
//         key={i}
//         className="absolute"
//         style={{
//           left: `${Math.random() * 90}%`,
//           bottom: '-100px',
//           animation: `balloonFloat ${Math.random() * 4 + 6}s ease-in-out infinite`,
//           animationDelay: `${Math.random() * 3}s`,
//         }}
//       >
//         <div className="relative">
//           {/* Balloon */}
//           <div
//             className="w-12 h-16 rounded-full shadow-lg"
//             style={{
//               backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#ff9ff3', '#54a0ff'][i],
//               background: `linear-gradient(135deg, ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#ff9ff3', '#54a0ff'][i]}, ${['#ff5252', '#26d0ce', '#2196f3', '#81c784', '#ffcc02', '#ba68c8', '#e91e63', '#3f51b5'][i]})`,
//             }}
//           />
//           {/* String */}
//           <div
//             className="absolute left-1/2 top-full w-0.5 bg-gray-400"
//             style={{ height: `${Math.random() * 30 + 20}px`, transform: 'translateX(-50%)' }}
//           />
//         </div>
//       </div>
//     ));

//     return (
//       <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
//         {balloons}
//         <style jsx>{`
//           @keyframes balloonFloat {
//             0% {
//               transform: translateY(0) translateX(0) rotate(0deg);
//             }
//             25% {
//               transform: translateY(-20vh) translateX(10px) rotate(2deg);
//             }
//             50% {
//               transform: translateY(-40vh) translateX(-5px) rotate(-1deg);
//             }
//             75% {
//               transform: translateY(-60vh) translateX(15px) rotate(3deg);
//             }
//             100% {
//               transform: translateY(-100vh) translateX(0) rotate(0deg);
//             }
//           }
//         `}</style>
//       </div>
//     );
//   };

//   // Party Balloons (clusters)
//   const PartyBalloons = () => {
//     const balloonClusters = Array.from({ length: 4 }, (_, clusterIndex) => (
//       <div
//         key={clusterIndex}
//         className="absolute"
//         style={{
//           left: `${20 + clusterIndex * 20}%`,
//           bottom: '-150px',
//           animation: `partyBalloonFloat ${Math.random() * 3 + 8}s ease-in-out infinite`,
//           animationDelay: `${clusterIndex * 0.5}s`,
//         }}
//       >
//         {Array.from({ length: 3 }, (_, balloonIndex) => (
//           <div
//             key={balloonIndex}
//             className="absolute"
//             style={{
//               left: `${balloonIndex * 15 - 15}px`,
//               top: `${balloonIndex * 10}px`,
//             }}
//           >
//             {/* Balloon */}
//             <div
//               className="w-10 h-14 rounded-full shadow-xl"
//               style={{
//                 backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1'][balloonIndex],
//                 background: `radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.3), ${['#ff6b6b', '#4ecdc4', '#45b7d1'][balloonIndex]})`,
//                 transform: `rotate(${Math.random() * 10 - 5}deg)`,
//               }}
//             />
//             {/* String */}
//             <div
//               className="absolute left-1/2 top-full w-0.5 bg-gray-500"
//               style={{ 
//                 height: `${Math.random() * 40 + 30}px`, 
//                 transform: 'translateX(-50%)',
//                 opacity: 0.7
//               }}
//             />
//           </div>
//         ))}
//       </div>
//     ));

//     return (
//       <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
//         {balloonClusters}
//         <style jsx>{`
//           @keyframes partyBalloonFloat {
//             0% {
//               transform: translateY(0) translateX(0) rotate(0deg);
//             }
//             20% {
//               transform: translateY(-15vh) translateX(5px) rotate(1deg);
//             }
//             40% {
//               transform: translateY(-35vh) translateX(-10px) rotate(-2deg);
//             }
//             60% {
//               transform: translateY(-55vh) translateX(8px) rotate(1deg);
//             }
//             80% {
//               transform: translateY(-75vh) translateX(-3px) rotate(-1deg);
//             }
//             100% {
//               transform: translateY(-110vh) translateX(0) rotate(0deg);
//             }
//           }
//         `}</style>
//       </div>
//     );
//   };

//   const triggerConfetti = async () => {
//     await playCelebrationSound();
//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 4000);
//   };
  
//     return (
//       <>
//       <Navigation></Navigation>

//       <div className="w-full min-h-screen bg-gradient-to-br from-indigo-400 via-purple-50 to-pink-100 relative overflow-hidden pt-20">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-yellow-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
//         </div>
  
//         {/* Confetti */}
//         {/* {showConfetti && <Confetti />} */}
//         {showConfetti && 
//         <>
//         <Confetti />
//         <FloatingBalloons></FloatingBalloons>
//         {/* <PartyBalloons></PartyBalloons> */}
//         </>}

//         {/* Roadmap Summary (below global navbar) */}
//         <div className="max-w-7xl mx-auto px-6 py-10">
//   <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-white/20">
//     <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      
//       {/* Title */}
//       <div className="flex items-center space-x-4">
        
//         {/* <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg">
//           <BookOpen className="h-10 w-10" />
//         </div> */}
        
//         <div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
//             {data.topic} Roadmap
//           </h1>
//           <p className="text-gray-600 text-sm mt-1 flex items-center">
//             <Star className="h-4 w-4 text-yellow-500 mr-1" />
//             Track your learning journey
//           </p>
//         </div>
//       </div>

//       {/* Progress Summary */}
//       <div className="flex  items-center space-x-6 gap-4 w-full md:w-auto">
//         <div className=" flex  items-center space-x-3 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl px-6 py-4 shadow-lg">
//           <Trophy className="h-7 w-7 mr-4 mt-2 text-yellow-600 animate-bounce" />
//           <div>
//             <span className="text-2xl font-bold text-gray-900">{getTotalProgress()}%</span>
//             <p className="text-xs text-gray-600">Completed</p>
//           </div>
//         </div>
//         <div className="flex-1 md:w-48 bg-gray-200/50 rounded-full h-3 shadow-inner">
//           <div 
//             className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative"
//             style={{ width: `${getTotalProgress()}%` }}
//           >
//             <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//         </div>


  
//         <div className="max-w-7xl gap-7 mx-auto p-6 relative z-10">
//           {/* Stage Navigation */}
//           <div className="mb-12 ">
//             <div className="gap-3 flex items-center justify-center space-x-3 pb-4">
//               {data.stages.map((stage, index) => (
//                 <button
//                   key={index}
//                   onClick={() => scrollToStage(index)}
//                   className={`border border-blue-300 group relative flex items-center space-x-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
//                     activeStage === index 
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25' 
//                       : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg'
//                   }`}
//                 >
//                   {/* <div className={`w-8 mr-3  h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
//                     getStageProgress(index) === 100 
//                       ? 'bg-green-500 text-white' 
//                       : activeStage === index ? 'bg-white/20' : 'bg-gray-100'
//                   }`}>
//                     {getStageProgress(index) === 100 ? <CheckCircle className="h-5 w-5" /> : index + 1}
//                   </div> */}

//                   {getStageProgress(index) === 100 ? <div className={`w-8 mr-3  h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
//                     getStageProgress(index) === 100 
//                       ? 'bg-green-500 text-white' 
//                       : activeStage === index ? 'bg-white/20' : 'bg-gray-100'
//                   }`}>
//                     <CheckCircle className="h-5 w-5" />
//                   </div> : ""}

                  
//                   <div className="text-left">
//                     <span className="text-sm font-semibold">Stage {index + 1}</span>
//                     <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
//                       <div 
//                         className="bg-current h-1 rounded-full transition-all duration-500"
//                         style={{ width: `${getStageProgress(index)}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   {activeStage === index && (
//                     <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
  
//           {/* Timeline Container */}
//           <div className="relative" ref={timelineRef}>
//             {/* Main Timeline Line */}
//             <div className="absolute left-1/2 transform -translate-x-px h-full w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-green-300 rounded-full shadow-sm">
//               <div className="absolute inset-0 bg-white/50 rounded-full "></div>
//             </div>
  
//             {/* Stages */}
//             <div className="space-y-20">
//               {data.stages.map((stage, stageIndex) => (
//                 <div 
//                   key={stageIndex} 
//                   id={`stage-${stageIndex}`}
//                   className="mb-10 relative"
//                   style={{
//                     opacity: visibleStages.has(stageIndex) ? 1 : 0,
//                     transform: visibleStages.has(stageIndex) ? 'translateY(0)' : 'translateY(20px)',
//                     transition: 'all 0.6s ease-out'
//                   }}
//                 >
//                   {/* Stage Header */}
//                   <div className=" flex items-center justify-center mb-12">
//                     <div className="relative">
//                       <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30"></div>
//                       <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-3xl text-center border border-white/20">
//                         <div className="flex items-center justify-center mb-4">
//                           <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl w-12 h-12 flex items-center justify-center text-xl font-bold mr-4 shadow-lg">
//                             {stageIndex + 1}
//                           </div>
//                           <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
//                             {stage.title}
//                           </h2>
//                           {getStageProgress(stageIndex) === 100 && (
//                             <div className="ml-4 mt-2">
//                               <Zap className="h-6 w-6 text-yellow-500 animate-bounce" />
//                             </div>
//                           )}
//                         </div>
//                         <p className=" text-gray-600 text-base mb-6 leading-relaxed">{stage.description}</p>
//                         <div className="gap-3 flex items-center justify-center space-x-6 mb-4">
//                           <div className="flex items-center space-x-2 bg-blue-50 rounded-2xl px-4 py-2 gap-2">
//                             <Target className="h-5 w-5 text-blue-500" />
//                             <span className="text-sm font-medium text-blue-700">{stage.items.length} items</span>
//                           </div>
//                           <div className="flex items-center space-x-2 bg-green-50 rounded-2xl px-4 py-2 gap-2">
//                             <CheckCircle className="h-5 w-5 text-green-500" />
//                             <span className="text-sm font-medium text-green-700">{getStageProgress(stageIndex)}% complete</span>
//                           </div>
//                         </div>
//                         <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
//                           <div 
//                             className="bg-gradient-to-r from-green-400 via-blue-400 to-green-700 h-3 rounded-full transition-all duration-1000 ease-out shadow-md relative"
//                             style={{ width: `${getStageProgress(stageIndex)}%` }}
//                           >
//                             <div className="absolute inset-0 bg-white/40 rounded-full animate-pulse"></div>
                            
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
  
//                   {/* Items Grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
//                     {stage.items.map((item, itemIndex) => {
//                       const isItemCompleted = isCompleted(stageIndex, itemIndex);
//                       const isLeft = itemIndex % 2 === 0;
                      
//                       return (
//                         <div
//                           key={itemIndex}
//                           className={`relative ${isLeft ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}
//                           style={{
//                             opacity: visibleStages.has(stageIndex) ? 1 : 0,
//                             transform: visibleStages.has(stageIndex) 
//                               ? 'translateX(0) scale(1)' 
//                               : `translateX(${isLeft ? '-60px' : '60px'}) scale(0.95)`,
//                             transition: `all 0.6s ease-out ${itemIndex * 0.1}s`
//                           }}
//                         >
//                           {/* Connection Line to Timeline */}
//                           <div className={`hidden md:block absolute top-8 w-12 h-0.5 bg-gradient-to-r ${
//                             isLeft ? 'from-purple-300 to-transparent right-0' : 'from-transparent to-purple-300 left-0'
//                           } ${isItemCompleted ? 'from-green-400 to-transparent' : ''}`}></div>
                          
//                           {/* Timeline Dot */}
//                           <div className={`hidden md:block absolute top-7 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 ${
//                             isItemCompleted ? 'bg-green-500 shadow-green-500/50 animate-pulse' : 'bg-gray-400'
//                           } ${isLeft ? '-right-2' : '-left-2'}`}>
//                             {isItemCompleted && (
//                               <CheckCircle className="h-3 w-3 text-white absolute -inset-0.5" />
//                             )}
//                           </div>
  
//                           {/* Item Card */}
//                           <div 
//                             className={`relative group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border cursor-pointer transform hover:-translate-y-2 ${
//                               isItemCompleted 
//                                 ? 'border-green-200 bg-gradient-to-br from-green-50 to-white shadow-green-500/20' 
//                                 : 'border-white/50 hover:border-blue-300 shadow-purple-500/10'
//                             }`}
//                             onClick={() => setSelectedItem({...item, stageIndex, itemIndex})}
//                           >
//                             {/* Hover glow effect */}
//                             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            
//                             <div className="relative">
//                               <div className="flex items-start justify-between mb-4">
//                                 <h3 className="font-bold text-gray-900 text-base leading-tight flex-1 mr-4">
//                                   {item.name}
//                                 </h3>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     toggleCompletion(stageIndex, itemIndex);
//                                   }}
//                                   className="flex-shrink-0 transform transition-transform hover:scale-110"
//                                 >
//                                   {isItemCompleted ? (
//                                     <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />
//                                   ) : (
//                                     <Circle className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors" />
//                                   )}
//                                 </button>
//                               </div>
  
//                               <div className="flex items-center space-x-3 mb-4 flex-wrap gap-2">
//                                 {item.difficulty && (
//                                   <span className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 hover:scale-105 ${
//                                     getDifficultyTextColor(item.difficulty)
//                                   }`}>
//                                     {item.difficulty}
//                                   </span>
//                                 )}
//                                 {item.timeCommitment && (
//                                   <div className="flex items-center space-x-1 text-gray-500 bg-gray-50 rounded-full px-3 py-1">
//                                     <Clock className="h-3 w-3" />
//                                     <span className="text-xs font-medium">{item.timeCommitment}</span>
//                                   </div>
//                                 )}
//                               </div>
  
//                               <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
//                                 {item.description ? item.description.split('\n')[0] : ''}
//                               </p>
  
//                               <div className="flex items-center justify-between">
//                                 <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:text-purple-600 transition-colors">
//                                   <BookOpen className="h-4 w-4 mr-2" />
//                                   <span>Learn More</span>
//                                   <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
//                                 </div>
//                                 {isItemCompleted && (
//                                   <div className="flex items-center space-x-1 text-green-600 text-xs font-medium">
//                                     <Star className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
//                                     <span>Completed!</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
  
//         {/* Modal for Selected Item */}
//         {selectedItem && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div 
//               className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20 animate-pulse"
//               style={{
//                 animation: 'modalAppear 0.3s ease-out forwards'
//               }}
//             >
//               <style jsx>{`
//                 @keyframes modalAppear {
//                   from {
//                     opacity: 0;
//                     transform: scale(0.9) translateY(20px);
//                   }
//                   to {
//                     opacity: 1;
//                     transform: scale(1) translateY(0);
//                   }
//                 }
//               `}</style>
              
//               <div className="p-8 border-b border-gray-100">
//                 <div className="flex items-start justify-between">
//                   <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent flex-1 mr-4">
//                     {selectedItem.name}
//                   </h3>
//                   <button
//                     onClick={() => setSelectedItem(null)}
//                     className="text-gray-400 hover:text-gray-600 text-3xl transform hover:scale-110 transition-all hover:rotate-90"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>
              
//               <div className="p-8">
//                 <div className="flex items-center space-x-3 mb-6 flex-wrap gap-2">
//                   {selectedItem.difficulty && (
//                     <span className={`px-4 py-2 rounded-2xl text-sm font-semibold border ${
//                       getDifficultyTextColor(selectedItem.difficulty)
//                     }`}>
//                       {selectedItem.difficulty}
//                     </span>
//                   )}
//                   {selectedItem.timeCommitment && (
//                     <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 rounded-2xl px-4 py-2">
//                       <Clock className="h-4 w-4" />
//                       <span className="text-sm font-medium">{selectedItem.timeCommitment}</span>
//                     </div>
//                   )}
//                   <span className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
//                     isCompleted(selectedItem.stageIndex, selectedItem.itemIndex)
//                       ? 'bg-green-100 text-green-800 border border-green-200'
//                       : 'bg-gray-100 text-gray-800 border border-gray-200'
//                   }`}>
//                     {isCompleted(selectedItem.stageIndex, selectedItem.itemIndex) ? '✓ Completed' : 'Not Started'}
//                   </span>
//                 </div>
  
//                 <div className="prose prose-sm max-w-none mb-6">
//                   {selectedItem.description && selectedItem.description.split('\n').map((line, index) => (
//                     <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>
//                   ))}
//                 </div>
  
//                 {renderAdditionalFields(selectedItem)}
  
//                 <div className="gap-4 mt-6 flex space-x-3">
//                   <button
//                     onClick={() => {
//                       toggleCompletion(selectedItem.stageIndex, selectedItem.itemIndex);
//                     }}
//                     className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
//                       isCompleted(selectedItem.stageIndex, selectedItem.itemIndex)
//                         ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25'
//                         : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25'
//                     }`}
//                   >
//                     {isCompleted(selectedItem.stageIndex, selectedItem.itemIndex) 
//                       ? 'Mark as Incomplete' 
//                       : 'Mark as Complete'
//                     }
//                   </button>
//                   <button
//                     onClick={() => setSelectedItem(null)}
//                     className="px-6 py-3 rounded-2xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* <FooterSection></FooterSection> */}
      
//       </>
//     );
//   };
  
// export default Roadmap;


