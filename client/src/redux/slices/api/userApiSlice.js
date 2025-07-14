import { USERS_URL } from "../../../utils/contents";
import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Update user profile
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Get user task status
    getUserTaskStatus: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-status`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Get notifications
    getNotifications: builder.query({
      query: () => ({
        url: `${USERS_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => {
        if (!response || !Array.isArray(response)) {
          console.warn("Unexpected notifications response format", response);
          return [];
        }
        return response;
      },
      providesTags: ['Notifications'],
      keepUnusedDataFor: 30, // 30 seconds
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    // User actions
    userAction: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Mark notifications as read
    markNotificationAsRead: builder.mutation({
      query: ({ isReadType, id }) => ({
        url: `/api${USERS_URL}/read-noti`,
        method: "PUT",
        body: { isReadType, id },
        credentials: "include",
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Get team list
    getTeamList: builder.query({
      query: ({ search }) => ({
        url: `${USERS_URL}/team?search=${search || ""}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => {
        if (!response || !Array.isArray(response)) {
          return [];
        }
        return response;
      },
      keepUnusedDataFor: 5, // 5 seconds
      providesTags: ['TeamList'],
    }),

    // Get user stats
    getUserStats: builder.query({
      query: () => ({
        url: `${USERS_URL}/stats`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 60, // 60 seconds
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useDeleteUserMutation,
  useUserActionMutation,
  useChangePasswordMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useGetUserTaskStatusQuery,
  useGetTeamListQuery,
  useGetUserStatsQuery,
} = userApiSlice;