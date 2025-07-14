import { createSlice } from '@reduxjs/toolkit';

// Check if we have a user in localStorage
const userFromStorage = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user')) 
  : null;

// Make sure the isAdmin property is preserved when loading from localStorage
const initialState = {
  user: userFromStorage,
  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // Ensure isAdmin field is included when saving user data
      state.user = action.payload;
      
      // Make sure we're storing the user data with the isAdmin property intact
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;
