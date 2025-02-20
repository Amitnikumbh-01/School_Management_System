import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import classReducer from './slices/classSlice';
import subjectReducer from './slices/subjectSlice';
import attendanceReducer from './slices/attendanceSlice';
import assignmentReducer from './slices/assignmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    class: classReducer,
    subject: subjectReducer,
    attendance: attendanceReducer,
    assignment: assignmentReducer,
  },
}); 