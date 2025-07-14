import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useEffect } from "react";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res.user || res));

      console.log("Login response:", res);

      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center py-8 bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full max-w-6xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16'>
        {/* Left Side - Hero */}
        <div className='w-full md:w-1/2 flex flex-col items-center justify-center mb-8 md:mb-0'>
          <div className='w-full flex flex-col items-center justify-center gap-4'>
            <h1 className='text-4xl md:text-6xl font-black text-center dark:text-gray-400 text-blue-700'>
              TaskHero
            </h1>
            <p className='inline-flex py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-blue-400 border-gray-300 text-gray-600'>
              Manage all your tasks in one place!
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='w-full md:w-1/2 flex justify-center'>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className='form-container w-full max-w-[400px] flex flex-col gap-y-6 bg-white dark:bg-slate-900 px-6 sm:px-10 py-8 sm:py-10 rounded-lg shadow-lg'
          >
            <div className='text-center space-y-2'>
              <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Sign in to continue
              </h2>
            </div>
            <div className='flex flex-col gap-y-5'>
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
                    message: "Invalid email address",
                  },
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='password'
                type='password'
                name='password'
                label='Password'
                className='w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500'
                register={register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                error={errors.password ? errors.password?.message : ""}
              />
              <button
                type='button'
                onClick={handleForgotPassword}
                className='text-right text-sm text-gray-600 hover:text-blue-600 hover:underline cursor-pointer'
              >
                Forgot Password?
              </button>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type='submit'
                label='Log in'
                className='w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98] font-semibold'
              />
            )}

            <div className='text-center pt-4 border-t border-gray-200 dark:border-gray-600'>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <Link
                  to='/sign-up'
                  className='text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-all duration-300 hover:underline'
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
