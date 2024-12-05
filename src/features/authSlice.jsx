import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode"; 
import { loginUser } from "./authApi";
import { useDispatch } from "react-redux";

// Thunk to handle user login
export const loginUserData = createAsyncThunk(
  "auth/loginUserData",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const response = await loginUser(email, password, role);
      return response?.data; 
    } catch (error) {
      return rejectWithValue(error?.response?.data || error); 
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: null,
    userId: null,
    status: "idle",
    error: null,
  },
  reducers: {
    // Logout reducer
    logout(state) {
      state.userData = null;
      state.userId = null;
      localStorage.removeItem("userAuthToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserData.pending, (state) => {
        state.status = "loading"; 
      })
      .addCase(loginUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
    localStorage.setItem('userAuthToken', action.payload.accessToken);  
        
        try {

          const token = localStorage.getItem("userAuthToken");
          if (token) {
            const decodedToken = jwtDecode(token);
            state.userData = decodedToken; 
            state.userId = decodedToken?.id || decodedToken?._id; 
            localStorage.setItem("role", decodedToken?.role )
   
          } else {
            state.error = "Invalid token format"; 
          }
        } catch (error) {
          state.error = "Invalid token"; 
        }
      })
      .addCase(loginUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed"; 
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

export const useAuth = () => {
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(logout());
  };

  return { logoutUser };
};
