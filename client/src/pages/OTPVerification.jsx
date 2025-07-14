import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button, Loading } from "../components";
import { useVerifyOtpMutation } from "../redux/slices/api/authApiSlice";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const location = useLocation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  // Check if email exists in location state
  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const isOtpComplete = otp.every(digit => digit !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpComplete) {
      toast.error("Please enter the complete OTP");
      return;
    }

    try {
      const response = await verifyOtp({
        otp: otp.join(""),
        email: location.state.email
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "OTP verified successfully");
        navigate("/reset-password", {
          state: {
            email: location.state.email,
            token: response.token
          }
        });
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || "Invalid OTP");
    }
  };

  const handleOtpChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full md:w-[450px] p-4 md:p-1 flex flex-col justify-center items-center'>
        <form 
          onSubmit={handleSubmit}
          className='form-container w-full flex flex-col gap-y-6 bg-white dark:bg-slate-900 px-8 pt-10 pb-10 rounded-lg shadow-lg'
        >
          <div>
            <p className='text-blue-600 text-2xl font-bold text-center'>
              Verify OTP
            </p>
            <p className='text-center text-sm text-gray-700 dark:text-gray-500 mt-2'>
              Enter the 6-digit code sent to your email
            </p>
          </div>
          
          <div className='flex flex-col gap-y-4'>
            <label htmlFor='otp' className='text-gray-700 dark:text-gray-300'>Enter OTP:</label>
            <div className='flex items-center gap-2 justify-between mt-3'>
              {otp.map((digit, index) => (
                <input
                  key={`otp-${index}`}
                  type='text'
                  ref={el => inputRefs.current[index] = el}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className='bg-blue-50 dark:bg-slate-800 w-full max-w-12 h-12 border-2 border-gray-200 dark:border-gray-600 rounded outline-none focus:border-blue-500 text-center font-semibold text-lg'
                />
              ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className='flex justify-center py-4'>
              <Loading />
            </div>
          ) : (
            <Button
              type='submit'
              label='Verify OTP'
              disabled={!isOtpComplete}
              className={`w-full h-12 ${isOtpComplete ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gray-400'} text-white rounded-xl transform transition-all duration-300 ${isOtpComplete ? 'hover:scale-[1.01] hover:shadow-lg active:scale-[0.98]' : ''} font-semibold`}
            />
          )}
          
          <div className='text-center pt-4 border-t border-gray-200 dark:border-gray-600'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Didn't receive the code?{' '}
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')}
                className='text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold hover:underline'
              >
                Resend OTP
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
