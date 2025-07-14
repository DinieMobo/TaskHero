import clsx from "clsx";
import moment from "moment";
import { useEffect } from "react";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Chart, Loading } from "../components";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { PriorityStyles, Task_Type, getInitials } from "../utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import StatCard from "../components/Dashboard/StatCard";

const Dashboard = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  // Handle error state - prevents uncaught exceptions if API fails
  if (error) {
    return (
      <div className='py-10 text-center'>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mx-auto max-w-lg">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
            Error Loading Dashboard Data
          </h2>
          <p className="text-red-600 dark:text-red-300">
            {error?.data?.message || error?.error || "Failed to fetch dashboard statistics"}
          </p>
        </div>
      </div>
    );
  }

  // Handle case where data is undefined
  if (!data) {
    return (
      <div className='py-10 text-center'>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mx-auto max-w-lg">
          <h2 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
            No Dashboard Data Available
          </h2>
          <p className="text-yellow-600 dark:text-yellow-300">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const currentTasks = data?.tasks || {};
  const lastMonthTasks = data?.lastMonthTasks || {};

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASKS",
      total: data?.totalTasks || 0,
      lastMonth: data?.lastMonthTotal || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED TASKS",
      total: currentTasks["completed"] || 0,
      lastMonth: lastMonthTasks["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASKS IN PROGRESS",
      total: currentTasks["in progress"] || 0,
      lastMonth: lastMonthTasks["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: currentTasks["todo"] || 0,
      lastMonth: lastMonthTasks["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  return (
    <div className='h-full py-4 animate-fadeIn'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {stats?.map(({ icon, bg, label, total, lastMonth }, index) => (
          <StatCard
            key={index}
            icon={icon}
            bg={bg}
            label={label}
            count={total}
            lastMonth={lastMonth}
          />
        ))}
      </div>

      <div className='w-full bg-white dark:bg-slate-800 my-16 p-4 rounded shadow-md transition-all duration-300 hover:shadow-lg'>
        <h4 className='text-xl text-gray-500 dark:text-gray-300 font-bold mb-2'>
          Task Chart by Priority
        </h4>
        {data?.graphData?.length > 0 ? (
          <Chart data={data?.graphData} />
        ) : (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            No chart data available
          </div>
        )}
      </div>
      
      <div className='grid grid-cols-12 gap-6 py-8'>
        <div className={clsx("col-span-12", user?.isAdmin ? "lg:col-span-8" : "")}>
          <h4 className='text-xl text-gray-500 dark:text-gray-300 font-bold mb-4'>
            Recent Tasks
          </h4>
          {data?.last10Task && Array.isArray(data.last10Task) && data.last10Task.length > 0 ? (
            <TaskTable tasks={data.last10Task} />
          ) : (
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No recent tasks found</p>
            </div>
          )}
        </div>
        
        {user?.isAdmin && (
          <div className="col-span-12 lg:col-span-4">
            <h4 className='text-xl text-gray-500 dark:text-gray-300 font-bold mb-4'>
              Recent Users
            </h4>
            {data?.users && Array.isArray(data.users) ? (
              <UserTable users={data.users} />
            ) : (
              <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  if (!Array.isArray(users) || users.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No users found</p>
      </div>
    );
  }
  
  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className='text-black dark:text-white text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2 text-center'>Status</th>
        <th className='py-2'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    if (!user) return null;
    
    return (
      <tr className='border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-700/30'>
        <td className='py-3'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
              <span className='text-center font-medium'>{getInitials(user?.name || "User")}</span>
            </div>
            <div>
              <p className="font-medium dark:text-gray-300">{user.name || "Unknown"}</p>
              <span className='text-xs text-gray-500 dark:text-gray-400 block mt-0.5'>{user?.role || 'User'}</span>
            </div>
          </div>
        </td>

        <td className='py-2'>
          <div className="flex justify-center">
            <span 
              className={clsx(
                "px-3 py-1 rounded-full text-sm font-medium",
                user?.isActive !== false 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
              )}
            >
              {user?.isActive !== false ? "Active" : "Disabled"}
            </span>
          </div>
        </td>
        
        <td className='py-2 text-sm dark:text-gray-400'>
          {user?.createdAt ? moment(user.createdAt).fromNow() : "N/A"}
        </td>
      </tr>
    );
  };

  return (
    <div className='bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden h-full'>
      <div className="overflow-x-auto">
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {users.map((user, index) => (
              <TableRow key={user?._id || index} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TaskTable = ({ tasks }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
      </div>
    );
  }
  
  const Icons = {
    High: <MdKeyboardDoubleArrowUp />,
    Medium: <MdKeyboardArrowUp />,
    Low: <MdKeyboardArrowDown />,
  };
  
  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className='text-black dark:text-white text-left'>
        <th className='py-3 px-2'>Task Title</th>
        <th className='py-3 px-2'>Priority</th>
        <th className='py-3 px-2'>Stage</th>
        <th className='py-3 px-2 hidden md:table-cell'>Created At</th>
      </tr>
    </thead>
  );
  
  const TableRow = ({ task }) => {
    if (!task) return null;
    
    return (
      <tr className='border-b border-gray-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-slate-700/30'>
        <td className='py-3 px-2'>
          <Link to={`/task/${task._id}`} className="hover:underline">
            <div className='flex items-center gap-2'>
              <div className={clsx("w-4 h-4 rounded-full", Task_Type[task.stage] || "bg-gray-400")} />
              <p className='text-base text-black dark:text-gray-300 line-clamp-1'>
                {task?.title || "Untitled Task"}
              </p>
            </div>
          </Link>
        </td>
        <td className='py-3 px-2'>
          <div className="flex gap-1 items-center">
            <span className={clsx("text-lg", PriorityStyles[task?.priority] || "text-gray-500")}>
              {Icons[task?.priority] || Icons.low}
            </span>
            <span className='capitalize'>{task?.priority || "low"}</span>
          </div>
        </td>
        <td className='py-3 px-2 capitalize'>
          {task.stage || "todo"}
        </td>
        <td className='py-3 px-2 hidden md:table-cell text-gray-500 dark:text-gray-400'>
          {task?.date ? moment(task.date).fromNow() : "N/A"}
        </td>
      </tr>
    );
  };
  
  return (
    <div className="w-full bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks.map((task, id) => (
              <TableRow key={task?._id || id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;