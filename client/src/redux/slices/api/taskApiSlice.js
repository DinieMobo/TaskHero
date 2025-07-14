import { TASKS_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

// Rename this to avoid confusion - this is an endpoint injection, not a new API slice
export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/update/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getAllTask: builder.query({
      query: ({ strQuery = "", isTrashed = "", search = "" }) => ({
        url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => {
        if (!response) {
          return { tasks: [] };
        }
        return response;
      },
      providesTags: ['Tasks'],
    }),

    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    postTaskActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    trashTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/${data.id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ['Tasks'],
    }),

    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ['Tasks'],
    }),

    getDasboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
    }),

    changeTaskStage: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/change-stage/${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    changeSubTaskStatus: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/change-status/${data?.id}/${data?.subId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

// Export your hooks from the injected endpoints
export const {
  usePostTaskActivityMutation,
  useCreateTaskMutation,
  useGetAllTaskQuery,
  useCreateSubTaskMutation,
  useTrashTaskMutation,
  useDeleteRestoreTaskMutation,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useGetSingleTaskQuery,
  useGetDasboardStatsQuery,
  useChangeTaskStageMutation,
  useChangeSubTaskStatusMutation,
} = taskApiSlice;