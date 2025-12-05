import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/travel-planner-vertical-logo.png";
import valid from "../../assets/images/checked.png";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import unitOfWork from "../../api/unit-of-work";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ArrowLeft } from "lucide-react";
import PageHead from "../../components/PageHead";

const ResetSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email address is required" })
    .email({ message: "Invalid email format" }),
});
type ResetData = z.infer<typeof ResetSchema>;

const ForgotPassword: React.FC = () => {
  const [IsButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    reset,
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<ResetData>({
    resolver: zodResolver(ResetSchema),
  });
  const handleSubmit: SubmitHandler<ResetData> = async (data) => {
    setIsButtonLoading(true);
    try {
      const response = await unitOfWork.auth.forgotPassword(data);
      if (response.success === true) {
        setSuccess(true);
        clearErrors();
        reset();
      } else {
        setIsButtonLoading(false);
        setSuccess(false);
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#D4D4D4]/50 backdrop-blur-md">
      <PageHead
        title="Reset Password - Travel Planner"
        description="Reset your Travel Planner account password."
      />
      {/* Back to Home Link */}
      <div className="absolute top-8 left-8">
        <Link
          to="/signin"
          className="flex items-center gap-2 text-white hover:text-[#f7d749] transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="font-medium">Back to Sign In</span>
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
            Reset Password
          </h1>
          {!success && (
            <p className="text-white">
              Please enter your account email address to begin the password
              reset process.
            </p>
          )}
          {errors.root && (
            <div className="text-red-500 text-md mb-5 w-full text-center">
              <h4>{errors.root?.message}</h4>
            </div>
          )}
        </div>

        {!success && (
          <div className="bg-gradient-to-b from-[#2B2B2B] via-[#2B2B2B]/85 to-[#2B2B2B]/60 backdrop-blur-md rounded-xl p-8 shadow-xl">
            <form
              onSubmit={handleFormSubmit(handleSubmit)}
              className="flex flex-col gap-6"
            >
              <label className="flex flex-col gap-2">
                <span className="text-lg font-medium text-[#FFFFFF]">
                  Email
                </span>
                <input
                  {...register("email")}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#B3B347]/30 bg-[#FFFFFF]/10 text-[#FFFFFF] placeholder-[#D4D4D4] focus:outline-none focus:ring-2 focus:ring-[#FFFF66] focus:border-[#B3B347] transition-all"
                  title="email"
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
                Send Reset Link
              </button>
            </form>
          </div>
        )}
        {success && (
          <div className="flex flex-col gap-3 justify-center items-center mt-10">
            <div className="text-green-500 text-5xl mb-4">
              <img src={valid} alt="Avatar" className="w-20 h-20" />
            </div>

            <h1 className="text-2xl font-semibold mb-2 text-center text-white">
              An email has been sent to your registered address. Please check
              your inbox for the password reset link.
            </h1>

            <div className="flex space-x-4 mt-5">
              <button
                onClick={() => {
                  navigate("/signin");
                }}
                title="button"
                type="button"
                className="w-full flex gap-2 items-center justify-center py-3 px-8 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-all font-semibold text-lg shadow-lg transform hover:scale-[1.02] cursor-pointer"
              >
                <ArrowLeft />
                Go to Sign In Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
