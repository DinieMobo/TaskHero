import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button, Loading, Textbox, Title } from "../components";
import { useForm } from "react-hook-form";
import { 
  useChangePasswordMutation, 
  useUpdateUserProfileMutation,
  useGetUserStatsQuery 
} from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { getInitials } from "../utils";
import { getCurrentTheme, toggleTheme } from "../utils/theme"; // Import theme utilities
import { FaLock, FaUserCog } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const [darkMode, setDarkMode] = useState(getCurrentTheme() === 'dark');
  
  const [activeTab, setActiveTab] = useState("profile");
  const [systemEmailNotifications, setSystemEmailNotifications] = useState(true);
  const [taskAutoArchive, setTaskAutoArchive] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [archiveDays, setArchiveDays] = useState(30);
  
  const { 
    data: userStats,
    isLoading: isLoadingStats,
    error: statsError
  } = useGetUserStatsQuery(undefined, {
    skip: !user?.isAdmin || activeTab !== "admin"
  });
  
  // Profile update
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      title: user?.title || "",
      role: user?.role || "",
    },
  });

  // Password change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmitProfile = async (data) => {
    try {
      const response = await updateProfile({
        ...data,
        _id: user._id
      }).unwrap();
      
      dispatch(setCredentials({ ...user, ...data }));
      toast.success(response.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      const response = await changePassword({
        password: data.newPassword
      }).unwrap();
      
      toast.success(response.message || "Password changed successfully");
      resetPassword();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  // User Management Summary section in the Admin tab
  const renderUserManagementSection = () => {
    if (isLoadingStats) {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">User Management</h2>
          <div className="flex justify-center py-6">
            <Loading />
          </div>
        </div>
      );
    }
    
    if (statsError) {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">User Management</h2>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-300">
            Failed to load user statistics. Please try again later.
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              label="Manage Users" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={() => navigate('/team')}
            />
          </div>
        </div>
      );
    }
    
    const stats = userStats?.stats || {
      totalUsers: 0,
      activeUsers: 0, 
      adminUsers: 0
    };
    
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">User Management</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400">Total Users</h3>
              <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                {stats.totalUsers}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium text-green-700 dark:text-green-400">Active Users</h3>
              <p className="text-3xl font-bold text-green-800 dark:text-green-300">
                {stats.activeUsers}
              </p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium text-amber-700 dark:text-amber-400">Admins</h3>
              <p className="text-3xl font-bold text-amber-800 dark:text-amber-300">
                {stats.adminUsers}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              label="Manage Users" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={() => navigate('/team')}
            />
          </div>
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    const handleThemeChange = (e) => {
      setDarkMode(e.detail.theme === 'dark');
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);
  
  const handleToggleDarkMode = () => {
    const isDark = toggleTheme();
    setDarkMode(isDark);
    toast.success(`${isDark ? 'Dark' : 'Light'} mode enabled`);
  };

  const saveAdminSettings = () => {
    toast.success("System settings updated successfully");
  };

  const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
        active === id 
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="container mx-auto py-4">
      <Title title="Settings" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
        {/* Navigation Sidebar */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Settings</h2>
          <div className="flex flex-col gap-2">
            <TabButton 
              id="profile" 
              label="Profile Settings" 
              icon={<FaUserCog className="text-lg" />}
              active={activeTab} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="security" 
              label="Security" 
              icon={<FaLock className="text-lg" />}
              active={activeTab} 
              onClick={setActiveTab} 
            />
            {user?.isAdmin && (
              <TabButton 
                id="admin" 
                label="Admin Settings" 
                icon={<IoSettings className="text-lg" />}
                active={activeTab} 
                onClick={setActiveTab} 
              />
            )}
          </div>
          
          {/* Theme Toggle */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center">
                {darkMode ? (
                  <MdOutlineDarkMode className="text-xl text-yellow-500 mr-3" />
                ) : (
                  <MdOutlineLightMode className="text-xl text-yellow-500 mr-3" />
                )}
                <span className="dark:text-white">Dark Mode</span>
              </div>
              
              <button 
                onClick={handleToggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Version: 1.0.0</p>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="md:col-span-3">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Profile Settings</h2>
              
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full text-white flex items-center justify-center text-2xl">
                  <span className="text-center font-bold">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium dark:text-white">{user?.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{user?.role}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textbox
                    label="Full Name"
                    name="name"
                    register={registerProfile("name", { required: "Name is required" })}
                    error={profileErrors.name?.message}
                    placeholder="Your full name"
                  />
                  
                  <Textbox
                    label="Job Title"
                    name="title"
                    register={registerProfile("title", { required: "Title is required" })}
                    error={profileErrors.title?.message}
                    placeholder="e.g., Project Manager"
                  />
                </div>
                
                <div>
                  <Textbox
                    label="Role"
                    name="role"
                    register={registerProfile("role", { required: "Role is required" })}
                    error={profileErrors.role?.message}
                    placeholder="Your role in the organization"
                  />
                </div>
                
                {isLoading ? (
                  <div className="py-2">
                    <Loading />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    label="Save Changes"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                  />
                )}
              </form>
            </div>
          )}
          
          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Security</h2>
              
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Textbox
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    register={registerPassword("currentPassword", { 
                      required: "Current password is required" 
                    })}
                    error={passwordErrors.currentPassword?.message}
                    placeholder="Your current password"
                  />
                  
                  <Textbox
                    label="New Password"
                    name="newPassword"
                    type="password"
                    register={registerPassword("newPassword", { 
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    error={passwordErrors.newPassword?.message}
                    placeholder="New password"
                  />
                  
                  <Textbox
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    register={registerPassword("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === newPassword || "Passwords do not match"
                    })}
                    error={passwordErrors.confirmPassword?.message}
                    placeholder="Confirm new password"
                  />
                </div>
                
                {isChangingPassword ? (
                  <div className="py-2">
                    <Loading />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    label="Change Password"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                  />
                )}
              </form>
            </div>
          )}
          
          {/* Admin Settings - Only shown for admin users */}
          {activeTab === "admin" && user?.isAdmin && (
            <div className="space-y-6">
              {/* System Settings */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">System Settings</h2>
                
                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <h3 className="text-md font-medium dark:text-white">System Email Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Send email notifications to users for system events</p>
                    </div>
                    <button 
                      onClick={() => setSystemEmailNotifications(!systemEmailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        systemEmailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          systemEmailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Task Auto Archive */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <h3 className="text-md font-medium dark:text-white">Auto-archive Completed Tasks</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically archive tasks that have been completed for more than 
                        <input 
                          type="number" 
                          min="1" 
                          max="365"
                          value={archiveDays}
                          onChange={(e) => setArchiveDays(e.target.value)}
                          className="w-12 mx-2 p-1 text-center rounded border dark:bg-slate-800 dark:border-slate-600"
                        />
                        days
                      </p>
                    </div>
                    <button 
                      onClick={() => setTaskAutoArchive(!taskAutoArchive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        taskAutoArchive ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          taskAutoArchive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Maintenance Mode */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Maintenance Mode</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <h3 className="text-md font-medium dark:text-white">Enable Maintenance Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        When enabled, only administrators can access the application
                      </p>
                    </div>
                    <button 
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* User Management Summary - Now dynamic */}
              {renderUserManagementSection()}
              
              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  label="Save System Settings"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                  onClick={saveAdminSettings}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;