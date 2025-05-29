import React, { useState, useRef, useEffect } from "react";
import { Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic, Image, ArrowLeft, ChevronDown, X } from "lucide-react";
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


  const onlineuser = useSelector((state)=>state.conversation.onlineusers);
  const onlineuser2 = onlineuser.includes(selecteduser._id)
  console.log("userloneke",onlineuser2)

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const getStatusColor = (status = "online") => {
    const statusMap = {
      online: "bg-emerald-500",
      away: "bg-amber-500",
      offline: "bg-slate-300"
    };
    return statusMap[status.toLowerCase()] || statusMap.online;
  };

  const userName = selecteduser?.name || "No user selected";
  const avatarInitials = getInitials(userName);
  const isUserSelected = !!selecteduser?._id;

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setShowAttachmentMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview({
          type: 'image',
          url: e.target.result,
          name: file.name,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview({
          type: 'video',
          url: e.target.result,
          name: file.name,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview({
        type: 'file',
        name: file.name,
        size: file.size,
        extension: file.name.split('.').pop().toLowerCase()
      });
    }

    setShowAttachmentMenu(false);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleSendMessage = () => {
    if ((sendmessages?.trim() || selectedFile) && selecteduser?._id) {      const messageType = selectedFile 
        ? selectedFile.type.startsWith('image/') 
          ? 'image' 
          : selectedFile.type.startsWith('video/')
            ? 'video'
            : 'file'
        : 'text';

      const message = {
        message: sendmessages,
        senderid: requester.id,
        receiverid: selecteduser._id,
        time: new Date().toISOString(),
        messageType
      };

      dispatch(sendmessage({ 
        id: selecteduser._id, 
        message, 
        file: selectedFile 
      }));

      sendsetmessages("");
      clearSelectedFile();

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleEmojiClick = (emojiObject) => {
    sendsetmessages(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
    setShowAttachmentMenu(false);
  };

  const toggleAttachmentMenu = () => {
    setShowAttachmentMenu(prev => !prev);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-50">
      {isUserSelected ? (
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-4 bg-white shadow-sm">
          <div className="flex items-center space-x-3">
            <button className="md:hidden p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative">
              <div className={`rounded-full ml-3 w-10 h-10 bg-indigo-100 flex justify-center items-center text-indigo-600 text-md font-medium shadow-sm`}>
                {avatarInitials}
              </div>
            {onlineuser2?  <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor("online")} rounded-full border-2 border-white`}></div>:""}
            </div>
            <div>
              <h3 className="font-medium text-slate-800">{userName}</h3>
              <p className="text-xs text-slate-500">{onlineuser2?"online":"offline"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 ">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>
      ) : (
        <header className="h-16 border-b border-slate-100 flex items-center px-4 bg-white shadow-sm">
          <h3 className="font-medium text-slate-800">Select a conversation</h3>
        </header>
      )}

      <main className="flex-1 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="h-full relative">
          <div className="absolute inset-0 overflow-y-auto px-4">
            <Messages />
          </div>
        </div>
      </main>

      {isUserSelected && (
        <footer className="bg-white border-t border-slate-100 px-4 py-3">
          {filePreview && (
            <div className="mb-3 p-3 bg-slate-100 rounded-md relative">
              <button 
                onClick={clearSelectedFile}
                className="absolute top-1 right-1 bg-slate-300 rounded-full p-1 hover:bg-slate-400"
              >
                <X className="h-4 w-4 text-slate-700" />
              </button>
                {filePreview.type === 'image' ? (
                <div className="flex items-center">
                  <img 
                    src={filePreview.url} 
                    alt="Preview" 
                    className="h-20 max-w-[100px] object-cover rounded" 
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{filePreview.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(filePreview.size)}</p>
                  </div>
                </div>
              ) : filePreview.type === 'video' ? (
                <div className="flex items-center">
                  <video 
                    src={filePreview.url}
                    className="h-20 max-w-[100px] object-cover rounded"
                    preload="metadata"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{filePreview.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(filePreview.size)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="h-16 w-16 bg-slate-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">{filePreview.extension}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{filePreview.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(filePreview.size)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="relative" ref={attachmentMenuRef}>
              <button 
                onClick={toggleAttachmentMenu}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/zip,.doc,.docx,.pdf,.txt,.zip"
              />
              
              {showAttachmentMenu && (
                <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-slate-100 py-2 w-48 z-50">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"                    onClick={() => {
                      fileInputRef.current.accept = "image/*,video/*";
                      fileInputRef.current.click();
                    }}
                  >
                    <Image className="h-4 w-4 text-slate-500" />
                    <span>Photos & Videos</span>
                  </button>
                  
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    onClick={() => {
                      fileInputRef.current.accept = "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.doc,.docx,.pdf,.txt";
                      fileInputRef.current.click();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-500">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span>Documents</span>
                  </button>
                  
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    onClick={() => {
                      fileInputRef.current.accept = "audio/*";
                      fileInputRef.current.click();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-500">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    <span>Audio</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={sendmessages}
                onChange={(e) => sendsetmessages(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-20 py-2.5 text-sm border border-slate-200 rounded-full outline-none focus:ring-0 focus:ring-[#00946f] focus:border-[#00946f] bg-slate-50"
              />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <button 
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors mr-1"
                >
                  <Mic className="h-5 w-5 text-slate-500" />
                </button>
                
                <div ref={emojiPickerRef}>
                  <button 
                    onClick={toggleEmojiPicker}
                    className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Smile className="h-5 w-5 text-slate-500" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 z-50">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width={300}
                        height={400}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!sendmessages.trim() && !selectedFile}
              className={`p-[10px] rounded-full ${
                (sendmessages.trim() || selectedFile)
                   ? "bg-[#00a884] text-white hover:bg-[#00946h]" 
                  : "bg-[#00a884] text-white hover:bg-[#00946f]"
              } transition-colors shadow-sm`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default Right;
