import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import logo from "../../assets/images/travel-planner-vertical-logo.png";
import valid from "../../assets/images/checked.png";

const RegisteredAccountActivationInfo: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const hasExecuted = useRef(false);
  useEffect(() => {
    async function activateAccount() {
      if (hasExecuted.current) return;
      hasExecuted.current = true;
      try {
      } catch (errors: any) {
      } finally {
        setIsLoading(false);
      }
    }
    activateAccount().then();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100">
      {/* Go to login */}
      <div className="absolute top-8 left-8">
        <Link
          to="/signin"
          className="flex items-center gap-2 text-black hover:text-[#f7d749] transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="font-medium">Go to Sign In Page</span>
        </Link>
      </div>
      <div className="max-w-md w-full px-4 py-32">
        <div className="text-center mb-8">
          <>
            {isLoading ? (
              <Spin tip="Loading" size="large"></Spin>
            ) : (
              <>
                <div className="flex flex-col gap-3 justify-center items-center mt-10">
                  <div className="flex flex-col gap-2 items-center justify-center mb-10 mr-10">
                    <img src={logo} alt="logo" className="w-28 h-28" />
                    <h3 className="text-black font-bold text-5xl">
                      Travel Planner
                    </h3>
                  </div>
                  <div className="text-green-500 text-5xl mb-4">
                    <img src={valid} alt="Avatar" className="w-20 h-20" />
                  </div>
                  <>
                    <h1 className="text-3xl font-semibold mb-2 text-center text-black">
                      An e-mail has been sent to your email address!
                    </h1>
                    {/* <h1 className="text-3xl font-semibold mb-2 text-center">
                      An e-mail has been sent to your email address!
                    </h1> */}
                    {/* <p className="text-yellow-300 mb-6 text-center">
                      Welcome to Travel Planner, you can now access all
                      functionalities.
                    </p> */}
                    <p className="text-gray-500 mb-6 text-center">
                      Please check your inbox to activate your account.
                    </p>
                  </>
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
                      Go to Sign In Page
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default RegisteredAccountActivationInfo;
