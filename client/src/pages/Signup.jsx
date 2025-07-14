import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { useEffect } from "react";

const Signup = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const password = watch("password");

  const handleSignup = async (data) => {
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || "Employee",
        title: data.title || "Team Member",
        isAdmin: false
      }).unwrap();

      toast.success(response?.message || "Account created successfully! Please login.");
      navigate("/log-in");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center py-8 bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full max-w-6xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16'>
        <div className='w-full md:w-1/2 flex flex-col items-center justify-center mb-8 md:mb-0'>
          <div className='w-full flex flex-col items-center justify-center gap-4'>
            <span className='inline-flex py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-green-400 border-gray-300 text-gray-600'>
              Boost your productivity today!
            </span>
            <h1 className='text-4xl md:text-5xl font-black text-center dark:text-gray-400 text-green-700'>
              TaskHero
            </h1>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='w-full md:w-1/2 flex justify-center'>
          <form
            onSubmit={handleSubmit(handleSignup)}
            className='form-container w-full max-w-[450px] flex flex-col gap-y-5 bg-white dark:bg-slate-900 px-6 sm:px-8 py-8 rounded-lg shadow-lg'
          >
            <div>
              <p className='text-green-600 text-xl sm:text-2xl font-bold text-center'>
                Become a TaskHero Member
              </p>
              <p className='text-center text-sm text-gray-700 dark:text-gray-500'>
                Complete your profile to start conquering your tasks effectively.
              </p>
            </div>
            
            <div className='flex flex-col gap-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Textbox
                  placeholder='John Doe'
                  type='text'
                  name='name'
                  label='Full Name'
                  className='w-full h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-green-500'
                  register={register("name", {
                    required: "Full name is required!",
                    minLength: { value: 2, message: "Name must be at least 2 characters" }
                  })}
                  error={errors.name ? errors.name.message : ""}
                />

                <Textbox
                  placeholder='Software Engineer'
                  type='text'
                  name='title'
                  label='Job Title'
                  className='w-full h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-green-500'
                  register={register("title", { required: "Job title is required!" })}
                  error={errors.title ? errors.title.message : ""}
                />
              </div>

              <Textbox
                placeholder='you@company.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-green-500'
                register={register("email", {
                  required: "Email Address is required!",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                })}
                error={errors.email ? errors.email.message : ""}
              />

              <Textbox
                placeholder='Team Member / Manager'
                type='text'
                name='role'
                label='Your Role'
                className='w-full h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-green-500'
                register={register("role", { required: "Role is required!" })}
                error={errors.role ? errors.role.message : ""}
              />

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Textbox
                  placeholder='Minimum 6 characters'
                  type='password'
                  name='password'
                  label='Create Password'
                  className='w-full h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-green-500'
                  register={register("password", {
                    required: "Password is required!",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  error={errors.password ? errors.password.message : ""}
                />

                <Textbox
                  placeholder='Verify password'
                  type='password'
                  name='confirmPassword'
                  label='Confirm Password'
                  className='w-full h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-green-500'
                  register={register("confirmPassword", {
                    required: "Please confirm your password!",
                    validate: value => value === password || "Passwords do not match"
                  })}
                  error={errors.confirmPassword ? errors.confirmPassword.message : ""}
                />
              </div>
            </div>
            
            {/* Submit button */}
            <div className='pt-2'>
              {isLoading ? (
                <div className='flex justify-center py-4'>
                  <Loading />
                </div>
              ) : (
                <Button
                  type='submit'
                  label='Start Your Journey'
                  className='w-full h-12 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white rounded-xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg active:scale-[0.98] font-semibold'
                />
              )}
            </div>
            
            {/* Sign in link */}
            <div className='text-center pt-4 border-t border-gray-200 dark:border-gray-600'>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                Already have a TaskHero account?{' '}
                <Link 
                  to='/log-in' 
                  className='text-green-600 dark:text-green-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-all duration-300 hover:underline'
                >
                  Sign in to your account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;