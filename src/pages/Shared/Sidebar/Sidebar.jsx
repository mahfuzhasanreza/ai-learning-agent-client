import { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  GraduationCap,
  Brain,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  FileText,
  PlusCircle,
} from "lucide-react";
import { Context } from "../../../context/Context";

const menuItems = [
  { label: "Cosmos Chatbot", icon: Brain, path: "/cosmos-chatbot" },
  { label: "Study Plan", icon: GraduationCap, path: "/study-plan" },
  { label: "Performance Tracking", icon: Home, path: "/performance-tracking" },
  { label: "Roadmap", icon: BookOpen, path: "/roadmap" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { onSent, newChatPrompts, setRecentPrompt, newChat, setActiveChat } = useContext(Context);

  const showChatSubmenu = location.pathname.startsWith("/cosmos-chatbot");

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"
        } h-full bg-[#1a1f2e] border-r border-[#2d3548] transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2d3548]">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-semibold text-[#FF4B00] flex items-center gap-2">
              <Brain className="w-5 h-5" />
              COSMOS-ITS
            </h1>
            <p className="text-xs text-gray-400">AI Learning Agent</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-[#FF4B00] border border-[#FF4B00] rounded-full hover:bg-[#FF4B00] hover:text-white transition"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-2">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <div key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-md mx-2 mb-1 text-sm font-medium transition-colors duration-200 ${isActive
                  ? "bg-[#FF4B00] text-white"
                  : "text-gray-400 hover:bg-[#2d3548] hover:text-gray-100"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </NavLink>

            {/* Chat submenu */}
            {showChatSubmenu && path === "/cosmos-chatbot" && !collapsed && (
              <div className="ml-8 flex flex-col gap-1">
                <NavLink
                  to="/cosmos-chatbot/history"
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2 rounded-md text-sm transition-colors duration-200 ${isActive
                      ? "bg-[#FF4B00] text-white"
                      : "text-gray-400 hover:bg-[#2d3548] hover:text-gray-100"
                    }`
                  }
                >
                  <FileText className="w-4 h-4" />
                  History
                </NavLink>

                <button onClick={() => newChat()} className="flex items-center gap-2 p-2 rounded-md text-sm transition-colors duration-200 text-gray-400 hover:bg-[#2d3548] hover:text-gray-100">
                  <PlusCircle className="w-4 h-4 " />
                  New Chat
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-[#2d3548] mt-auto">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md mx-2 mt-2 text-sm font-medium transition-colors duration-200 ${isActive
              ? "bg-[#FF4B00] text-white"
              : "text-gray-400 hover:bg-[#2d3548] hover:text-gray-100"
            }`
          }
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </div>
  );
}
