import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import unitOfWork from "../../api/unit-of-work";
import { Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import logo from "../../assets/images/travel-planner-vertical-logo.png";
import wrong from "../../assets/images/wrong.png";
import valid from "../../assets/images/checked.png";
import z from "zod";
import { weakPasswordRegex } from "../../helpers/http-status-codes";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingOutlined } from "@ant-design/icons";
import PageHead from "../../components/PageHead";
const ChangePasswordSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This specifies which field the error message should be attached to
  });
type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

const ChangeAccountPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [IsButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const hasExecuted = useRef(false);

  useEffect(() => {
    async function tokenVerification() {
      if (hasExecuted.current) return;
      hasExecuted.current = true;
      try {
        const token = params.token;
        if (!token) {
          throw new Error("No token found");
        }
        const response = await unitOfWork.auth.changePasswordTokenValidation({
          passwordResetToken: token,
        });
        if (response.success === true) {
          setExpired(false);
        } else {
          setExpired(true);
        }
      } catch (errors: any) {
        setErrorMessage(errors[0]);
        setExpired(true);
      } finally {
        setIsLoading(false);
      }
    }
    tokenVerification().then();
  }, []);

  const {
    register,
    reset,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
  });
  const handleSubmit: SubmitHandler<ChangePasswordData> = async (data) => {
    setIsButtonLoading(true);
    try {
      const token = params.token;
      const f_data = {
        passwordResetToken: token!,
        password: data.confirmPassword,
      };
      const response = await unitOfWork.auth.changePassword(f_data);
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
        title="Change Password - Travel Planner"
        description="Change your Travel Planner account password."
      />
      {/* Go to login */}
      <div className="absolute top-8 left-8">
        <Link
          to="/signin"
          className="flex items-center gap-2 text-white hover:text-[#f7d749] transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="font-medium">Go to Sign In</span>
        </Link>
      </div>

      <div className="max-w-md w-full px-4 py-32">
        {!expired && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="" className="w-16" />
              <span className="text-black font-bold text-2xl">
                Travel Planner
              </span>
            </div>
            <h1 className="text-5xl font-bold text-[#f7d83d] mb-2">
              Change Password
            </h1>
            {!success && (
              <p className="text-white">Please enter your new password.</p>
            )}
            {errors.root && (
              <div className="text-red-500 text-md mb-5 w-full text-center">
                <h4>{errors.root?.message}</h4>
              </div>
            )}
          </div>
        )}

        <>
          {isLoading ? (
            <Spin tip="Loading" size="large"></Spin>
          ) : (
            <>
              {expired && (
                <div className="flex flex-col gap-3 justify-center items-center mt-10">
                  <div className="flex flex-col gap-2 items-center justify-center mb-10 mr-10">
                    <img src={logo} alt="logo" className="w-28 h-28" />
                    <h3 className="text-black font-bold text-5xl">
                      Travel Planner
                    </h3>
                  </div>
                  <div className="text-red-500 text-5xl mb-4">
                    <img src={wrong} alt="Avatar" className="w-20 h-20" />
                  </div>
                  <h1 className="text-3xl font-semibold mb-2 text-center text-red-600">
                    {errorMessage}
                  </h1>
                  <p className="text-red-500 mb-6 text-center"></p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        navigate("/signin");
                      }}
                      title="button"
                      type="button"
                      className="w-full flex gap-2 items-center justify-center py-3 px-8 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-all font-semibold text-lg shadow-lg transform hover:scale-[1.02] cursor-pointer"
                    >
                      <ArrowLeft />
                      Go to Sign In
                    </button>
                  </div>
                </div>
              )}
              {!expired && (
                <>
                  {!success && (
                    <div className="bg-gradient-to-b from-[#2B2B2B] via-[#2B2B2B]/85 to-[#2B2B2B]/60 backdrop-blur-md rounded-xl p-8 shadow-xl">
                      <form
                        onSubmit={handleFormSubmit(handleSubmit)}
                        className="flex flex-col gap-6"
                      >
                        <label className="flex flex-col gap-2">
                          <span className="text-lg font-medium text-[#FFFFFF]">
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
                          <span className="text-lg font-medium text-[#FFFFFF]">
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
                          Change Password
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
                        Your password has been changed successfully.
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
                </>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default ChangeAccountPassword;
