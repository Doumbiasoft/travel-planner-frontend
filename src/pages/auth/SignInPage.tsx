import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/travel-planner-vertical-logo.png";
import GoogleIcon from "../../components/GoogleIcon";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import unitOfWork from "../../api/unit-of-work";
import { useAuth } from "../../hooks/AuthProvider";
import { useAlertNotification } from "../../hooks/AlertNotification";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGoogleOauth } from "../../hooks/useGoogleOauth";

const SignInSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email address is required" })
    .email({ message: "Invalid email format" }),
  password: z.string().nonempty({ message: "Password is required" }),
});
type SigninData = z.infer<typeof SignInSchema>;

const SignInPage: React.FC = () => {
  const [IsButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const openNotification = useAlertNotification();
  const navigate = useNavigate();
  const { handleGoogleSignIn, isLoading: isGoogleLoading } = useGoogleOauth();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<SigninData>({
    resolver: zodResolver(SignInSchema),
  });
  const handleSubmit: SubmitHandler<SigninData> = async (data) => {
    setIsButtonLoading(true);
    try {
      const response = await unitOfWork.auth.login(data);
      if (response.success === true) {
        await login(response.data.accessToken);
        openNotification("Signed In Successfully", "success");
        clearErrors();
        navigate("/dashboard");
      } else {
        setIsButtonLoading(false);
        setError("root", { message: "Invalid credentials." });
        return;
      }
    } catch (error: any) {
      setError("root", { message: error[0] });
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2B2B2B]/90 via-[#B3B3B3]/70 to-[#D4D4D4]/50">
      {/* Back to Home Link */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#FFFFFF] hover:text-[#FFFF66] transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="max-w-md w-full px-4 lg:mt-0 mt-5">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="" className="w-16" />
            <span className="text-[#FFFFFF] font-bold text-2xl">
              Travel Planner
            </span>
          </div>
          <h1 className="text-5xl font-bold text-[#FFE566] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#D4D4D4]">Sign in to continue your journey</p>
          {errors.root && (
            <div className="text-red-500 text-md mb-5 w-full text-center">
              <h4>{errors.root?.message}</h4>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-b from-[#2B2B2B] via-[#2B2B2B]/85 to-[#2B2B2B]/60 backdrop-blur-md rounded-xl p-8 shadow-2xl">
          <form
            onSubmit={handleFormSubmit(handleSubmit)}
            className="flex flex-col gap-6"
          >
            <label className="flex flex-col gap-2">
              <span className="text-lg font-medium text-[#FFFFFF]">Email</span>
              <input
                {...register("email")}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-[#FFFF66] focus:border-[#B3B347] transition-all"
                title="email"
                type="email"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <div className="text-red-500 text-sm">
                  {errors.email.message}
                </div>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-[#FFFFFF]">
                  Password
                </span>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#FFFF66] hover:text-[#FFE566] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                {...register("password")}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-[#FFFF66] focus:border-[#B3B347] transition-all"
                title="password"
                type="password"
                placeholder="Enter your password"
              />
              {errors.password && (
                <div className="text-red-500 text-sm">
                  {errors.password.message}
                </div>
              )}
            </label>
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
              Sign In
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

          {/* Google Sign In Button */}
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
            <span>Sign in with Google</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-[#D4D4D4]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#FFFF66] hover:text-[#FFE566] font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
