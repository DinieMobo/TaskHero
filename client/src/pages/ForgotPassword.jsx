import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button, Loading, Textbox } from "../components";
import { useForgotPasswordMutation } from "../redux/slices/api/authApiSlice";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  
  // Use react-hook-form consistently
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      console.log("Sending password reset request for email:", data.email);
      
      const response = await forgotPassword({ email: data.email }).unwrap();
      
      if (response.success || response.status) {
        toast.success(response.message || "OTP sent to your email address");
        navigate("/otp-verification", {
          state: { email: data.email }
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(error?.data?.message || error.error || "Something went wrong");
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full md:w-[450px] p-4 md:p-1 flex flex-col justify-center items-center'>
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className='form-container w-full flex flex-col gap-y-6 bg-white dark:bg-slate-900 px-8 pt-10 pb-10 rounded-lg shadow-lg'
        >
          <div>
            <p className='text-blue-600 text-2xl font-bold text-center'>
              Forgot Password
            </p>
            <p className='text-center text-sm text-gray-700 dark:text-gray-500 mt-2'>
              Enter your email address and we'll send you an OTP to reset your password
            </p>
          </div>
          
          <div className='flex flex-col gap-y-4'>
            {/* Use uncontrolled input with react-hook-form - remove value and onChange props */}
            <Textbox
              placeholder='you@example.com'
              type='email'
              name='email'
              label='Email Address'
              className='w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500'
              register={register("email", { 
                required: "Email Address is required!",
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                } 
              })}
              error={errors.email ? errors.email.message : ""}
            />
          </div>
          
          {isLoading ? (
            <div className='flex justify-center py-4'>
              <Loading />
            </div>
          ) : (
            <Button
              type='submit'
              label='Send OTP'
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

export default ForgotPassword;
