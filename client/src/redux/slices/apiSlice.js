import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8800',
  // Ensure credentials are properly configured
  credentials: 'include',
  prepareHeaders: (headers) => {
    // You might not need special headers for public endpoints
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Task', 'TeamList'],
  endpoints: () => ({}),
});
