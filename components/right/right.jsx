import React, { useState, useRef, useEffect } from "react";
import { Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic, Image, ArrowLeft, X, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import Messages from "../messages";
import { sendmessage } from "../redux/messgaeslice";

function Right() {
  const selecteduser = useSelector((state) => state.auth.selecteduser);
  const requester = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [sendmessages, sendsetmessages] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const onlineusers = useSelector((state) => state.conversation.onlineusers);
  const isOnline = onlineusers.includes(selecteduser?._id);

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const userName = selecteduser?.name || "No user selected";
  const isUserSelected = !!selecteduser?._id;

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target))
        setShowEmojiPicker(false);
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target))
        setShowAttachmentMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setFilePreview({ type: "image", url: e.target.result, name: file.name, size: file.size });
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setFilePreview({ type: "video", url: e.target.result, name: file.name, size: file.size });
      reader.readAsDataURL(file);
    } else {
      setFilePreview({ type: "file", name: file.name, size: file.size, extension: file.name.split(".").pop().toLowerCase() });
    }
    setShowAttachmentMenu(false);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleSendMessage = () => {
    if ((sendmessages?.trim() || selectedFile) && selecteduser?._id) {
      const messageType = selectedFile
        ? selectedFile.type.startsWith("image/") ? "image"
          : selectedFile.type.startsWith("video/") ? "video" : "file"
        : "text";
      const message = {
        message: sendmessages,
        senderid: requester.id,
        receiverid: selecteduser._id,
        time: new Date().toISOString(),
        messageType
      };
      dispatch(sendmessage({ id: selecteduser._id, message, file: selectedFile }));
      sendsetmessages("");
      clearSelectedFile();
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    sendsetmessages((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = sendmessages.trim() || selectedFile;

  return (
    <div className="flex flex-col h-screen" style={{ background: "#f0f2f5" }}>
      {/* Header */}
      {isUserSelected ? (
        <header className="flex-shrink-0 h-[64px] flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-600">{getInitials(userName)}</span>
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{userName}</h3>
              <p className={`text-xs font-medium ${isOnline ? "text-emerald-500" : "text-gray-400"}`}>
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-all" title="Voice call">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-all" title="Video call">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>
      ) : (
        <header className="flex-shrink-0 h-[64px] flex items-center px-6 bg-white border-b border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400">Select a conversation to start chatting</p>
        </header>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto chat-scrollbar">
          <Messages />
        </div>
      </main>

      {/* Footer / Input */}
      {isUserSelected && (
        <footer className="flex-shrink-0 bg-white border-t border-gray-100 px-4 sm:px-5 py-3">
          {/* File preview */}
          {filePreview && (
            <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 relative">
              <button
                onClick={clearSelectedFile}
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-gray-600" />
              </button>
              {filePreview.type === "image" ? (
                <div className="flex items-center gap-3">
                  <img src={filePreview.url} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{filePreview.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(filePreview.size)}</p>
                  </div>
                </div>
              ) : filePreview.type === "video" ? (
                <div className="flex items-center gap-3">
                  <video src={filePreview.url} className="h-16 w-16 object-cover rounded-lg" preload="metadata" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{filePreview.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(filePreview.size)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-500 uppercase">{filePreview.extension}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{filePreview.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(filePreview.size)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Attachment */}
            <div className="relative flex-shrink-0" ref={attachmentMenuRef}>
              <button
                onClick={() => { setShowAttachmentMenu((p) => !p); setShowEmojiPicker(false); }}
                className={`p-2.5 rounded-xl transition-all ${
                  showAttachmentMenu ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,audio/*"
              />

              {showAttachmentMenu && (
                <div className="absolute bottom-14 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-52 z-50 overflow-hidden">
                  {[
                    { label: "Photos & Videos", accept: "image/*,video/*", icon: <Image className="h-4 w-4" /> },
                    { label: "Documents", accept: ".pdf,.doc,.docx,.txt", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    )},
                    { label: "Audio", accept: "audio/*", icon: <Mic className="h-4 w-4" /> }
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      onClick={() => { fileInputRef.current.accept = item.accept; fileInputRef.current.click(); }}
                    >
                      <span className="text-gray-500">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={sendmessages}
                onChange={(e) => sendsetmessages(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-20 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:bg-white text-gray-800 placeholder-gray-400 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                <button className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                  <Mic className="h-4.5 w-4.5" />
                </button>
                <div ref={emojiPickerRef} className="relative">
                  <button
                    onClick={() => { setShowEmojiPicker((p) => !p); setShowAttachmentMenu(false); }}
                    className={`p-1.5 rounded-xl transition-all ${
                      showEmojiPicker ? "text-indigo-500 bg-indigo-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Smile className="h-4.5 w-4.5" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 z-50 shadow-2xl rounded-2xl overflow-hidden">
                      <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={380} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Send */}
            <button
              onClick={handleSendMessage}
              disabled={!canSend}
              className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-2xl transition-all shadow-sm ${
                canSend
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-indigo-200"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </footer>
      )}

      {!isUserSelected && (
        <div className="flex-shrink-0 h-[72px] bg-white border-t border-gray-100" />
      )}

      <style>{`
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .chat-scrollbar { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        .h-4\.5 { height: 1.125rem; }
        .w-4\.5 { width: 1.125rem; }
      `}</style>
    </div>
  );
}

export default Right;
