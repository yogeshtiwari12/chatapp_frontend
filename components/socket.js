import { io } from "socket.io-client";
import { getallmessages, sendmessage, setMessages, setOnlineUsers } from "./redux/messgaeslice";
import { url } from "../url";


let socket = null;

export const connectSocket = (userId) => {
  if (socket) {
    console.log("Socket is already connected.");
    return;
  }

 socket = io(url, {
   withCredentials: true,
    query: { userId },
  });

  console.log("Socket connected with userId:", userId);
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};


export const sendMessageToServer = (message) => {
  if (!socket) return;
  socket.emit("sendMessage", message);
 
};


export const getonlineusers = () => {
  if (!socket) return;
  console.log("hiiii")
  socket.on("getonlineusers", (onlineUsers) => {
    console.log("Online users:", onlineUsers);
  })


};


export const listenForNewMessages = (dispatch) => {
  console.log("Setting up socket listeners");
  if (!socket) return;

  socket.off("newMessage");
  socket.off("getonlineusers");
  socket.off("messagesRead");

  socket.on("getonlineusers", (onlineUsers) => {
    console.log("Online users:", onlineUsers);
    dispatch(setOnlineUsers(onlineUsers));
  });

  socket.on("newMessage", (newMessage) => {  
    console.log("New message received:", newMessage);

      dispatch(setMessages(newMessage));
  
  
  });
  
  socket.on("messagesRead", (data) => {
    console.log("Messages read by:", data);
    // Update read status for messages
    dispatch(updateMessagesReadStatus(data));
  });
};


export const updateMessagesReadStatus = (data) => ({
  type: "conversation/updateMessagesReadStatus",
  payload: data
});


export const sendSocketUser = (userId) => {
  if (!socket) return;
  socket.emit("setUser", { userId });
};
export const initSocket = async (dispatch, userId) => {
  connectSocket(userId);
  listenForNewMessages(dispatch);
  sendSocketUser(userId);
};
