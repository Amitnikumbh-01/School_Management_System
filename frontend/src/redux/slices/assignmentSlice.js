import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/assignments';

// Get assignments
export const getAssignments = createAsyncThunk(
  'assignment/getAssignments',
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
        error.response?.data?.message || 'Failed to fetch assignments'
      );
    }
  }
);

// Create assignment
export const createAssignment = createAsyncThunk(
  'assignment/create',
  async (assignmentData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.post(API_URL, assignmentData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create assignment');
    }
  }
);

// Update assignment
export const updateAssignment = createAsyncThunk(
  'assignment/update',
  async ({ assignmentId, ...assignmentData }, { getState, rejectWithValue }) => {
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
        `${API_URL}/${assignmentId}`,
        assignmentData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update assignment'
      );
    }
  }
);

// Add these thunks
export const submitAssignment = createAsyncThunk(
  'assignment/submit',
  async ({ assignmentId, submission }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/${assignmentId}/submit`,
        { submission },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit assignment');
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignment/delete',
  async (assignmentId, { getState, rejectWithValue }) => {
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

      await axios.delete(`${API_URL}/${assignmentId}`, config);
      return assignmentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete assignment'
      );
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState: {
    assignments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAssignmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get assignments
      .addCase(getAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(getAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create assignment
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update assignment
      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit assignment
      .addCase(submitAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      })
      // Delete assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(a => a._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAssignmentError } = assignmentSlice.actions;
export default assignmentSlice.reducer; 