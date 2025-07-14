import React, { useState } from 'react';
import { useChangeTaskStageMutation } from '../../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';
import Button from '../Button';
import { Task_Type } from '../../utils';
import { MdArrowForward } from 'react-icons/md';

const TaskStageUpdater = ({ taskId, currentStage, onSuccess }) => {
  const [stage, setStage] = useState(currentStage);
  const [changeTaskStage, { isLoading }] = useChangeTaskStageMutation();
  
  const stageOptions = Object.keys(Task_Type);
  
  const handleStageChange = async () => {
    if (stage === currentStage) return;
    
    try {
      const res = await changeTaskStage({
        id: taskId,
        stage: stage
      }).unwrap();
      
      toast.success(res.message || 'Task stage updated successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to update task stage:', error);
      toast.error(error?.data?.message || error.message || 'Failed to update task stage');
    }
  };
  
  const getStageColor = (stageName) => {
    const colors = {
      todo: "bg-blue-100 text-blue-800 border-blue-300",
      "in progress": "bg-yellow-100 text-yellow-800 border-yellow-300",
      completed: "bg-green-100 text-green-800 border-green-300"
    };
    return colors[stageName] || "bg-gray-100 text-gray-800 border-gray-300";
  };
  
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStageColor(currentStage)}`}>
            {currentStage.toUpperCase()}
          </span>
          <MdArrowForward className="text-gray-500" />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {stageOptions.map(option => (
              <option key={option} value={option}>{option.toUpperCase()}</option>
            ))}
          </select>
          
          <Button
            label="Update"
            icon={isLoading && <span className="animate-spin">↻</span>}
            onClick={handleStageChange}
            disabled={isLoading || stage === currentStage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskStageUpdater);