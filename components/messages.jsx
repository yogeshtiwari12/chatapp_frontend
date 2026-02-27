import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { resetMessages, getallmessages, setCurrentChatUser, markMessagesAsRead } from "./redux/messgaeslice";
import { initSocket, disconnectSocket } from "./socket";
import { FileText, Download, Music, Video, File, Image as ImageIcon } from "lucide-react";

// Avatar colour palette (deterministic from name)
const AVATAR_COLORS = [
  ["bg-indigo-100", "text-indigo-700"],
  ["bg-violet-100", "text-violet-700"],
  ["bg-sky-100", "text-sky-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-rose-100", "text-rose-700"],
  ["bg-amber-100", "text-amber-700"],
];

function avatarColor(name = "") {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i] || AVATAR_COLORS[0];
}

function Messages() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state.auth.selecteduser);
  const messages = useSelector((state) => state.conversation.messages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser?.id) {
      initSocket(dispatch, currentUser.id);
    }
    return () => { disconnectSocket(); };
  }, [dispatch, currentUser?.id]);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(resetMessages());
      dispatch(setCurrentChatUser(selectedUser._id));
      dispatch(getallmessages(selectedUser._id))
        .unwrap()
        .then(() => { dispatch(markMessagesAsRead(selectedUser._id)); })
        .finally(() => { setTimeout(scrollToBottom, 100); });
    }
  }, [selectedUser, dispatch]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const formatTime = (ts) => {
    if (!ts) return "";
    return format(new Date(ts), "h:mm a");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const s = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${s[i]}`;
  };

  const handleDownload = (url, name) => {
    const a = document.createElement("a");
    a.href = url; a.download = name || "download";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (["jpg","jpeg","png","gif","webp"].includes(ext)) return <ImageIcon size={18} className="text-blue-500" />;
    if (["mp4","webm","mov","avi"].includes(ext)) return <Video size={18} className="text-purple-500" />;
    if (["mp3","wav","ogg"].includes(ext)) return <Music size={18} className="text-green-500" />;
    if (["pdf","doc","docx","txt","xls","xlsx"].includes(ext)) return <FileText size={18} className="text-orange-500" />;
    return <File size={18} className="text-gray-400" />;
  };

  const renderContent = (msg) => {
    switch (msg.messageType) {
      case "image":
        return (
          <div className="relative group">
            <img
              src={msg.fileUrl}
              alt={msg.fileName || "Image"}
              className="rounded-xl max-w-[260px] max-h-[200px] object-cover cursor-zoom-in"
              onClick={() => window.open(msg.fileUrl, "_blank")}
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
              <span className="text-[11px] text-white truncate max-w-[70%]">{msg.fileName}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(msg.fileUrl, msg.fileName); }}
                className="p-1 rounded-full hover:bg-white/30 text-white transition-colors"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="rounded-xl overflow-hidden max-w-[280px]">
            <video controls className="w-full max-h-[220px]">
              <source src={msg.fileUrl} />
              Your browser doesn&apos;t support video.
            </video>
            <div className="px-3 py-2 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <span className="text-xs text-gray-600 truncate max-w-[60%]">{msg.fileName}</span>
              <button onClick={() => handleDownload(msg.fileUrl, msg.fileName)} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                <Download size={14} className="text-gray-500" />
              </button>
            </div>
          </div>
        );

      case "file":
        return (
          <div
            className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors max-w-[260px]"
            onClick={() => window.open(msg.fileUrl, "_blank")}
          >
            {getFileIcon(msg.fileName)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{msg.fileName}</p>
              <p className="text-xs text-gray-500">{formatFileSize(msg.fileSize)}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDownload(msg.fileUrl, msg.fileName); }} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
              <Download size={16} className="text-gray-500" />
            </button>
          </div>
        );

      case "voice":
        return (
          <div className="p-2 bg-white/80 rounded-xl border border-gray-100 shadow-sm">
            <audio controls className="h-8 max-w-[220px]">
              <source src={msg.voiceMessage} type="audio/webm" />
            </audio>
          </div>
        );

      default:
        return <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>;
    }
  };

  // â”€â”€ Empty state â”€â”€
  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12">
        {selectedUser ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-400">{getInitials(selectedUser.name)}</span>
            </div>
            <p className="text-base font-semibold text-gray-700 mb-1">{selectedUser.name}</p>
            <p className="text-sm text-gray-400 text-center max-w-[240px]">This is the beginning of your conversation. Say hi!</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-400">Select a contact to start chatting</p>
          </>
        )}
      </div>
    );
  }

  // â”€â”€ Group consecutive messages by sender â”€â”€
  const groups = [];
  let cur = null;
  messages.forEach((msg) => {
    const isSender = msg.senderid === currentUser?.id;
    if (!cur || cur.isSender !== isSender) {
      if (cur) groups.push(cur);
      cur = { isSender, messages: [msg] };
    } else {
      cur.messages.push(msg);
    }
  });
  if (cur) groups.push(cur);

  const [senderBg, senderText] = avatarColor(currentUser?.name);
  const [receiverBg, receiverText] = avatarColor(selectedUser?.name);

  return (
    <div className="flex flex-col gap-1 px-4 py-5">
      {groups.map((group, gi) => (
        <div key={gi} className={`flex w-full ${group.isSender ? "justify-end" : "justify-start"} mb-1`}>
          <div className={`flex ${group.isSender ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[78%]`}>
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold select-none ${
                group.isSender ? `${senderBg} ${senderText}` : `${receiverBg} ${receiverText}`
              }`}
            >
              {group.isSender ? getInitials(currentUser?.name) : getInitials(selectedUser?.name)}
            </div>

            {/* Message bubbles */}
            <div className={`flex flex-col gap-0.5 ${group.isSender ? "items-end" : "items-start"}`}>
              {group.messages.map((msg, mi) => {
                const isFirst = mi === 0;
                const isLast = mi === group.messages.length - 1;
                const radiusClass = group.isSender
                  ? `rounded-2xl ${isFirst ? "rounded-tr-sm" : ""} ${isLast ? "" : "rounded-br-sm"}`
                  : `rounded-2xl ${isFirst ? "rounded-tl-sm" : ""} ${isLast ? "" : "rounded-bl-sm"}`;

                return (
                  <div
                    key={mi}
                    className={`relative px-3 py-2 shadow-sm ${
                      group.isSender
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-800 border border-gray-100"
                    } ${radiusClass}`}
                  >
                    {renderContent(msg)}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 ${
                        group.isSender ? "text-indigo-200" : "text-gray-400"
                      }`}
                    >
                      <span className="text-[10.5px] tabular-nums">{formatTime(msg.time)}</span>
                      {group.isSender && (
                        <svg viewBox="0 0 16 11" width="14" height="10" className="fill-current opacity-80">
                          <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7019 6.00355 1.59846 5.95894 1.48079 5.95894C1.34889 5.95894 1.22869 6.01779 1.12019 6.13547C1.01169 6.25315 0.95744 6.38506 0.95744 6.53119C0.95744 6.67732 1.01169 6.80923 1.12019 6.92691L3.93641 9.59277C4.05409 9.71045 4.17429 9.76929 4.29697 9.76929C4.44311 9.76929 4.57501 9.70557 4.69269 9.57812L11.2839 1.50586C11.3923 1.38818 11.4466 1.25628 11.4466 1.11014C11.4466 0.964007 11.3923 0.832031 11.2839 0.714355L11.0714 0.652832ZM15.0714 0.652832C14.991 0.585124 14.8894 0.55127 14.7667 0.55127C14.6186 0.55127 14.4916 0.610514 14.3858 0.729004L8.19688 8.36523L7.85621 8.04004C7.76699 7.95082 7.66354 7.90621 7.54587 7.90621C7.41397 7.90621 7.29377 7.96507 7.18527 8.08275C7.07677 8.20043 7.02252 8.33233 7.02252 8.47846C7.02252 8.62459 7.07677 8.7565 7.18527 8.87418L7.93641 9.59277C8.05409 9.71045 8.17429 9.76929 8.29697 9.76929C8.44311 9.76929 8.57501 9.70557 8.69269 9.57812L15.2839 1.50586C15.3923 1.38818 15.4466 1.25628 15.4466 1.11014C15.4466 0.964007 15.3923 0.832031 15.2839 0.714355L15.0714 0.652832Z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Messages;
