import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/travel-planner-vertical-logo.png";
import {
  Map,
  BotMessageSquare,
  CircleDollarSign,
  FileText,
  Bell,
  Calendar,
} from "lucide-react";
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-[#2B2B2BFF]/80 backdrop-blur-md z-50 border-b border-[#FFFF66]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#hero">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img src={logo} alt="" className="w-16" />
                <span className="text-[#FFFFFF] font-bold text-xl hidden lg:block">
                  Travel Planner
                </span>
                <span className="text-[#FFFFFF] font-bold text-xl block lg:hidden">
                  TP
                </span>
              </div>
            </a>
            <div className="flex gap-4">
              <Link
                to="/signin"
                className="px-6 py-2 text-[#FFFFFF] hover:text-[#FFFF66] transition-colors font-medium cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-colors font-medium cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        id="hero"
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#2B2B2B] via-[#2B2B2B]/90 to-[#2B2B2B]/75"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-[#FFFFFF] mb-6 leading-tight">
              Plan Your Perfect Trip
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFF66] to-[#FFE566]">
                Effortlessly
              </span>
            </h1>
            <p className="text-xl text-[#D4D4D4] mb-12 max-w-2xl mx-auto">
              Create personalized itineraries, discover destinations, manage
              budgets, and visualize your journey on interactive maps all in one
              place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-all transform hover:scale-105 font-semibold text-lg shadow-lg cursor-pointer"
              >
                Get Started Free
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-transparent text-[#FFFFFF] rounded-lg hover:bg-[#FFFFFF]/10 transition-all font-semibold text-lg border-2 border-[#B3B347] cursor-pointer"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#D4D4D4]/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2B2B2B] text-center mb-16">
            Everything You Need to Travel Smart
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#FFFFFF] backdrop-blur-md rounded-xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Map className={`w-8 h-8 text-red-600`} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">
                Interactive Maps
              </h3>
              <p className="text-[#2B2B2B]/70">
                Visualize your destinations with Google Maps integration. Drag,
                drop, and save custom pins for all your activities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#FFFFFF] backdrop-blur-md rounded-xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <BotMessageSquare className={`w-8 h-8 text-green-600`} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">
                Smart Recommendations
              </h3>
              <p className="text-[#2B2B2B]/70">
                Get intelligent flight and hotel suggestions within your budget
                using real-time travel data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#FFFFFF] backdrop-blur-md rounded-xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <CircleDollarSign className={`w-8 h-8 text-purple-600`} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">
                Budget Management
              </h3>
              <p className="text-[#2B2B2B]/70">
                Stay on track with smart budget tracking and recommendations
                tailored to your spending limits.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#FFFFFF] backdrop-blur-md rounded-xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Calendar className={`w-8 h-8 text-yellow-300`} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">
                Itinerary Builder
              </h3>
              <p className="text-[#2B2B2B]/70">
                Create detailed day-by-day plans with activities, events, and
                notes for your entire trip.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#FFFFFF] backdrop-blur-md rounded-xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <FileText className={`w-8 h-8 text-blue-800`} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">
                PDF Export
              </h3>
              <p className="text-[#2B2B2B]/70">
                Download and share your complete itinerary as a beautifully
                formatted PDF document.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#FFFFFF] backdrop-blur-md rounded-xl p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Bell className={`w-8 h-8 text-orange-600`} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">
                Price Alerts
              </h3>
              <p className="text-[#2B2B2B]/70">
                Receive notifications for flight price drops and hotel
                availability changes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-[#2B2B2B]/70 mb-8">
            Join travelers who plan smarter with Travel Planner.
          </p>
          <Link
            to="/signup"
            className="inline-block px-12 py-5 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-all transform hover:scale-105 font-bold text-xl shadow-lg cursor-pointer"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-[#D4D4D4]/20 border-t border-[#D4D4D4]">
        <div className="max-w-7xl mx-auto text-center text-[#2B2B2B]/70">
          <p>&copy; 2025 Travel Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
