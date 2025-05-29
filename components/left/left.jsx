import React from "react";
import { Search, MessageSquare, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Users from "../Users";
import { url } from "../../url";

function Left() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async() => {
    try {
      const res = await axios.post(`${url}/userroute12/logout`, {},
        { withCredentials: true });
      
      if (res.status === 200) {
        alert(res.data.message);
      }
      navigate("/login");
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div className="w-full lg:w-[400px] h-screen bg-white border-r border-gray-200 relative">
      <div className="p-2 sm:p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-2.5 sm:left-3 top-2.5" />
        </div>
      </div>

      <div 
        className="overflow-y-auto divide-y divide-gray-100 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
        style={{ 
          height: 'calc(100vh - (74px + 72px))',
          '@media (min-width: 640px)': {
            height: 'calc(100vh - (70px + 80px))'
          }
        }}
      >
        <Users />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-gray-200 mt-0">
        {user ? ( 
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-400 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
          >
            <LogIn className="h-4 w-4 sm:h-5 sm:w-5 transform rotate-180" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Login</span>
          </button> 
        )}
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          @media (min-width: 640px) {
            width: 6px;
          }
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #CBD5E0;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #A0AEC0;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E0 transparent;
        }
      `}</style>
    </div>
  );
}

export default Left;