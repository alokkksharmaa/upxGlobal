import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Thunks ─────────────────────────────────────────────────────
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const { refreshToken } = getState().auth;
  try {
    await api.post('/auth/logout', { refreshToken });
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.admin;
  } catch {
    return rejectWithValue(null);
  }
});

// ── Slice ──────────────────────────────────────────────────────
const token = localStorage.getItem('accessToken');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    admin: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginAdmin.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.token = payload.accessToken;
        s.refreshToken = payload.refreshToken;
        s.admin = payload.admin;
      })
      .addCase(loginAdmin.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })
      // Logout
      .addCase(logout.fulfilled, (s) => {
        s.token = null;
        s.refreshToken = null;
        s.admin = null;
      })
      // Me
      .addCase(fetchMe.fulfilled, (s, { payload }) => {
        s.admin = payload;
      });
  },
});

export default authSlice.reducer;
