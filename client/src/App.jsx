import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react"; // Added useState, useEffect
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar, Sidebar } from "./components";
import {
  Dashboard,
  Login,
  Signup,
  TaskDetail,
  Tasks,
  Trash,
  Users,
  StatusPage,
  ForgotPassword,
  OTPVerification,
  ResetPassword,
  Settings,
} from "./pages";
import { setOpenSidebar } from "./redux/slices/authSlice";
import { ThemeProvider } from "./components";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If auth is still loading, show a loading indicator
  if (user === undefined) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  // If no user is found, redirect to login
  if (!user) {
    return <Navigate to='/log-in' state={{ from: location }} replace />;
  }

  // User is authenticated, show layout
  return (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white dark:bg-[#1f1f1f] sticky top-0 hidden md:block'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 overflow-y-auto'>
        <Navbar />

        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity duration-700'
        enterFrom='opacity-x-10'
        enterTo='opacity-x-100'
        leave='transition-opacity duration-700'
        leaveFrom='opacity-x-100'
        leaveTo='opacity-x-0'
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={`md:hidden w-full h-full bg-black/40 transition-transform duration-700 transform
             ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            onClick={() => closeSidebar()}
          >
            <div className='bg-white w-3/4 h-full'>
              <div className='w-full flex justify-end px-5 pt-5'>
                <button
                  onClick={() => closeSidebar()}
                  className='flex justify-end items-end'
                >
                  <IoMdClose size={25} />
                </button>
              </div>

              <div className='-mt-10'>
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

const App = () => {
  // Use localStorage or system preference for initial theme
  const [theme, setTheme] = useState(() => {
    // Check if a theme preference exists in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // If no saved preference, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  // Apply theme class to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen for theme changes from other components
  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e.detail.theme);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  return (
    <ThemeProvider>
      <div className='w-full min-h-screen bg-[#f3f4f6] dark:bg-[#0d0d0df4]'>
        <Routes>
          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route index psth='/' element={<Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/completed/:status?' element={<Tasks />} />
            <Route path='/in-progress/:status?' element={<Tasks />} />
            <Route path='/todo/:status?' element={<Tasks />} />
            <Route path='/trashed' element={<Trash />} />
            <Route path='/task/:id' element={<TaskDetail />} />
            <Route path='/team' element={<Users />} />
            <Route path='/status' element={<StatusPage />} />
            <Route path='/settings' element={<Settings />} />
          </Route>

          {/* Public routes */}
          <Route path='/log-in' element={<Login />} />
          <Route path='/sign-up' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/otp-verification' element={<OTPVerification />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Routes>
      </div>

      <Toaster richColors position='top-center' />
    </ThemeProvider>
  );
};

export default App;
