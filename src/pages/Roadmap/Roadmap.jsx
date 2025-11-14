import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import ChatBotPanel from './ChatBotPanel';
import { Mic, MicOff, Send, Loader, RefreshCw } from 'lucide-react';
import { UserAuth } from '../../context/AuthContext';

// import roadmapData from "../../../src/data/c_roadmap.json";
// import roadmapData from "../../../src/data/python_roadmap.json";

const Roadmap = () => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());
  const [activeTab, setActiveTab] = useState("details"); // "details" or "chatbot"
  
  // Get auth token
  const { getToken } = UserAuth();

  // New states for roadmap generation
  const [roadmapData, setRoadmapData] = useState(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Speech recognition failed. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognition.start();
      setIsListening(true);
    }
  };

  // Fetch roadmap from API
  const generateRoadmap = async () => {
    if (!query.trim()) {
      setError('Please enter a topic or use voice input');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = getToken();
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}/api/v1/roadmap`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ topic: query.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          // Skip empty lines
          if (!line.trim()) continue;
          
          // Handle event type
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
            continue;
          }
          
          // Handle data
          if (line.startsWith('data: ')) {
            try {
              let jsonString = line.slice(6).trim();
              
              // Skip empty data lines
              if (!jsonString) continue;
              
              // Skip non-JSON data lines (like "event: roadmap")
              if (jsonString.startsWith('event:')) continue;
              
              // Handle duplicate "data: " prefix (e.g., "data: data: {...}")
              if (jsonString.startsWith('data: ')) {
                jsonString = jsonString.slice(6).trim();
              }
              
              const jsonData = JSON.parse(jsonString);
              
              // Only process roadmap events
              if (currentEvent === 'roadmap' || !currentEvent) {
                console.log('Received roadmap data:', jsonData);
                setRoadmapData(jsonData);
                setCompletedItems(new Set()); // Reset completed items
                setSelectedNode(null); // Reset selected node
              } else if (currentEvent === 'thread_id') {
                console.log('Thread ID:', jsonData);
                // You can store thread_id if needed for chat functionality
              }
              
              // Reset current event after processing
              currentEvent = null;
            } catch (e) {
              console.error('Error parsing SSE data:', e, 'Line:', line);
            }
          }
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Failed to generate roadmap. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    generateRoadmap();
  };

  const transformDataForTree = (data) => {
    // Validate data structure
    if (!data || !data.stages || !Array.isArray(data.stages)) {
      console.warn('Invalid roadmap data structure:', data);
      return null;
    }

    const root = {
      name: data.topic || 'Roadmap',
      type: "root",
      description: data.introduction || '',
      children: data.stages.map((stage, stageIndex) => ({
        name: stage.title || `Stage ${stageIndex + 1}`,
        type: "stage",
        description: stage.description || '',
        stageIndex,
        children: (stage.items && Array.isArray(stage.items)) 
          ? stage.items.map((item, itemIndex) => ({
              name: item.name || `Item ${itemIndex + 1}`,
              type: "item",
              description: item.description || '',
              difficulty: item.difficulty || 'Medium',
              timeCommitment: item.timeCommitment || 'Unknown',
              id: `${stageIndex}-${itemIndex}`,
              stageIndex,
              itemIndex
            }))
          : []
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
    if (!roadmapData || !roadmapData.stages || !Array.isArray(roadmapData.stages)) {
      return; // Don't render if no valid data
    }
    
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

    const transformedData = transformDataForTree(roadmapData);
    if (!transformedData) {
      console.error('Failed to transform roadmap data');
      return;
    }

    const root = d3.hierarchy(transformedData);

    const treeLayout = d3.tree().size([width - 200, 500]); // width -> x, height -> y

    treeLayout(root);

    // Zigzag left/right
    root.descendants().forEach(d => {
      if (d.data.type === "item") {
        const isEven = d.data.itemIndex % 2 === 0;
        d.y = d.y + (isEven ? 20 : -500); // use y instead of x
      }
    });



    // stage line
    const stageNodes = root.descendants().filter(d => d.data.type === "stage");

    // Find top-most and bottom-most stage positions
    const topStageX = d3.min(stageNodes, d => d.x);
    const bottomStageX = d3.max(stageNodes, d => d.x);
    const centerY = d3.mean(stageNodes, d => d.y);

    // Extend line above top stage (e.g., by 100 px)
    const topLineX = topStageX - 150;

    g.append("line")
      .attr("x1", centerY)
      .attr("y1", topLineX)  // start above first stage
      .attr("x2", centerY)
      .attr("y2", bottomStageX) // bottom-most stage
      .attr("stroke", "#7883FF")
      .attr("stroke-width", 2); // line


    // Add text on top of the stage line
    g.append("text")
      .attr("x", centerY)        // horizontal position: same as line
      .attr("y", topLineX - 10)  // slightly above the top of the line
      .attr("text-anchor", "middle") // center-align the text horizontally
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", "#FF4B00")
      .text(`${roadmapData.topic}`);




    const links = g.selectAll(".link")
      .data(
        root.links().filter(d => d.source.data.type !== "root") // ⬅️ skip root links
      )
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr("fill", "none")
      .attr("stroke", "#7883FF")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", 2)
      .attr("opacity", 1);

    const nodes = g.selectAll(".node")
      .data(root.descendants().filter(d => d.data.type !== "root")) // ⬅️ skip root
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer");


    nodes.on("click", (event, d) => {
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
      .each(function (d) {
        const text = d3.select(this);
        const words = d.data.name.split(/\s+/);

        // const maxWidth = d.data.type === "root" ? 200 : d.data.type === "stage" ? 150 : 120;

        const maxWidth = d.data.type === "root" ? 200
          : d.data.type === "stage" ? 150
            : "w-fit"; // <-- increase item width from 120 to 180


        text.text("");
        let line = [];
        const lineHeight = 1;
        let lines = [];

        words.forEach(word => {
          line.push(word);
          text.text(line.join(" "));
          if (text.node().getComputedTextLength() > maxWidth && line.length > 1) {
            line.pop();
            lines.push(line.join(" "));
            line = [word];
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
          width: textWidth + 20, // Add padding
          height: textHeight + 12, // Add padding
          lines: lines,
          lineHeight: lineHeight,
          fontSize: fontSize
        });
      });

    // Remove temporary text elements
    tempText.remove();

    // Add background rectangles
    // nodes.append("rect")
    //   .attr("class", "text-background")
    //   .attr("x", d => {
    //     const dims = textDimensions.get(d);
    //     return -dims.width / 2;
    //   })
    //   .attr("y", d => {
    //     const dims = textDimensions.get(d);
    //     const yOffset = d.data.type === "root" ? -0 : d.data.type === "stage" ? -0 : -0;
    //     return yOffset - dims.fontSize + dims.fontSize * 0.2 - 6; // Adjust for padding
    //   })
    //   .attr("width", d => textDimensions.get(d).width)
    //   .attr("height", d => textDimensions.get(d).height)
    //   .attr("fill", d => d.data.type === "stage" ? "yellow" : d.data.type === "item" ? "gold" : "white")
    //   .attr("stroke", "black")
    //   .attr("stroke-width", 1)
    //   .attr("rx", 4) // Border radius
    //   .attr("ry", 4);


    nodes.append("rect")
      .attr("class", "text-background")
      .attr("x", d => {
        const dims = textDimensions.get(d);
        return -dims.width / 2;
      })
      .attr("y", d => {
        const dims = textDimensions.get(d);
        const yOffset = d.data.type === "root" ? 0 : d.data.type === "stage" ? 0 : 0;
        return yOffset - dims.fontSize + dims.fontSize * 0.2 - 6; // Adjust for padding
      })
      .attr("width", d => textDimensions.get(d).width)
      .attr("height", d => textDimensions.get(d).height)
      .attr("fill", d => {
        if (d.data.type === "stage") return "yellow";
        if (d.data.type === "item") {
          switch (d.data.difficulty) {
            case "easy": return "#8BC34A";    // Green
            case "medium": return "#FFC107";  // Amber
            case "hard": return "#F44336";    // Red
            default: return "gold";           // fallback
          }
        }
        return "white"; // for root
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("rx", 4) // Border radius
      .attr("ry", 4);



    // Add labels
    nodes.append("text")

      .attr("dy", d =>
        d.data.type === "root" ? -0 :   // was -18
          d.data.type === "stage" ? -0 :  // was -14
            -0                              // was -12
      )

      .attr("text-anchor", "middle")
      .attr("font-size", d => {
        if (d.data.type === "root") return "14px";
        if (d.data.type === "stage") return "12px";
        return "10px";
      })
      .attr("font-weight", d => d.data.type === "root" ? "bold" : d.data.type === "stage" ? "600" : "normal")
      .attr("fill", "#1f2937")
      .each(function (d) {
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

  }, [completedItems, roadmapData]);

  // Calculate completion percentage safely
  const completionPercentage = roadmapData?.stages ? roadmapData.stages.reduce((total, stage) => {
    const stageCompleted = stage.items.filter((item, itemIndex) =>
      completedItems.has(`${roadmapData.stages.indexOf(stage)}-${itemIndex}`)
    ).length;
    return total + stageCompleted;
  }, 0) : 0;

  const totalItems = roadmapData?.stages ? roadmapData.stages.reduce((total, stage) => total + stage.items.length, 0) : 0;
  const progressPercent = totalItems > 0 ? Math.round((completionPercentage / totalItems) * 100) : 0;

  return (
    <div className="min-w-[1585px] h-screen bg-gray-900 flex flex-col">
      {/* Header with Input Section */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">
            AI Learning Roadmap Generator
          </h1>
          
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a topic (e.g., 'Learn Python', 'Machine Learning Basics')..."
                className="w-full px-4 py-3 pr-12 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                disabled={isLoading}
              />
              
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                }`}
                disabled={isLoading}
                title={isListening ? 'Stop listening' : 'Use voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
            
            {/* Reset Button */}
            {roadmapData && (
              <button
                type="button"
                onClick={() => {
                  setRoadmapData(null);
                  setQuery('');
                  setSelectedNode(null);
                  setCompletedItems(new Set());
                  setError(null);
                }}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center gap-2"
                title="Reset and create new roadmap"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </form>
          
          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Progress Bar */}
          {roadmapData && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress: {completionPercentage} / {totalItems} items</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 h-full overflow-hidden p-4">
        {/* Tree visualization */}
        <div className="flex-1 bg-gray-900 rounded-lg shadow-md overflow-hidden">
          {roadmapData ? (
            <svg ref={svgRef} className="w-full h-full"></svg>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Welcome to AI Roadmap Generator
                </h2>
                <p className="text-gray-400 mb-6">
                  Enter a topic above to generate a personalized learning roadmap. You can type your query or use voice input to get started.
                </p>
                <div className="bg-gray-800 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-300 font-semibold mb-2">Example topics:</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Learn Python Programming</li>
                    <li>• Machine Learning Fundamentals</li>
                    <li>• Web Development with React</li>
                    <li>• Data Structures and Algorithms</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        {/* Side panel */}
        {selectedNode && (
          <div className="w-96 bg-white rounded-lg shadow-md p-6 overflow-y-auto flex flex-col">
            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`flex-1 py-2 text-center font-medium ${activeTab === "details" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`flex-1 py-2 text-center font-medium ${activeTab === "chatbot" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setActiveTab("chatbot")}
              >
                AI Chatbot Insights
              </button>
            </div>

            {/* Tab content */}
            {activeTab === "details" && (
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{selectedNode.name}</h3>

                {selectedNode.type === "item" && (
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${selectedNode.difficulty === "Easy" ? "bg-green-100 text-green-800" :
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
                    className={`mt-4 w-full px-4 py-2 rounded font-medium transition-colors ${completedItems.has(selectedNode.id)
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    {completedItems.has(selectedNode.id) ? "Mark as Incomplete" : "Mark as Complete"}
                  </button>
                )}
              </div>
            )}

            {activeTab === "chatbot" && (
              <ChatBotPanel topic={selectedNode.name} />
            )}
          </div>
        )}


      </div>
    </div>
  );
};

export default Roadmap;