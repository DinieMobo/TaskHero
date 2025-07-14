import React from "react";

const Loading = ({ size = "default", color = "blue" }) => {
  const sizeClasses = {
    small: "w-2 h-2 mx-1",
    default: "w-3 h-3 mx-1.5",
    large: "w-4 h-4 mx-2"
  };
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    gray: "bg-gray-500"
  };
  
  const dotClass = `${sizeClasses[size]} ${colorClasses[color]} rounded-full`;
  
  return (
    <div className="dots-container">
      <div className={`dot ${dotClass}`}></div>
      <div className={`dot ${dotClass}`}></div>
      <div className={`dot ${dotClass}`}></div>
    </div>
  );
};

export default React.memo(Loading);