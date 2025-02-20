import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subjects';

export const getSubjects = createAsyncThunk('subject/getSubjects', async (_, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
});

export const createSubject = createAsyncThunk('subject/createSubject', async (subjectData, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const response = await axios.post(API_URL, subjectData, config);
  return response.data;
});

const subjectSlice = createSlice({
  name: 'subject',
  initialState: {
    subjects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
      });
  },
});

export default subjectSlice.reducer; 