import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { resetMessages, getallmessages, setCurrentChatUser, markMessagesAsRead } from "./redux/messgaeslice";
import { initSocket, disconnectSocket } from "./socket";
import { FileText, Download, Image as ImageIcon, File, Music, Video, Play, Pause } from "lucide-react";

function Messages() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state.auth.selecteduser);
  const messages = useSelector((state) => state.conversation.messages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // console.log("All Messages:", messages);

  useEffect(() => {
    if (currentUser?.id) {
      initSocket(dispatch, currentUser.id);
    }
    return () => {
      disconnectSocket();
    };
  }, [dispatch, currentUser?.id]);

  useEffect(() => {
    if (selectedUser?._id) {
      setIsLoading(true);
      dispatch(resetMessages());
      dispatch(setCurrentChatUser(selectedUser._id));
      dispatch(getallmessages(selectedUser._id))
        .unwrap()
        .then(() => {
          dispatch(markMessagesAsRead(selectedUser._id));
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(scrollToBottom, 100);
        });
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getInitials = (name) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    return format(new Date(timestamp), "h:mm a");
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleFileDownload = (fileUrl, fileName) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoTypes = ['mp4', 'webm', 'mov', 'avi'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'webm'];
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'];

    if (imageTypes.includes(extension)) return <ImageIcon className="text-blue-500" size={18} />;
    if (videoTypes.includes(extension)) return <Video className="text-purple-500" size={18} />;
    if (audioTypes.includes(extension)) return <Music className="text-green-500" size={18} />;
    if (documentTypes.includes(extension)) return <FileText className="text-orange-500" size={18} />;
    
    return <File className="text-gray-500" size={0} />;
  };

  const renderMessageContent = (message) => {
    switch(message.messageType) {
      case 'image':
        return (
          <div className="message-content">
            <div className="relative group">
              <img 
                src={message.fileUrl} 
                alt={message.fileName || "Image"} 
                className="rounded-lg max-w-[280px] max-h-[150px] cursor-zoom-in transition-transform"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                <div className="flex items-center justify-between text-white">
                  <span className="text-xs truncate max-w-[70%]">{message.fileName}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileDownload(message.fileUrl, message.fileName);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="message-content max-w-sm">
            <div 
              className="flex items-center gap-3 p-3 bg-white/90 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm"
              onClick={() => window.open(message.fileUrl, '_blank')}
            >
              {getFileIcon(message.fileName)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-gray-900">{message.fileName}</div>
                <div className="text-xs text-gray-500 flex items-center gap-4">
                  <span>{formatFileSize(message.fileSize)}</span>
                 
                
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileDownload(message.fileUrl, message.fileName);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Download"
              >
                <Download size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="message-content max-w-sm">
            <div className="rounded-lg overflow-hidden">
              <video 
                controls
                className="w-full max-h-[300px]"
                poster={message.thumbnail}
              >
                <source src={message.fileUrl} type={`video/${message.fileName?.split('.').pop()}`} />
                Your browser doesn't support video playback.
              </video>
              <div className="p-2 bg-white border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate max-w-[70%]">{message.fileName}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileDownload(message.fileUrl, message.fileName);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="message-content max-w-sm">
            <div className="p-3 bg-white/90 rounded-lg border border-gray-100 shadow-sm">
              <audio 
                controls 
                className="w-full h-8 audio-player"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '8px'
                }}
              >
                <source src={message.voiceMessage} type="audio/webm" />
                Your browser doesn't support audio playback.
              </audio>
            </div>
          </div>
        );
        
      default:
        return <p className="text-sm whitespace-pre-wrap">{message.message}</p>;
    }
  };

  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-center max-w-sm w-full space-y-4">
          <div className="w-16 h-16 mx-auto bg-[#25D366]/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#25D366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">
            {selectedUser ? "Start a conversation!" : "Select a user to start chatting"}
          </p>
          <p className="text-sm text-gray-500">
            {selectedUser ? "Send a message to begin chatting" : "Choose a contact from the left to start messaging"}
          </p>
        </div>
      </div>
    );
  }

  const groupedMessages = [];
  let currentGroup = null;

  messages.forEach((message, index) => {    
    const isSender = message.senderid === currentUser?.id;

    if (!currentGroup || currentGroup.isSender !== isSender) {
      if (currentGroup) {
        groupedMessages.push(currentGroup);
      }
      currentGroup = {
        isSender,
        messages: [message],
        firstMessageIndex: index
      };
    } else {
      currentGroup.messages.push(message);
    }
  });

  if (currentGroup) {
    groupedMessages.push(currentGroup);
  }

  return (
    <div className="flex flex-col p-4 space-y-2 overflow-y-auto h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        groupedMessages.map((group, groupIndex) => (
          <div 
            key={groupIndex} 
            className={`flex w-full ${group.isSender ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex ${group.isSender ? "flex-row-reverse" : "flex-row"} items-start gap-1 max-w-[85%]`}>
              {!group.isSender && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mt-1">
                  <div className="w-full h-full bg-[#DFE5E7] flex items-center justify-center text-xs font-medium text-gray-600">
                    {getInitials(selectedUser?.name)}
                  </div>
                </div>
              )}
              <div className={`flex flex-col ${group.isSender ? "items-end" : "items-start"} space-y-0.5`}>
                {group.messages.map((message, msgIndex) => (
                  <div
                    key={msgIndex}
                    className={`group relative rounded-lg px-3 py-2 shadow-md transition-shadow duration-200 ${
                      group.isSender
                        ? "bg-[#D9FDD3] text-gray-800"
                        : "bg-white text-gray-800"
                    } ${
                      msgIndex === 0
                        ? group.isSender
                          ? "rounded-br-none"
                          : "rounded-bl-none"
                        : msgIndex === group.messages.length - 1
                        ? group.isSender
                          ? "rounded-tr-none"
                          : "rounded-tl-none"
                        : group.isSender
                        ? "rounded-r-none"
                        : "rounded-l-none"
                    }`}
                  >
                    <div className="relative">
                      {renderMessageContent(message)}
                      <div className={`flex items-center justify-end gap-1 mt-0.5 ${
                        group.isSender ? "text-[#667781]" : "text-gray-500"
                      }`}>
                        <span className="text-[0.6875rem] min-w-[65px] text-right">
                          {formatMessageTime(message.time)}
                        </span>
                        {group.isSender && (
                          <svg viewBox="0 0 16 11" width="16" height="11" className="fill-current">
                            <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7019 6.00355 1.59846 5.95894 1.48079 5.95894C1.34889 5.95894 1.22869 6.01779 1.12019 6.13547C1.01169 6.25315 0.95744 6.38506 0.95744 6.53119C0.95744 6.67732 1.01169 6.80923 1.12019 6.92691L3.93641 9.59277C4.05409 9.71045 4.17429 9.76929 4.29697 9.76929C4.44311 9.76929 4.57501 9.70557 4.69269 9.57812L11.2839 1.50586C11.3923 1.38818 11.4466 1.25628 11.4466 1.11014C11.4466 0.964007 11.3923 0.832031 11.2839 0.714355L11.0714 0.652832ZM15.0714 0.652832C14.991 0.585124 14.8894 0.55127 14.7667 0.55127C14.6186 0.55127 14.4916 0.610514 14.3858 0.729004L8.19688 8.36523L7.85621 8.04004C7.76699 7.95082 7.66354 7.90621 7.54587 7.90621C7.41397 7.90621 7.29377 7.96507 7.18527 8.08275C7.07677 8.20043 7.02252 8.33233 7.02252 8.47846C7.02252 8.62459 7.07677 8.7565 7.18527 8.87418L7.93641 9.59277C8.05409 9.71045 8.17429 9.76929 8.29697 9.76929C8.44311 9.76929 8.57501 9.70557 8.69269 9.57812L15.2839 1.50586C15.3923 1.38818 15.4466 1.25628 15.4466 1.11014C15.4466 0.964007 15.3923 0.832031 15.2839 0.714355L15.0714 0.652832Z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className={`absolute ${
                      group.isSender ? "-right-2" : "-left-2"
                    } top-0 w-2 h-2 ${
                      group.isSender ? "bg-[#D9FDD3]" : "bg-white"
                    } transform ${
                      group.isSender ? "rotate-45" : "-rotate-45"
                    }`} />
                  </div>
                ))}
              </div>
              {group.isSender && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden mt-1">
                  <div className="w-full h-full bg-[#DFE5E7] flex items-center justify-center text-xs font-medium text-gray-600">
                    {getInitials(currentUser?.name)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Messages; 