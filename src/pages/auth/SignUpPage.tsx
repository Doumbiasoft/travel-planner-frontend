import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/travel-planner-vertical-logo.png";
import GoogleIcon from "../../components/GoogleIcon";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import unitOfWork from "../../api/unit-of-work";
import { useAuth } from "../../hooks/useAuth";
import { useAlertNotification } from "../../hooks/AlertNotification";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGoogleOauth } from "../../hooks/useGoogleOauth";
import { weakPasswordRegex } from "../../helpers/http-status-codes";
import type { RegisterData } from "../../types";
import PageHead from "../../components/PageHead";

const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .nonempty({ message: "First Name is required" })
      .min(2, { message: "First Name must be at least 3 characters long" }),
    lastName: z
      .string()
      .nonempty({ message: "Last Name is required" })
      .min(2, { message: "Last Name must be at least 3 characters long" }),
    email: z
      .string()
      .nonempty({ message: "Email address is required" })
      .email({ message: "Invalid email format" }),
    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .regex(weakPasswordRegex, {
        message:
          "Password must contain:\n• At least 8 characters\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character (@$!%*?&)",
      }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm password is required" }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This specifies which field the error message should be attached to
  });
type SignupData = z.infer<typeof SignUpSchema>;

const SignUpPage: React.FC = () => {
  const [IsButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const openNotification = useAlertNotification();
  const navigate = useNavigate();
  const { handleGoogleSignIn, isLoading: isGoogleLoading } =
    useGoogleOauth(login);
  const {
    register,
    reset,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<SignupData>({
    resolver: zodResolver(SignUpSchema),
  });
  const handleSubmit: SubmitHandler<SignupData> = async (data) => {
    setIsButtonLoading(true);
    try {
      const f_data: RegisterData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };
      const response = await unitOfWork.auth.register(f_data);
      if (response.success === true) {
        openNotification("Account created successfully", "success");
        clearErrors();
        navigate("/account/created");
        reset();
      } else {
        setIsButtonLoading(false);
        setError("root", { message: "Failed to create an account." });
        openNotification("Failed to create an account", "error");
        return;
      }
    } catch (error: any) {
      setError("root", { message: error[0] });
    } finally {
      setIsButtonLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center  bg-[#D4D4D4]/50 backdrop-blur-md py-12">
      <PageHead
        title="Sign Up - Travel Planner"
        description="Create a new account on Travel Planner to start planning your dream vacations."
      />
      {/* Back to Home Link */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-white hover:text-[#f7d749] transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="max-w-md w-full px-4 lg:mt-0 mt-5">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="" className="w-16" />
            <span className="text-black font-bold text-2xl">
              Travel Planner
            </span>
          </div>
          <h1 className="text-5xl font-bold text-[#f7d83d] mb-2">
            Create Account
          </h1>
          <p className="text-white">Start planning your dream vacation</p>
          {errors.root && (
            <div className="text-red-500 text-md mb-5 w-full text-center">
              <h4>{errors.root?.message}</h4>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-b from-[#2B2B2B] via-[#2B2B2B]/85 to-[#2B2B2B]/60 backdrop-blur-md rounded-xl p-8 shadow-xl">
          <form
            onSubmit={handleFormSubmit(handleSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[#FFFFFF]">
                  First Name
                </span>
                <input
                  {...register("firstName")}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-[#FFFF66] focus:border-[#B3B347] transition-all"
                  type="text"
                  placeholder="John"
                />
                {errors.firstName && (
                  <div className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[#FFFFFF]">
                  Last Name
                </span>
                <input
                  {...register("lastName")}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-[#FFFF66] focus:border-[#B3B347] transition-all"
                  type="text"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <div className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </div>
                )}
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#FFFFFF]">Email</span>
              <input
                {...register("email")}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-[#FFFF66] focus:border-[#B3B347] transition-all"
                type="email"
                placeholder="your.email@example.com"
                autoComplete="username"
              />
              {errors.email && (
                <div className="text-red-500 text-sm">
                  {errors.email.message}
                </div>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#FFFFFF]">
                Password
              </span>
              <input
                {...register("password")}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-[#FFFF66] focus:border-[#B3B347] transition-all"
                type="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
              {errors.password && (
                <div className="text-red-500 text-sm">
                  {errors.password.message}
                </div>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#FFFFFF]">
                Confirm Password
              </span>
              <input
                {...register("confirmPassword")}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-[#FFFF66] focus:border-[#B3B347] transition-all"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </div>
              )}
            </label>

            {/* Terms and Privacy Policy Acceptance */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register("acceptTerms")}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFE566] focus:ring-2 focus:ring-[#FFFF66] cursor-pointer"
              />
              <span className="text-sm text-[#D4D4D4]">
                I agree to the{" "}
                <a
                  href="/terms-of-service.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFFF66] hover:text-[#FFE566] underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFFF66] hover:text-[#FFE566] underline"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.acceptTerms && (
              <div className="text-red-500 text-sm -mt-3">
                {errors.acceptTerms.message}
              </div>
            )}

            <button
              title="submit"
              type="submit"
              className="w-full flex gap-2 items-center justify-center py-3 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-all font-semibold text-lg shadow-lg transform hover:scale-[1.02] cursor-pointer"
            >
              <Spin
                spinning={IsButtonLoading}
                indicator={<LoadingOutlined spin />}
                size="small"
              />
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#B3B347]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#2B2B2B] text-[#D4D4D4]">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={async () => await handleGoogleSignIn()}
            type="button"
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-transparent text-[#FFFFFF] border-2 border-[#B3B347]/30 rounded-lg hover:bg-[#FFFFFF]/10 hover:border-[#B3B347] transition-all font-semibold shadow-lg transform hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Spin
                spinning={isGoogleLoading}
                indicator={<LoadingOutlined spin />}
                size="small"
              />
            ) : (
              <GoogleIcon />
            )}
            <span>Sign up with Google</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-[#D4D4D4]">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-[#FFFF66] hover:text-[#FFE566] font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Privacy Policy and Terms of Service Links */}
          <div className="mt-6 pt-6 border-t border-[#B3B347]/30 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
            <a
              href="/privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#D4D4D4] hover:text-[#FFFF66] transition-colors underline"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline text-[#D4D4D4]/50 text-xs">
              •
            </span>
            <a
              href="/terms-of-service.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#D4D4D4] hover:text-[#FFFF66] transition-colors underline"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
