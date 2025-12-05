import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Home, ArrowLeft } from "lucide-react";
import error_broken from "../assets/images/error-broken.png";
import PageHead from "../components/PageHead";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <PageHead
        title="404 Not Found - Travel Planner"
        description="The page you are looking for does not exist. Return to Travel Planner home."
      />
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <img
            src={error_broken}
            alt="Page not found"
            className="w-80 h-80 md:w-96 md:h-96 object-contain animate-pulse"
          />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for seems to have wandered off on its own
          adventure. Let's get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            type="default"
            size="large"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
            style={{
              borderColor: "#FFE566",
              color: "#2B2B2B",
              fontWeight: 600,
            }}
          >
            Go Back
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<Home className="w-4 h-4" />}
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
            style={{
              backgroundColor: "#FFE566",
              borderColor: "#FFE566",
              color: "#2B2B2B",
              fontWeight: 600,
            }}
          >
            Back to Home
          </Button>
        </div>

        <a
          href="https://storyset.com/web"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden mt-12 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Illustration by Storyset
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
