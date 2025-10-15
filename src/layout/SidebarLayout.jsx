import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Shared/Sidebar/Sidebar";


const SidebarLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar></Sidebar>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;