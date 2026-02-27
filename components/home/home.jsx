import React, { useState } from "react";
import Left from "../left/left";
import Right from "../right/right";
import { Menu, X } from "lucide-react";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden" style={{ background: "#f0f2f5" }}>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative
          w-[340px] xl:w-[380px]
          h-full
          bg-white
          shadow-lg lg:shadow-none
          border-r border-gray-200
          transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          z-40
        `}
      >
        <Left />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 relative overflow-hidden">
        <Right />
      </div>
    </div>
  );
}

export default Home;
