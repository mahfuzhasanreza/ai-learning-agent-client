import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Shared/Sidebar/Sidebar";


const SidebarLayout = () => {
  return (

    <div style={{
      display: 'flex',             // 👈 keeps sidebar and content side-by-side
      height: '100vh',             // full viewport height
      overflow: 'hidden'
    }}>
      <Sidebar />
      <div style={{
        flex: 1,                   // takes remaining width
        overflowY: 'auto',         // allows only main content to scroll
        backgroundColor: '#0f172a', // optional
        padding: '20px'
      }}>
        {/* Your main content here */}
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default SidebarLayout;