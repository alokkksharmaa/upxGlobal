import { configureStore } from '@reduxjs/toolkit';
import authReducer       from './slices/authSlice';
import coursesReducer    from './slices/coursesSlice';
import adminReducer      from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth:    authReducer,
    courses: coursesReducer,
    admin:   adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({