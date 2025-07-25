import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Tabs } from "../components";
import { TaskColor } from "../components/tasks";
import {
  useChangeSubTaskStatusMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";
import {
  PriorityStyles,
  Task_Type,
  getCompletedSubTasks,
  getInitials,
} from "../utils";

const assets = [
  "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const Icons = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Timeline", icon: <RxActivityLog /> },
];

const TaskTypeIcon = {
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const Activities = ({ activity, id, refetch }) => {
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter activity text");
      return;
    }

    try {
      const data = {
        type: selected?.toLowerCase(),
        activity: text,
      };
      const res = await postActivity({
        data,
        id,
      }).unwrap();
      setText("");
      toast.success(res?.message);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const Card = ({ item }) => {
    return (
      <div className={`flex space-x-4`}>
        <div className='flex flex-col items-center flex-shrink-0'>
          <div className='w-10 h-10 flex items-center justify-center'>
            {TaskTypeIcon[item?.type] || TaskTypeIcon['assigned']}
          </div>
          <div className='h-full flex items-center'>
            <div className='w-0.5 bg-gray-300 h-full'></div>
          </div>
        </div>

        <div className='flex flex-col gap-y-1 mb-8'>
          <p className='font-semibold'>{item?.by?.name || 'User'}</p>
          <div className='text-gray-500 space-x-2'>
            <span className='capitalize'>{item?.type || 'update'}</span>
            <span className='text-sm'>{moment(item?.date || item?.createdAt).fromNow()}</span>
          </div>
          <div className='text-gray-700'>{item?.activity}</div>
        </div>
      </div>
    );
  };

  return (
    <div className='w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto'>
      <div className='w-full md:w-1/2'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>Activities</h4>
        <div className='w-full space-y-0'>
          {activity?.map((item, index) => (
            <Card
              key={`activity-${index}`}
              item={item}
              isConnected={index < activity?.length - 1}
            />
          ))}
        </div>
      </div>

      <div className='w-full md:w-1/3'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>
          Add Activity
        </h4>
        <div className='w-full flex flex-wrap gap-5'>
          {act_types.map((item, index) => (
            <div key={item} className='flex gap-2 items-center'>
              <input
                type='checkbox'
                className='w-4 h-4'
                checked={selected === item ? true : false}
                onChange={(e) => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type ......'
            className='bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500'
          ></textarea>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type='button'
              label='Submit'
              onClick={handleSubmit}
              className='bg-blue-600 text-white rounded'
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  const [subTaskAction, { isLoading: isSubmitting }] = useChangeSubTaskStatusMutation();

  const [selected, setSelected] = useState(0);
  const task = data?.task || [];
  const [activeSubtask, setActiveSubtask] = useState(null);

  const handleSubmitAction = async (el) => {
    try {
      const data = {
        status: !el.status,
      };
      const res = await subTaskAction({
        taskId: el.id,
        subTaskId: el.subId,
        data: data
      }).unwrap();

      toast.success(res?.message);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  const percentageCompleted =
    task?.subTasks?.length === 0
      ? 0
      : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden animate-fadeIn'>
      <div className="flex items-center justify-between mb-4">
        <h1 className='text-2xl text-gray-600 font-bold'>{task?.title}</h1>
        <TaskStageUpdater 
          taskId={id} 
          currentStage={task?.stage} 
          onSuccess={refetch} 
        />
      </div>
      
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow rounded-md px-8 py-8 overflow-y-auto'>
              <div className='w-full md:w-1/2 space-y-8'>
                <div className='flex items-center gap-5'>
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full transition-all duration-300 hover:shadow-md",
                      PriorityStyles[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className='text-lg'>{Icons[task?.priority]}</span>
                    <span className='uppercase'>{task?.priority} Priority</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <TaskColor className={Task_Type[task?.stage]} />
                    <span className='text-black uppercase'>{task?.stage}</span>
                  </div>
                </div>

                <p className='text-gray-500'>
                  Created At: {new Date(task?.date).toDateString()}
                </p>

                <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Assets :</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{task?.assets?.length}</span>
                  </div>
                  <span className='text-gray-400'>|</span>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Sub-Task :</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">{task?.subTasks?.length}</span>
                  </div>
                  <span className='text-gray-400'>|</span>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Progress :</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-1000 ease-out"
                        style={{ width: `${percentageCompleted}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-500 font-semibold text-sm'>
                    Sub-Tasks
                  </p>
                  <div className='space-y-3'>
                    {(task?.subTasks || []).map((el, index) => (
                      <div 
                        key={`subtask-${el?._id || index}`} 
                        className={clsx(
                          'flex gap-3 p-3 rounded-lg transition-all duration-300',
                          activeSubtask === index ? 'bg-gray-100 dark:bg-gray-800' : '',
                          'hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                        onMouseEnter={() => setActiveSubtask(index)}
                        onMouseLeave={() => setActiveSubtask(null)}
                      >
                        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-200'>
                          <MdTaskAlt className='text-violet-600' size={26} />
                        </div>

                        <div className='space-y-1 flex-1'>
                          <div className='flex gap-2 items-center flex-wrap'>
                            <span className='text-sm text-gray-500'>
                              {new Date(el?.date).toDateString()}
                            </span>

                            <span className='px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold lowercase'>
                              {el?.tag}
                            </span>

                            <span
                              className={`px-2 py-0.5 text-center text-sm rounded-full font-semibold ${
                                el?.isCompleted
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {el?.isCompleted ? "done" : "in progress"}
                            </span>
                          </div>
                          <p className='text-gray-700 pb-2 font-medium'>{el?.title}</p>
                          {el?.description && (
                            <p className="text-gray-600 text-sm">{el.description}</p>
                          )}

                          <>
                            <button
                              disabled={isSubmitting}
                              className={clsx(
                                'text-sm outline-none p-2 rounded transition-all duration-300',
                                el?.isCompleted
                                  ? "bg-rose-100 text-rose-800 hover:bg-rose-200"
                                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
                                "disabled:cursor-not-allowed disabled:opacity-50",
                                activeSubtask === index && "shadow-sm"
                              )}
                              onClick={() =>
                                handleSubmitAction({
                                  status: el?.isCompleted,
                                  id: task?._id,
                                  subId: el?._id,
                                })
                              }
                            >
                              {isSubmitting ? (
                                <FaSpinner className='animate-spin' />
                              ) : el?.isCompleted ? (
                                " Mark as Undone"
                              ) : (
                                " Mark as Done"
                              )}
                            </button>
                          </>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-500 font-semibold text-sm'>
                    Task Team
                  </p>
                  <div className='space-y-3'>
                    {task?.team?.map((member, index) => (
                      <div
                        key={`team-${member?._id || index}`}
                        className='flex gap-4 py-2 items-center border-t border-gray-200'
                      >
                        <div
                          className={
                            "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                          }
                        >
                          <span className='text-center'>
                            {getInitials(member?.name)}
                          </span>
                        </div>
                        <div>
                          <p className='text-lg font-semibold'>{member?.name}</p>
                          <span className='text-gray-500'>{member?.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='w-full md:w-1/2 space-y-3'>
                {task?.description && (
                  <div className='mb-10'>
                    <p className='text-lg font-semibold'>Task Description</p>
                    <div className='w-full'>{task?.description}</div>
                  </div>
                )}

                {task?.assets?.length > 0 && (
                  <div className='pb-10'>
                    <p className='text-lg font-semibold'>Assets</p>
                    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {task?.assets?.map((el, index) => (
                        <img
                          key={`asset-${index}`}
                          src={el}
                          alt={`asset-${index}`}
                          className='w-full rounded h-auto md:h-44 2xl:h-52 cursor-pointer transition-all duration-700 md:hover:scale-125 hover:z-50'
                        />
                      ))}
                    </div>
                  </div>
                )}

                {task?.links?.length > 0 && (
                  <div className=''>
                    <p className='text-lg font-semibold'>Support Links</p>
                    <div className='w-full flex flex-col gap-4'>
                      {task?.links?.map((el, index) => (
                        <a
                          key={`link-${index}`}
                          href={el}
                          target='_blank'
                          className='text-blue-600 hover:underline'
                        >
                          {el}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Activities activity={task?.activities} refetch={refetch} id={id} />
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetail;