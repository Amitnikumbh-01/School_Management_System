import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classes';

export const getClasses = createAsyncThunk(
  'class/getClasses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();

      if (!userInfo || !userInfo.token) {
        throw new Error('No auth token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch classes'
      );
    }
  }
);

export const createClass = createAsyncThunk(
  'class/create',
  async (classData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      if (!userInfo || !userInfo.token) {
        throw new Error('No auth token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.post(API_URL, classData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create class'
      );
    }
  }
);

export const updateClass = createAsyncThunk(
  'class/update',
  async ({ classId, ...classData }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      if (!userInfo || !userInfo.token) {
        throw new Error('No auth token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.put(
        `${API_URL}/${classId}`,
        classData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update class'
      );
    }
  }
);

export const deleteClass = createAsyncThunk(
  'class/delete',
  async (classId, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      if (!userInfo || !userInfo.token) {
        throw new Error('No auth token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`${API_URL}/${classId}`, config);
      return classId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete class'
      );
    }
  }
);

export const addStudent = createAsyncThunk(
  'class/addStudent',
  async ({ classId, email }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      if (!userInfo || !userInfo.token) {
        throw new Error('No auth token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/${classId}/students`,
        { email },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add student'
      );
    }
  }
);

export const removeStudent = createAsyncThunk(
  'class/removeStudent',
  async ({ classId, studentId }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      if (!userInfo || !userInfo.token) {
        throw new Error('No auth token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.delete(
        `${API_URL}/${classId}/students/${studentId}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove student'
      );
    }
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState: {
    classes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearClassError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter(c => c._id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeStudent.fulfilled, (state, action) => {
        const index = state.classes.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      });
  },
});

export const { clearClassError } = classSlice.actions;
export default classSlice.reducer; 