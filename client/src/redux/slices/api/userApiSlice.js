import { USERS_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getUserTaskStatus: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-status`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `${USERS_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
      // Add proper response handling
      transformResponse: (response) => {
        // Ensure we always return an array
        if (!response || !Array.isArray(response)) {
          console.warn("Unexpected notifications response format", response);
          return [];
        }
        return response;
      },
      providesTags: ['Notifications'],
      keepUnusedDataFor: 30, // Refresh data after 30 seconds
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    userAction: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    markNotiAsRead: builder.mutation({
      query: ({ isReadType, id }) => ({
        // Use absolute URL path to ensure correct routing
        url: `/api${USERS_URL}/read-noti`,
        method: "PUT",
        body: { isReadType, id },
        credentials: "include",
      }),
      invalidatesTags: ['Notifications'],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getTeamList: builder.query({
      query: ({ search }) => ({
        url: `${USERS_URL}/team?search=${search || ""}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => {
        // Add error handling for when response is not as expected
        if (!response || !Array.isArray(response)) {
          return [];
        }
        return response;
      },
      keepUnusedDataFor: 5, // Keep data cached for 5 seconds
      providesTags: ['TeamList'],
    }),

    getUserStats: builder.query({
      query: () => ({
        url: `${USERS_URL}/stats`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 60, // Cache for 60 seconds
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useDeleteUserMutation,
  useUserActionMutation,
  useChangePasswordMutation,
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
  useGetUserTaskStatusQuery,
  useGetTeamListQuery,
  useGetUserStatsQuery,
} = userApiSlice;