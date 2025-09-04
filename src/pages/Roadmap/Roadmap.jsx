import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

import roadmapData from "../../../src/data/c_roadmap.json";
// import roadmapData from "../../../src/data/python_roadmap.json";

const Roadmap = () => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());



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
      .attr("fill", "#1e293b")
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
        let lineNumber = 0;
        const lineHeight = 1;
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
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}

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
    </div>
  );
};

export default Roadmap;