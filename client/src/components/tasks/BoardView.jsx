import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {tasks?.map((task, index) => (
        <TaskCard task={task} key={task?._id || index} index={index} />
      ))}
      
      {tasks?.length === 0 && (
        <div className="col-span-1 sm:col-span-2 md:col-span-3 flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p className="text-lg font-medium">No tasks found.</p>
          <p className="text-sm mt-2">Create a new task to get started.</p>
        </div>
      )}
    </div>
  );
};

export default BoardView;