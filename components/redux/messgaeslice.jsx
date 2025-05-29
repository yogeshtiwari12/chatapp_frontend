import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../url";

export const getallmessages = createAsyncThunk(
  "messages/getallmessages",
  async (id) => {
    const response = await axios.get(
      `${url}/messages/getmesages/${id}`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to fetch messages");
  }
);

export const sendmessage = createAsyncThunk(
  "messages/sendmessage",
  async ({ id, message, file }) => {
    const formData = new FormData();
    
    if (message.messageType === 'text') {
      formData.append('message', message.message);
    } else if (message.messageType === 'voice') {
      formData.append('voiceMessage', message.voiceMessage);
    }
    
    formData.append('messageType', message.messageType);
    
    if (file) {
      formData.append('file', file);
    }
    
    const response = await axios.post(
      `${url}/messages/sendmessage/${id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to send message");
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (senderId) => {
    const response = await axios.put(
      `http://localhost:4000/messages/markread/${senderId}`,
      {},
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return { senderId };
    }
    throw new Error("Failed to mark messages as read");
  }
);

export const getUnreadCounts = createAsyncThunk(
  "messages/getUnreadCounts",
  async () => {
    const response = await axios.get(
      `http://localhost:4000/messages/unreadcounts`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to get unread counts");
  }
);

const messagesSlice = createSlice({
  name: "conversation",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    onlineusers: [],
    currentChatUserId: null,
    unreadCounts: {}, 
  },
  reducers: {
    setMessages: (state, action) => {
      const message = action.payload;
      if (
        message.senderid === state.currentChatUserId ||
        message.receiverid === state.currentChatUserId
      ) {
        state.messages.push(message);
      }
      
 
      if (message.senderid !== state.currentChatUserId) {
        if (!state.unreadCounts[message.senderid]) {
          state.unreadCounts[message.senderid] = 0;
        }
        state.unreadCounts[message.senderid]++;
      }
    },
    resetMessages: (state) => {
      state.messages = [];
    },
    setOnlineUsers: (state, action) => {
      state.onlineusers = action.payload;
    },
    setCurrentChatUser: (state, action) => {
      state.currentChatUserId = action.payload;
      
      // Clear unread count for the selected user
      if (state.unreadCounts[action.payload]) {
        state.unreadCounts[action.payload] = 0;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getallmessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallmessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getallmessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendmessage.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        if (payload.newmessage) {
          state.messages.push(payload.newmessage);
        } else {
          state.messages.push(payload);
        }
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        // Mark messages as read in state
        const senderId = action.payload.senderId;
        console.log("Marking messages as read for senderId:", senderId);
        state.messages.forEach(msg => {
          if (msg.senderid === senderId) {
            msg.read = true;
          }
        });
        
        // Clear unread count
        state.unreadCounts[senderId] = 0;
      })
      .addCase(getUnreadCounts.fulfilled, (state, action) => {
        state.unreadCounts = action.payload.counts;
      });
  },
});

export const { setMessages, resetMessages, setOnlineUsers, setCurrentChatUser } =
  messagesSlice.actions;
export default messagesSlice.reducer;
