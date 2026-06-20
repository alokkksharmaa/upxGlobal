import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Thunks ─────────────────────────────────────────────────────
export const fetchDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/dashboard');
    return data.stats;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchStudents = createAsyncThunk('admin/students', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/students', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchEnrollments = createAsyncThunk('admin/enrollments', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/enrollments', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAdminCourses = createAsyncThunk('admin/courses', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/courses', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createCourse = createAsyncThunk('admin/createCourse', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/admin/courses', payload);
    return data.course;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateCourse = createAsyncThunk('admin/updateCourse', async ({ id, data: payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/courses/${id}`, payload);
    return data.course;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteCourse = createAsyncThunk('admin/deleteCourse', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/courses/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchPayments = createAsyncThunk('admin/payments', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/payments', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchEmailLogs = createAsyncThunk('admin/emailLogs', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/email-logs', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const retryEmail = createAsyncThunk('admin/retryEmail', async (logId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/admin/email-logs/${logId}/retry`);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

// ── Slice ──────────────────────────────────────────────────────
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    students: null,
    enrollments: null,
    courses: null,
    payments: null,
    emailLogs: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const setPending = (s) => { s.loading = true; s.error = null; };
    const setRejected = (s, { payload }) => { s.loading = false; s.error = payload; };

    builder
      .addCase(fetchDashboard.pending, setPending)
      .addCase(fetchDashboard.fulfilled, (s, { payload }) => { s.loading = false; s.stats = payload; })
      .addCase(fetchDashboard.rejected, setRejected)

      .addCase(fetchStudents.pending, setPending)
      .addCase(fetchStudents.fulfilled, (s, { payload }) => { s.loading = false; s.students = payload; })
      .addCase(fetchStudents.rejected, setRejected)

      .addCase(fetchEnrollments.pending, setPending)
      .addCase(fetchEnrollments.fulfilled, (s, { payload }) => { s.loading = false; s.enrollments = payload; })
      .addCase(fetchEnrollments.rejected, setRejected)

      .addCase(fetchAdminCourses.pending, setPending)
      .addCase(fetchAdminCourses.fulfilled, (s, { payload }) => { s.loading = false; s.courses = payload; })
      .addCase(fetchAdminCourses.rejected, setRejected)

      .addCase(createCourse.pending, setPending)
      .addCase(createCourse.fulfilled, (s) => { s.loading = false; })
      .addCase(createCourse.rejected, setRejected)

      .addCase(updateCourse.pending, setPending)
      .addCase(updateCourse.fulfilled, (s) => { s.loading = false; })
      .addCase(updateCourse.rejected, setRejected)

      .addCase(deleteCourse.pending, setPending)
      .addCase(deleteCourse.fulfilled, (s, { payload }) => {
        s.loading = false;
        if (s.courses?.items) s.courses.items = s.courses.items.filter((c) => c.id !== payload);
      })
      .addCase(deleteCourse.rejected, setRejected)

      .addCase(fetchPayments.pending, setPending)
      .addCase(fetchPayments.fulfilled, (s, { payload }) => { s.loading = false; s.payments = payload; })
      .addCase(fetchPayments.rejected, setRejected)

      .addCase(fetchEmailLogs.pending, setPending)
      .addCase(fetchEmailLogs.fulfilled, (s, { payload }) => { s.loading = false; s.emailLogs = payload; })
      .addCase(fetchEmailLogs.rejected, setRejected)

      .addCase(retryEmail.fulfilled, (s) => { s.loading = false; });
  },
});

export default adminSlice.reducer;
