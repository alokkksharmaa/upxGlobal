import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/courses');
    return data.courses;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load courses');
  }
});

export const fetchCourseById = createAsyncThunk('courses/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/courses/${id}`);
    return data.course;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Course not found');
  }
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCourses.fulfilled, (s, { payload }) => { s.loading = false; s.items = payload; })
      .addCase(fetchCourses.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })
      .addCase(fetchCourseById.pending, (s) => { s.loading = true; })
      .addCase(fetchCourseById.fulfilled, (s, { payload }) => { s.loading = false; s.selected = payload; })
      .addCase(fetchCourseById.rejected, (s, { payload }) => { s.loading = false; s.error = payload; });
  },
});

export default coursesSlice.reducer;
