import React, { useState } from "react";
import { Search, MessageSquare, LogOut, LogIn, Users as UsersIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Users from "../Users";
import { url } from "../../url";

function Left() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${url}/userroute12/logout`, {}, { withCredentials: true });
      if (res.status === 200) {
        alert(res.data.message);
      }
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">ChatApp</span>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-indigo-600">{getInitials(user.name)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Section label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-5 py-3">
        <UsersIcon className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Contacts</span>
      </div>

      {/* Scrollable user list */}
      <div className="flex-1 overflow-y-auto min-h-0 chat-scrollbar">
        <Users />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100 bg-gray-50">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-indigo-600">{getInitials(user.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.name || "User"}</p>
              <p className="text-xs text-green-500 font-medium">● Active now</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 px-4 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all font-medium text-sm shadow-sm"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      <style>{`
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .chat-scrollbar { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
      `}</style>
    </div>
  );
}

export default Left;