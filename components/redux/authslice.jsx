import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../url";

const getuser = createAsyncThunk("auth/getuser", async () => {
  const response = await axios.get(
    `${url}/userroute12/getauthuser`,
    {
      withCredentials: true,
    }
  );
  if (response.status === 200) {
    console.log("response", response.data);
    return response.data.user;
  }
  throw new Error("Failed to fetch user data");
});

const getallusers = createAsyncThunk("auth/getalluser", async () => {
  const response = await axios.get(`${url}/userroute12/users`, {
    withCredentials: true,
  });
  if (response.status === 200) {
    console.log("response", response.data);
    return response.data;
  }
  throw new Error("Failed to fetch user data");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    allusers: [],
    selecteduser: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isprofile: false,
  },
  reducers: {
    setAllUsers: (state, action) => {
      state.allusers = action.payload;
    },
    setselecteduser: (state, action) => {
      console.log("Setting selected user:", action.payload);
      state.selecteduser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getuser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
        state.user = null;
        state.isprofile = false;
      })
      .addCase(getuser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isprofile = true;
      })
      .addCase(getuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
        state.user = null;
        state.isprofile = false;
      })
      .addCase(getallusers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallusers.fulfilled, (state, action) => {
        state.loading = false;
        state.allusers = action.payload;
      })
      .addCase(getallusers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export { getuser, getallusers };
export default authSlice.reducer;

export const { setAllUsers, setselecteduser } = authSlice.actions;
