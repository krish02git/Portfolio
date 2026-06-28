import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for data fetching
export const fetchWork = createAsyncThunk('data/fetchWork', async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/work/getWork`);
  const data = await response.json();
  return data.experience || [];
});

export const fetchProjects = createAsyncThunk('data/fetchProjects', async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/getProject`);
  const data = await response.json();
  return data.projects || [];
});

export const fetchBlogs = createAsyncThunk('data/fetchBlogs', async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blog/getBlog`);
  const data = await response.json();
  return data.blogs || [];
});

const initialState = {
  experiences: [],
  projects: [],
  blogs: [],
  workStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  projectStatus: 'idle',
  blogStatus: 'idle',
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Work
    builder
      .addCase(fetchWork.pending, (state) => {
        state.workStatus = 'loading';
      })
      .addCase(fetchWork.fulfilled, (state, action) => {
        state.workStatus = 'succeeded';
        state.experiences = action.payload;
      })
      .addCase(fetchWork.rejected, (state) => {
        state.workStatus = 'failed';
      });

    // Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.projectStatus = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectStatus = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.projectStatus = 'failed';
      });

    // Blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.blogStatus = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogStatus = 'succeeded';
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state) => {
        state.blogStatus = 'failed';
      });
  },
});

export default dataSlice.reducer;
