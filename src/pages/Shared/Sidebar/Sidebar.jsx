import { useState } from 'react';
import { 
  Home, 
  Brain, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  Users, 
  FileText,
  Lightbulb,
  Target,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('/');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleSubmenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const MenuItem = ({ icon: Icon, label, path, onClick }) => (
    <button
      onClick={() => {
        setActiveItem(path);
        onClick?.();
      }}
      className={`menu-item ${activeItem === path ? 'active' : ''}`}
      title={collapsed ? label : ''}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '12px',
        padding: collapsed ? '10px' : '10px 20px',
        border: 'none',
        background: activeItem === path ? '#3b82f6' : 'transparent',
        color: activeItem === path ? '#ffffff' : '#94a3b8',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        if (activeItem !== path) {
          e.currentTarget.style.backgroundColor = '#2d3548';
          e.currentTarget.style.color = '#e2e8f0';
        }
      }}
      onMouseLeave={(e) => {
        if (activeItem !== path) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#94a3b8';
        }
      }}
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </button>
  );

  const SubMenuItem = ({ icon: Icon, label, items, menuKey }) => {
    const isExpanded = expandedMenus[menuKey];
    
    if (collapsed) {
      return (
        <button
          title={label}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            border: 'none',
            background: 'transparent',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2d3548';
            e.currentTarget.style.color = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <Icon size={18} />
        </button>
      );
    }
    
    return (
      <div>
        <button
          onClick={() => toggleSubmenu(menuKey)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '10px 20px',
            border: 'none',
            background: 'transparent',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2d3548';
            e.currentTarget.style.color = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon size={18} />
            <span>{label}</span>
          </div>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        {isExpanded && (
          <div style={{ backgroundColor: '#151923', paddingLeft: '20px' }}>
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveItem(item.path)}
                style={{
                  width: '100%',
                  display: 'block',
                  padding: '8px 20px',
                  border: 'none',
                  background: activeItem === item.path ? '#3b82f6' : 'transparent',
                  color: activeItem === item.path ? '#ffffff' : '#94a3b8',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item.path) {
                    e.currentTarget.style.backgroundColor = '#2d3548';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item.path) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      width: collapsed ? '70px' : '280px',
      height: '100vh',
      backgroundColor: '#1a1f2e',
      borderRight: '1px solid #2d3548',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      transition: 'width 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ 
        padding: collapsed ? '24px 10px' : '24px 20px', 
        borderBottom: '1px solid #2d3548',
        marginBottom: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: collapsed ? 'center' : 'flex-start',
        position: 'relative'
      }}>
        {!collapsed ? (
          <>
            <h2 style={{ 
              color: '#60a5fa', 
              margin: 0, 
              fontSize: '20px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Brain size={24} />
              COSMOS-ITS
            </h2>
            <p style={{ 
              color: '#94a3b8', 
              margin: '4px 0 0 0', 
              fontSize: '12px' 
            }}>
              AI Learning Agent
            </p>
          </>
        ) : (
          <Brain size={24} style={{ color: '#60a5fa' }} />
        )}
        
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '2px solid #3b82f6',
            background: '#1a1f2e',
            color: '#3b82f6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1f2e';
            e.currentTarget.style.color = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1 }}>
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            padding: collapsed ? '10px' : '10px 20px',
            border: 'none',
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '12px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s',
            marginBottom: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2d3548';
            e.currentTarget.style.color = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <Menu size={18} /> : (
            <>
              <Menu size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>
        <MenuItem icon={Home} label="Dashboard" path="/" />
        <MenuItem icon={BookOpen} label="Courses" path="/courses" />
        <MenuItem icon={GraduationCap} label="Learning Path" path="/learning-path" />
        
        <SubMenuItem 
          icon={Brain} 
          label="AI Tutor" 
          menuKey="ai-tutor"
          items={[
            { label: 'Chat Assistant', path: '/ai-tutor/chat' },
            { label: 'Recommendations', path: '/ai-tutor/recommendations' },
            { label: 'Feedback & Review', path: '/ai-tutor/feedback' }
          ]}
        />
        
        <MenuItem icon={Target} label="Assessments" path="/assessments" />
        <MenuItem icon={BarChart3} label="Progress Analytics" path="/progress" />
        <MenuItem icon={Lightbulb} label="Knowledge Base" path="/knowledge-base" />
        <MenuItem icon={FileText} label="Resources" path="/resources" />
        
        <SubMenuItem 
          icon={Users} 
          label="Community" 
          menuKey="community"
          items={[
            { label: 'Forums', path: '/community/forums' },
            { label: 'Study Groups', path: '/community/study-groups' }
          ]}
        />

        <div style={{ 
          borderTop: '1px solid #2d3548', 
          margin: '16px 0',
          paddingTop: '16px'
        }}>
          <MenuItem icon={Settings} label="Settings" path="/settings" />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;