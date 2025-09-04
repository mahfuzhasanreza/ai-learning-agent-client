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


    g.append("line")
      .attr("x1", d3.mean(stageNodes, d => d.y)) // central y-position of stages
      .attr("y1", d3.min(stageNodes, d => d.x))  // top-most stage
      .attr("x2", d3.mean(stageNodes, d => d.y)) // same x as x1
      .attr("y2", d3.max(stageNodes, d => d.x))  // bottom-most stage
      .attr("stroke", "#94a3b8")                 // line color
      .attr("stroke-width", 2)
      .attr("stroke-width", "4 2");         // optional dotted style



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
      .attr("stroke", "#94a3b8")
      .attr("stroke-dasharray", 4)
      .attr("opacity", 0.8);

    const nodes = g.selectAll(".node")
      .data(root.descendants().filter(d => d.data.type !== "root")) // ⬅️ skip root
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
      .each(function (d) {
        const text = d3.select(this);
        const words = d.data.name.split(/\s+/);

        // const maxWidth = d.data.type === "root" ? 200 : d.data.type === "stage" ? 150 : 120;

        const maxWidth = d.data.type === "root" ? 200
          : d.data.type === "stage" ? 150
            : "w-fit"; // <-- increase item width from 120 to 180


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
      <div className="mb-4  bg-white rounded-lg shadow-md p-4">
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

      <div className="flex  gap-4 h-full">
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
      </div>

      {/* Legend */}
      <div className="border border-red-200 absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-bold text-gray-800 mb-2">Legend</h4>
        <div className="flex flex-col gap-2  text-xs">
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