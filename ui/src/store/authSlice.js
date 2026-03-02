import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as AuthService from "../services/authService";

const getInitialState = () => {
  const user = localStorage.getItem("user");
  console.log("Loading initial auth state, user from localStorage:", user);

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      console.log("Initial state: isLoggedIn=true, user=", parsedUser);
      return { isLoggedIn: true, user: parsedUser };
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      return { isLoggedIn: false, user: null };
    }
  }

  console.log("Initial state: isLoggedIn=false, no stored user");
  return { isLoggedIn: false, user: null };
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(username, password);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      console.log("Attempting login with:", username);
      const response = await AuthService.login(username, password);
      console.log("Login response:", response);
      return { user: response };
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || error.message || "Login failed";
      console.error("Rejecting with:", message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  AuthService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoggedIn = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoggedIn = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      console.log("Login fulfilled, updating state");
      state.isLoggedIn = true;
      state.user = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      console.log("Login rejected");
      state.isLoggedIn = false;
      state.user = null;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    });
  },
});

export default authSlice.reducer;
