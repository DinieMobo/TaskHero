import clsx from "clsx";
import React from "react";

const Button = ({ className, label, type, onClick = () => {}, icon, disabled }) => {
  return (
    <button
      type={type || "button"}
      className={clsx(
        "px-3 py-2 outline-none rounded transition-all duration-300",
        "hover:shadow-md active:scale-95 focus:ring-2 focus:ring-offset-1",
        disabled && "opacity-60 cursor-not-allowed hover:shadow-none active:scale-100",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center gap-2">
        {label && <span className="relative overflow-hidden">{label}</span>}
        {icon && <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>}
      </div>
    </button>
  );
};

export default React.memo(Button);