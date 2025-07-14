import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button, Loading, Textbox } from "../components";
import { useResetPasswordMutation } from "../redux/slices/api/authApiSlice";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (!location?.state?.token || !location?.state?.email) {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await resetPassword({
        email: location.state.email,
        token: location.state.token,
        password: passwords.newPassword
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Password reset successfully");
        navigate("/log-in");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || "Failed to reset password");
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center py-8 bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full max-w-md px-4'>
        <form 
          onSubmit={handleSubmit}
          className='form-container w-full flex flex-col gap-y-6 bg-white dark:bg-slate-900 px-6 sm:px-8 py-8 rounded-lg shadow-lg'
        >
          <div>
            <p className='text-blue-600 text-xl sm:text-2xl font-bold text-center'>
              Reset Password
            </p>
            <p className='text-center text-sm text-gray-700 dark:text-gray-500 mt-2'>
              Create a new password for your account.
            </p>
          </div>
          
          <div className='flex flex-col gap-y-4'>
            <div className='relative'>
              <Textbox
                placeholder='Enter new password'
                type={showNewPassword ? 'text' : 'password'}
                name='newPassword'
                label='New Password'
                value={passwords.newPassword}
                onChange={handleChange}
                className='w-full h-12 pr-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500'
              />
              <button 
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)} 
                className='absolute right-3 top-9 text-gray-500 hover:text-gray-700'
              >
                {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            
            <div className='relative'>
              <Textbox
                placeholder='Confirm new password'
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                label='Confirm Password'
                value={passwords.confirmPassword}
                onChange={handleChange}
                className='w-full h-12 pr-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500'
              />
              <button 
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className='absolute right-3 top-9 text-gray-500 hover:text-gray-700'
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className='flex justify-center py-4'>
              <Loading />
            </div>
          ) : (
            <Button
              type='submit'
              label='Reset Password'
              className='w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98] font-semibold'
            />
          )}
          
          <div className='text-center pt-4 border-t border-gray-200 dark:border-gray-600'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Remember your password?{' '}
              <Link 
                to='/log-in' 
                className='text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold hover:underline'
              >
                Sign in here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;