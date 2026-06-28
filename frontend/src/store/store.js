import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dataReducer from './dataSlice';
import techReducer from './techSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    tech: techReducer,
  },
});
