import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setselecteduser } from "./redux/authslice";

const AVATAR_PALETTE = [
  ["bg-indigo-100", "text-indigo-700"],
  ["bg-violet-100", "text-violet-700"],
  ["bg-sky-100", "text-sky-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-rose-100", "text-rose-700"],
  ["bg-amber-100", "text-amber-700"],
  ["bg-teal-100", "text-teal-700"],
  ["bg-fuchsia-100", "text-fuchsia-700"],
];

function getAvatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx] || AVATAR_PALETTE[0];
}

function User({ user }) {
  const dispatch = useDispatch();
  const selecteduser = useSelector((state) => state.auth.selecteduser);
  const onlineusers = useSelector((state) => state.conversation.onlineusers);
  const unreadCounts = useSelector((state) => state.conversation.unreadCounts);

  const isSelected = selecteduser?._id === user._id;
  const isOnline = onlineusers.includes(user._id);
  const unreadCount = unreadCounts[user._id] || 0;

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const [bgClass, textClass] = getAvatarColor(user.name);

  return (
    <div
      onClick={() => dispatch(setselecteduser(user))}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 border ${
        isSelected
          ? "bg-indigo-50 border-indigo-200 shadow-sm"
          : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm"
      }`}
    >
      {/* Selected accent bar */}
      {isSelected && (
        <div className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-indigo-500 rounded-r-full" />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold select-none ring-2 ${
            isSelected
              ? "bg-indigo-600 text-white ring-indigo-200"
              : `${bgClass} ${textClass} ring-white`
          }`}
        >
          {getInitials(user.name)}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm font-semibold truncate leading-tight ${
              isSelected ? "text-indigo-700" : "text-gray-800"
            }`}
          >
            {user.name}
          </span>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white tabular-nums">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <p
          className={`text-xs mt-0.5 font-medium flex items-center gap-1 ${
            isSelected ? "text-indigo-400" : isOnline ? "text-emerald-500" : "text-gray-400"
          }`}
        >
          {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
          {isOnline ? "Active now" : "Offline"}
        </p>
      </div>
    </div>
  );
}

export default User;