import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Shared/Sidebar/Sidebar";



export default function SidebarLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar section */}
      {/* <Sidebar /> */}

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
