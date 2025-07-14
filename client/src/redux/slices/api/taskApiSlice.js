import { TASKS_URL } from "../../../utils/contents";
import { apiSlice } from "../apiSlice";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new task
    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Duplicate a task
    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    // Update an existing task
    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/update/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Get all tasks
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

    // Get a single task
    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // Create a subtask
    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Post task activity
    postTaskActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Trash task
    trashTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/${data.id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ['Tasks'],
    }),

    // Delete or restore task
    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ['Tasks'],
    }),

    // Get dashboard stats
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Change task stage
    changeTaskStage: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/change-stage/${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Change Sub task status
    changeSubTaskStatus: builder.mutation({
      query: ({ taskId, subTaskId, data }) => ({
        url: `/api/tasks/change-status/${taskId}/${subTaskId}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

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
  useGetDashboardStatsQuery,
  useChangeTaskStageMutation,
  useChangeSubTaskStatusMutation,
} = taskApiSlice;