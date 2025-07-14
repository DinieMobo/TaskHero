import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState, lazy, Suspense } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar, Sidebar } from "./components";
import { setOpenSidebar } from "./redux/slices/authSlice";
import { ThemeProvider } from "./components";
import Loading from "./components/Loading";

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Trash = lazy(() => import('./pages/Trash'));
const Users = lazy(() => import('./pages/Users'));
const StatusPage = lazy(() => import('./pages/Status'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const OTPVerification = lazy(() => import('./pages/OTPVerification'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Settings = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="w-full h-[80vh] flex flex-col items-center justify-center">
    <Loading size="large" />
    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading page...</p>
  </div>
);

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (user === undefined) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/log-in' state={{ from: location }} replace />;
  }

  return (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white dark:bg-[#1f1f1f] sticky top-0 hidden md:block'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 overflow-y-auto'>
        <Navbar />

        <div className='p-4 2xl:px-10'>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
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
            <div
              className='bg-white dark:bg-[#1f1f1f] w-3/4 h-full'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='w-full flex justify-end px-5 pt-5'>
                <button
                  onClick={() => closeSidebar()}
                  className='flex justify-end items-end text-gray-800 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors'
                  aria-label="Close sidebar"
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
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme;
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
        <Routes location={location}>
          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route index path='/' element={<Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path='/tasks' element={
              <Suspense fallback={<PageLoader />}>
                <Tasks />
              </Suspense>
            } />
            <Route path='/completed/:status?' element={
              <Suspense fallback={<PageLoader />}>
                <Tasks />
              </Suspense>
            } />
            <Route path='/in-progress/:status?' element={
              <Suspense fallback={<PageLoader />}>
                <Tasks />
              </Suspense>
            } />
            <Route path='/todo/:status?' element={
              <Suspense fallback={<PageLoader />}>
                <Tasks />
              </Suspense>
            } />
            <Route path='/trashed' element={
              <Suspense fallback={<PageLoader />}>
                <Trash />
              </Suspense>
            } />
            <Route path='/task/:id' element={
              <Suspense fallback={<PageLoader />}>
                <TaskDetail />
              </Suspense>
            } />
            <Route path='/team' element={
              <Suspense fallback={<PageLoader />}>
                <Users />
              </Suspense>
            } />
            <Route path='/status' element={
              <Suspense fallback={<PageLoader />}>
                <StatusPage />
              </Suspense>
            } />
            <Route path='/settings' element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            } />
          </Route>

          {/* Public routes */}
          <Route path='/log-in' element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          } />
          <Route path='/sign-up' element={
            <Suspense fallback={<PageLoader />}>
              <Signup />
            </Suspense>
          } />
          <Route path='/forgot-password' element={
            <Suspense fallback={<PageLoader />}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path='/otp-verification' element={
            <Suspense fallback={<PageLoader />}>
              <OTPVerification />
            </Suspense>
          } />
          <Route path='/reset-password' element={
            <Suspense fallback={<PageLoader />}>
              <ResetPassword />
            </Suspense>
          } />
        </Routes>
      </div>

      <Toaster richColors position='top-center' />
    </ThemeProvider>
  );
};

export default App;