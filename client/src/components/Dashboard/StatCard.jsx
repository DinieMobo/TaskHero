import React from 'react';
import clsx from 'clsx';
import { useState } from 'react';

const StatCard = ({ label, count, lastMonth, bg, icon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isIncreasing = count > lastMonth;
  const percentChange = lastMonth > 0 
    ? Math.round(((count - lastMonth) / lastMonth) * 100) 
    : count > 0 ? 100 : 0;
    
  return (
    <div 
      className={clsx(
        'w-full h-32 bg-white dark:bg-slate-800 p-5 rounded-xl flex items-center',
        'justify-between transition-all duration-300 ease-out transform',
        'border border-transparent hover:border-blue-500/30',
        isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-md'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='h-full flex flex-1 flex-col justify-between'>
        <p className='text-base text-gray-600 dark:text-gray-300 font-medium'>{label}</p>
        <div className="flex flex-col">
          <span className='text-2xl font-semibold dark:text-white'>{count}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={clsx(
              'text-sm',
              isIncreasing ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            )}>
              {isIncreasing ? '↑' : '↓'} {Math.abs(percentChange)}%
            </span>
            <span className='text-sm text-gray-400 dark:text-gray-500'>vs last month</span>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'w-10 h-10 rounded-full flex items-center justify-center text-white',
          'transition-all duration-300',
          isHovered && 'scale-110',
          bg
        )}
      >
        {icon}
      </div>
    </div>
  );
};

export default React.memo(StatCard);