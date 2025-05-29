import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setselecteduser } from "./redux/authslice";

function User({ user }) {
  const dispatch = useDispatch();
  const selecteduser = useSelector((state) => state.auth.selecteduser);
  const onlineusers = useSelector((state) => state.conversation.onlineusers);
  const unreadCounts = useSelector((state) => state.conversation.unreadCounts);
  
  const isSelected = selecteduser?._id === user._id;
  const isOnline = onlineusers.includes(user._id);
  const unreadCount = unreadCounts[user._id] || 0;

  const handleSelectUser = () => {
    console.log("Selecting user:", user);
    dispatch(setselecteduser(user));
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <div
      onClick={handleSelectUser}
      className={`relative group px-4 py-3 transition-all duration-300 cursor-pointer
        ${isSelected ? 'bg-sky-100' : 'bg-white hover:bg-blue-50'}`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar Section */}
        <div className="relative">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center 
            ${isSelected 
              ? 'bg-blue-200 text-blue-600' 
              : 'bg-blue-100 text-blue-600'
            } font-bold text-sm`}>
            {getInitials(user.name)}
          </div>
          {isOnline && (
            <div className="absolute -top-1 -right-1">
              <span className="flex ">
                <span className="  absolute inline-flex h-full w-full rounded-full bg-teal-800 opacity-35"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${isSelected ? 'text-sky-900' : 'text-gray-700'}`}>
              {user.name}
            </h3>
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-md
                ${isSelected 
                  ? 'bg-sky-600 text-white' 
                  : 'bg-blue-100 text-blue-600'}`}>
                {unreadCount}
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 
            ${isSelected 
              ? 'text-sky-600' 
              : isOnline ? 'text-green-600' : 'text-gray-400'}`}>
            {isOnline ? 'online' : 'Offline'}
          </p>
        </div>

        {/* Hover Indicator */}
        <div className={`absolute left-0 top-0 h-full w-1 transition-all duration-300
          ${isSelected 
            ? 'bg-sky-500' 
            : 'bg-transparent group-hover:bg-blue-200'}`}
        />
      </div>
    </div>
  );
}

export default User;