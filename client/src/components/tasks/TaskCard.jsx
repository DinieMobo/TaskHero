import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  PriorityStyles,
  Task_Type,
  BGS,
  formatDate,
} from "../../utils/index.js";
import { AddSubTask, TaskAssets, TaskColor, TaskDialog } from "./index";
import UserInfo from "../UserInfo";

const Icons = {
  High: <MdKeyboardDoubleArrowUp />,
  Medium: <MdKeyboardArrowUp />,
  Low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task, index }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className={clsx(
          "w-full h-fit bg-white dark:bg-[#1f1f1f] rounded-lg overflow-hidden shadow-sm",
          "transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg",
          "border-l-4 stagger-item",
          isHovered ? "border-blue-500" : "border-transparent"
        )}
        style={{ animationDelay: `${index * 0.05}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full flex justify-between p-4">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PriorityStyles[task?.priority]
            )}
          >
            <span
              className={clsx("text-lg transition-transform duration-200", isHovered && "scale-110")}
            >
              {Icons[task?.priority]}
            </span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>
          <TaskDialog task={task} />
        </div>

        <Link to={`/task/${task._id}`}>
          <div className="flex items-center gap-2 px-4 py-2">
            <TaskColor className={Task_Type[task.stage]} />
            <h4 className="text-lg line-clamp-1 text-black dark:text-white font-semibold">
              {task?.title}
            </h4>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
            {formatDate(new Date(task?.date))}
          </span>
        </Link>

        <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2" />

        <div className="flex items-center justify-between px-4 mb-2">
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks}
            assets={task?.assets?.length}
          />

          <div className="flex flex-row-reverse">
            {task?.team?.length > 0 &&
              task?.team?.map((m, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1 transform transition-transform",
                    isHovered && `hover:translate-y-${-index} hover:z-10`,
                    BGS[index % BGS?.length]
                  )}
                >
                  <UserInfo user={m} />
                </div>
              ))}
          </div>
        </div>

        {task?.subTasks?.length > 0 ? (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700 px-4">
            <h5 className="text-base line-clamp-1 text-black dark:text-gray-400">
              {task?.subTasks[0].title}
            </h5>

            <div className="p-2 space-x-8">
              <span className="text-sm text-gray-600 dark:text-gray-500">
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium">
                {task?.subTasks[0]?.tag}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700 px-4">
            <span className="text-gray-500">No Sub-Task</span>
          </div>
        )}

        <div className="w-full p-2">
          <button
            disabled={user.isAdmin ? false : true}
            onClick={() => setOpen(true)}
            className={clsx(
              "w-full flex gap-4 items-center justify-center text-sm text-gray-500 font-semibold py-2 rounded-md",
              "transition-colors duration-300",
              user.isAdmin
                ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                : "disabled:cursor-not-allowed disabled:text-gray-300"
            )}
          >
            <IoMdAdd className={clsx("text-lg", isHovered && "animate-pulse")} />
            <span>Add Subtask</span>
          </button>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default React.memo(TaskCard);