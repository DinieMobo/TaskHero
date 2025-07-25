import React, { useEffect, useState } from "react";
import {
  MdOutlineSearch,
  MdOutlineDarkMode,
  MdOutlineLightMode,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { updateURL } from "../utils";
import { useTheme } from "./ThemeProvider";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    updateURL({ searchTerm, navigate, location });
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <div className='flex justify-between items-center bg-white dark:bg-[#1f1f1f] px-4 py-3 2xl:py-4 sticky z-10 top-0'>
      <div className='flex gap-4'>
        <div className=''>
          <button
            onClick={() => dispatch(setOpenSidebar(true))}
            className='text-2xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            aria-label='Open menu'
          >
            ☰
          </button>
        </div>

        {location?.pathname !== "/dashboard" && (
          <form
            onSubmit={handleSubmit}
            className='w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6] dark:bg-[#1c1c1c]'
          >
            <MdOutlineSearch className='text-gray-500 text-xl' />

            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              type='text'
              placeholder='Search...'
              className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800 dark:text-gray-200'
            />
          </form>
        )}
      </div>

      <div className='flex gap-4 items-center'>
        <button
          onClick={toggleTheme}
          className='text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
          aria-label='Toggle dark mode'
        >
          {isDark ? (
            <MdOutlineLightMode className='text-xl' />
          ) : (
            <MdOutlineDarkMode className='text-xl' />
          )}
        </button>

        {user && (
          <>
            <NotificationPanel />
            <UserAvatar />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;