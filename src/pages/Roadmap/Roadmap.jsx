import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import ChatBotPanel from './ChatBotPanel';
import { Mic, MicOff, Send, Loader, RefreshCw } from 'lucide-react';
import { UserAuth } from '../../context/AuthContext';
import { Context } from '../../context/Context';
import Navigation from '../../components/LandingPage/components/Navigation';
// import roadmapData from "../../../src/data/c_roadmap.json";
// import roadmapData from "../../../src/data/python_roadmap.json";

const Roadmap = () => {
  const svgRef = useRef();
  const {user} = UserAuth();
  const navigate = useNavigate();
  const { onSent, setInput } = useContext(Context);
  const [selectedNode, setSelectedNode] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());
  const [showDetails, setShowDetails] = useState(true);
  const [showChatbot, setShowChatbot] = useState(true);
  
  // Get auth token
  const { getToken } = UserAuth();

  // New states for roadmap generation
  const [roadmapData, setRoadmapData] = useState(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [threadId, setThreadId] = useState(null);

  // Chat history states
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'progress', 'title'

  // Debug: Log threadId changes
  useEffect(() => {
    console.log('Roadmap threadId updated:', threadId);
  }, [threadId]);

  // Fetch chat history from API
  const fetchChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = getToken();
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}/api/v1/roadmap/threads`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatHistory(data.threads || []);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError('Failed to load chat history');
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load a thread from history
  const loadThread = (thread) => {
    setRoadmapData(thread.roadmap);
    setThreadId(thread.thread_id);
    setQuery(thread.title);
    // Keep history panel open - removed: setShowHistoryPanel(false);
    
    // Set completed items based on progress
    if (thread.roadmap && thread.roadmap.stages) {
      const completed = new Set();
      thread.roadmap.stages.forEach((stage, stageIndex) => {
        stage.items.forEach((item, itemIndex) => {
          if (item.status === 'completed') {
            completed.add(`${stageIndex}-${itemIndex}`);
          }
        });
      });
      setCompletedItems(completed);
    }
    
    // Reset selected node to allow fresh interaction
    setSelectedNode(null);
  };

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
    
    // Fetch chat history on component mount
    fetchChatHistory();
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
                
                // Extract thread_id if present in the data
                if (jsonData.thread_id) {
                  console.log('Thread ID found in roadmap data:', jsonData.thread_id);
                  setThreadId(jsonData.thread_id);
                }
                
                // Only set roadmap data if it has stages (actual roadmap)
                if (jsonData.stages) {
                  setRoadmapData(jsonData);
                  setCompletedItems(new Set()); // Reset completed items
                  setSelectedNode(null); // Reset selected node
                }
              } else if (currentEvent === 'thread_id') {
                console.log('Thread ID event received:', jsonData);
                // Store thread_id for chat functionality
                // Handle both {"thread_id": "xxx"} and direct string formats
                const threadIdValue = jsonData.thread_id || jsonData;
                console.log('Extracted thread_id:', threadIdValue);
                if (threadIdValue) {
                  setThreadId(threadIdValue);
                }
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
      
      // Auto-refresh chat history after successful roadmap generation (with 5 second delay)
      if (showHistoryPanel) {
        setTimeout(async () => {
          await fetchChatHistory();
        }, 5000); // 5 second delay to allow backend to save the thread
      }
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
      
      // Check if Shift key is pressed - redirect to chat
      if (event.shiftKey && (d.data.type === "stage" || d.data.type === "item")) {
        const promptMessage = `Please explain: ${d.data.name}`;
        setInput(promptMessage);
        navigate('/cosmos-chatbot');
        setTimeout(() => {
          onSent(promptMessage);
        }, 500);
        return;
      }
      
      // Normal click behavior
      setSelectedNode(d.data);
      // Reset panel visibility when selecting new node
      setShowDetails(true);
      setShowChatbot(true);
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

  }, [completedItems, roadmapData, toggleCompletion, navigate, onSent, setInput]);

  // Calculate completion percentage safely
  const completionPercentage = roadmapData?.stages ? roadmapData.stages.reduce((total, stage) => {
    const stageCompleted = stage.items.filter((item, itemIndex) =>
      completedItems.has(`${roadmapData.stages.indexOf(stage)}-${itemIndex}`)
    ).length;
    return total + stageCompleted;
  }, 0) : 0;

  const totalItems = roadmapData?.stages ? roadmapData.stages.reduce((total, stage) => total + stage.items.length, 0) : 0;
  const progressPercent = totalItems > 0 ? Math.round((completionPercentage / totalItems) * 100) : 0;

  // Filter and sort chat history
  const filteredAndSortedHistory = React.useMemo(() => {
    let filtered = chatHistory;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(thread => 
        thread.title?.toLowerCase().includes(query) ||
        thread.roadmap?.topic?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at) - new Date(a.created_at); // Newest first
        case 'progress': {
          const progressA = a.progress?.overall_progress_percentage || 0;
          const progressB = b.progress?.overall_progress_percentage || 0;
          return progressB - progressA; // Highest progress first
        }
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return sorted;
  }, [chatHistory, searchQuery, sortBy]);

  return (
    <div className=" min-w-[1585px] w-full h-screen bg-gray-900 flex flex-col">
      {/* Header with Input Section */}
      <Navigation></Navigation>

      {/* Main Content */}
      <div className="flex gap-4 h-full overflow-hidden p-4 mt-20 pb-20">
        
        {/* Chat History Panel (Left Side) */}
        {showHistoryPanel && (
          <div className="w-80 bg-gradient-to-br from-[#1a1926] to-[#0f0f1a] rounded-2xl shadow-2xl border border-[#a200ff]/20 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#2a2938] flex items-center justify-between bg-gradient-to-r from-[#FF4B00]/10 to-[#a200ff]/10">
              <h3 className="text-lg font-bold bg-gradient-to-r from-[#FF4B00] to-[#a200ff] bg-clip-text text-transparent">
                Chat History
              </h3>
              <button
                onClick={() => setShowHistoryPanel(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all group"
                title="Close History"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search and Sort Controls */}
            <div className="px-4 py-3 space-y-2 border-b border-[#2a2938]">
              {/* Search Input */}
              <div className="mb-2 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title..."
                  className="w-full px-3 py-2 pl-9 bg-[#0f0f0f]/50 text-white text-sm rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#a200ff] focus:border-transparent placeholder-gray-500 transition-all"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-all"
                  >
                    <svg className="w-3 h-3 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-2 py-1.5 bg-[#0f0f0f]/50 text-white text-xs rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#a200ff] focus:border-transparent cursor-pointer transition-all"
                >
                  <option className='hover:bg-orange-600' value="date">Newest First</option>
                  <option value="progress">Progress (High to Low)</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-[#a200ff]" />
                </div>
              ) : filteredAndSortedHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  {searchQuery ? 'No matching threads found' : 'No chat history yet'}
                </div>
              ) : (
                filteredAndSortedHistory.map((thread) => {
                  const progress = thread.progress || {
                    total_items: 0,
                    completed_items: 0,
                    in_progress_items: 0,
                    not_started_items: 0,
                    overall_progress_percentage: 0
                  };
                  
                  return (
                    <div
                      key={thread.thread_id}
                      onClick={() => loadThread(thread)}
                      className={`bg-[#0f0f0f]/50 hover:bg-[#0f0f0f]/80 border rounded-lg p-4 cursor-pointer transition-all group ${
                        thread.thread_id === threadId 
                          ? 'border-[#a200ff] bg-[#a200ff]/10' 
                          : 'border-white/5 hover:border-[#a200ff]/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-semibold text-sm group-hover:text-[#a200ff] transition-colors ${
                          thread.thread_id === threadId ? 'text-[#a200ff]' : 'text-white'
                        }`}>
                          {thread.title || 'Untitled'}
                        </h4>
                      
                      </div>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>Progress:</span>
                          <span className="text-[#FF4B00] font-medium">
                            {progress.overall_progress_percentage?.toFixed(0) || 0}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Items:</span>
                          <span>{progress.completed_items || 0}/{progress.total_items || 0}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {thread.created_at ? new Date(thread.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-3 w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-[#FF4B00] to-[#a200ff] h-1.5 rounded-full transition-all"
                          style={{ width: `${progress.overall_progress_percentage || 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            
          </div>
        )}
        
        {/* Left Side Panel - Details */}
        {selectedNode && showDetails && (
          <div className="w-96 bg-gradient-to-br from-[#1a1926] to-[#0f0f1a] rounded-2xl shadow-2xl border border-[#a200ff]/20 flex flex-col">
            {/* Header with Close Button */}
            <div className="px-6 py-4 border-b border-[#2a2938] flex items-center justify-between bg-gradient-to-r from-[#FF4B00]/10 to-[#a200ff]/10">
              <h3 className="text-lg font-bold bg-gradient-to-r from-[#FF4B00] to-[#a200ff] bg-clip-text text-transparent">
                Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all group"
                title="Close Details"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              <h4 className="text-xl font-bold text-white mb-4 leading-tight">
                {selectedNode.name}
              </h4>

              {/* Difficulty + Time + Completed */}
              {selectedNode.type === "item" && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md
                    ${selectedNode.difficulty === "Easy" && "bg-green-500/20 text-green-300 border border-green-500/30"}
                    ${selectedNode.difficulty === "Medium" && "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"}
                    ${selectedNode.difficulty === "Hard" && "bg-red-500/20 text-red-300 border border-red-500/30"}
                  `}>
                    {selectedNode.difficulty}
                  </span>

                  {/* <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#a200ff]/10 text-[#a200ff] border border-[#a200ff]/30">
                    ⏱ {selectedNode.timeCommitment}
                  </span> */}

                  {completedItems.has(selectedNode.id) && (
                    <span className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg text-xs font-semibold border border-green-500/30 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="text-sm leading-relaxed text-gray-300 bg-[#0f0f0f]/50 rounded-xl p-4 border border-white/5">
                {selectedNode.description.split("\n").map((line, index) => (
                  <p key={index} className="mb-2 last:mb-0">{line}</p>
                ))}
              </div>

              {/* Complete / Incomplete Button */}
              {selectedNode.type === "item" && (
                <button
                  onClick={() => toggleCompletion(selectedNode.id)}
                  className={`mt-6 w-full px-4 py-3 rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105
                    ${completedItems.has(selectedNode.id)
                      ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                      : "bg-gradient-to-r from-[#FF4B00] to-[#ff6b2d] hover:from-[#e04600] hover:to-[#ff5520] text-white"
                    }`}
                >
                  {completedItems.has(selectedNode.id)
                    ? "✓ Mark as Incomplete"
                    : "Mark as Complete"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tree visualization */}
        <div className="flex-1 bg-gray-900 rounded-lg shadow-md overflow-hidden relative">
          {roadmapData ? (
            <>
              <svg ref={svgRef} className="w-full h-full"></svg>
              {/* Floating hint for Shift+Click */}
              <div className="absolute top-4 right-4 p-3 bg-gradient-to-r from-[#1a1926]/90 to-[#0f0f1a]/90 backdrop-blur-sm border border-[#a200ff]/30 rounded-lg shadow-xl">
                <p className="text-xs text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF4B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Hold <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-white text-xs mx-1">Shift</kbd> + Click to explain in chat
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-[#FF4B00] to-[#ff6b2d] rounded-full flex items-center justify-center shadow-lg shadow-[#FF4B00]/30">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">
                  Hello, {user.email.split("@")[0].replace(/\d+$/, "")}!
                </h1>
                {/* <h2 className="text-lg font-semibold text-white mb-3">
                  Welcome to COSMOS Roadmap Generator
                </h2> */}
                <p className="text-gray-400 mb-6">
                  Enter a topic in the bottom input to generate a personalized learning roadmap. You can type your query or use voice input to get started.
                </p>
                
                {/* Hint for Shift+Click feature */}
                <div className="mt-4 p-3 bg-gradient-to-r from-[#FF4B00]/10 to-[#a200ff]/10 border border-[#FF4B00]/20 rounded-lg">
                  <p className="text-xs text-gray-300">
                    💡 <span className="font-semibold text-[#FF4B00]">Pro Tip:</span> Hold <kbd className="px-2 py-1 bg-gray-700 rounded text-white text-xs">Shift</kbd> and click any stage or item to get AI explanation in chat
                  </p>
                </div>
              
              </div>
            </div>
          )}
        </div>

        {/* Right Side panel - AI Chatbot */}
        {selectedNode && showChatbot && (
          <div className="w-120 bg-gradient-to-br from-[#1a1926] to-[#0f0f1a] rounded-2xl shadow-2xl border border-[#a200ff]/20 flex flex-col">
            {/* Header with Close Button */}
            <div className="px-6 py-4 border-b border-[#2a2938] flex items-center justify-between bg-gradient-to-r from-[#FF4B00]/10 to-[#a200ff]/10">
              <h3 className="text-lg font-bold bg-gradient-to-r from-[#a200ff] to-[#FF4B00] bg-clip-text text-transparent">
                COSMOS Chatbot
              </h3>
              <button
                onClick={() => setShowChatbot(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all group"
                title="Close Chatbot"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ChatBot Panel */}
            <div className="flex-1 overflow-hidden">
              <ChatBotPanel topic={selectedNode.name} threadId={threadId} />
            </div>
          </div>
        )}


      </div>

      {/* Minimal Fixed Bottom Input Section */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          
          {/* Error Message */}
          {error && (
            <div className="mb-2 p-2 bg-[#FF4B00]/20 border border-[#FF4B00]/50 rounded-lg text-[#FF4B00] text-xs">
              <span className="font-medium">⚠ {error}</span>
            </div>
          )}
          
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {/* History Button */}
            <button
              type="button"
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className={`p-2.5 rounded-lg transition-all hover:scale-105 ${
                showHistoryPanel 
                  ? 'bg-gradient-to-r from-[#a200ff] to-[#c240ff] text-white' 
                  : 'bg-[#1e1e1e]/70 hover:bg-[#1e1e1e] text-gray-400 hover:text-white border border-white/10'
              }`}
              title="Chat History"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="flex-1 relative group">
              {/* Subtle Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4B00] to-[#a200ff] rounded-lg opacity-0 group-hover:opacity-20 group-focus-within:opacity-20 blur transition duration-300"></div>
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your learning topic..."
                className="relative w-full px-4 py-2.5 pr-11 bg-[#1e1e1e]/70 backdrop-blur-sm text-white text-sm rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#a200ff] focus:border-transparent placeholder-gray-500 transition-all"
                disabled={isLoading}
              />
              
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
                disabled={isLoading}
                title={isListening ? 'Stop listening' : 'Use voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-[#a200ff] to-[#c240ff] text-white text-sm font-semibold rounded-lg hover:from-[#b520ff] hover:to-[#d050ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
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
                  setThreadId(null);
                }}
                className="p-2.5 bg-gradient-to-r from-[#FF4B00] to-[#ff6b2d] hover:from-[#e04600] hover:to-[#ff5520] text-white rounded-lg transition-all hover:scale-105"
                title="Reset and create new roadmap"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;