import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    notificationCount: 0,
    currentPage: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload
      );
    },
    markNotificationAsRead: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
    },
    addAllNotifications: (state, action) => {
      const {notifications, currentPage} = action.payload;
      const uniqueNotifications = notifications.filter(
        (newNotification) => !state.notifications.some(
          (existingNotification) => existingNotification._id === newNotification._id
        )
      );
      state.currentPage = currentPage?.page || 1;
    
      state.notifications = [...state.notifications, ...uniqueNotifications];
    },
    updateNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    addOneCountToNotification: (state) => {
      state.notificationCount += 1;
    },
    clearNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    addNewNotification: (state, action) =>{
      const notification = action.payload;

      const isDuplicate = state.notifications.some(
        (existingNotification) => existingNotification._id === notification._id
      );
      if (!isDuplicate) {
        state.notifications = [notification, ...state.notifications];
      }
    },
  },
});

export const { markNotificationAsRead, addAllNotifications, updateNotificationCount, addOneCountToNotification, clearNotificationCount, addNewNotification, removeNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
