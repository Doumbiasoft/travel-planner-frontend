import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Mail, MessageSquare } from "lucide-react";
import unitOfWork from "../api/unit-of-work";
import { useAlertNotification } from "../hooks/AlertNotification";
import { useAuth } from "../hooks/AuthProvider";

// Contact Form Schema
const ContactSchema = z.object({
  subject: z
    .string()
    .nonempty({ message: "Subject is required" })
    .min(5, { message: "Subject must be at least 5 characters long" })
    .max(100, { message: "Subject must not exceed 100 characters" }),
  content: z
    .string()
    .nonempty({ message: "Message content is required" })
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(1000, { message: "Message must not exceed 1000 characters" }),
});

type ContactData = z.infer<typeof ContactSchema>;

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const openNotification = useAlertNotification();
  const { user } = useAuth();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<ContactData>({
    resolver: zodResolver(ContactSchema),
  });

  const handleSubmit: SubmitHandler<ContactData> = async (data) => {
    setIsSubmitting(true);
    clearErrors();

    try {
      const response = await unitOfWork.mailbox.createEmail({
        subject: data.subject,
        content: data.content,
      });

      if (response.success === true) {
        openNotification("Message sent successfully!", "success");
        reset();
      } else {
        setError("root", { message: "Failed to send message." });
      }
    } catch (error: any) {
      setError("root", { message: error[0] || "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
              <p className="text-gray-600 mt-1">
                Send us a message and we'll get back to you soon
              </p>
            </div>
          </div>

          {user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Logged in as:</strong> {user.firstName} {user.lastName}{" "}
                ({user.email})
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm font-semibold">
                {errors.root?.message}
              </p>
            </div>
          )}

          <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Subject
                </div>
              </label>
              <input
                {...register("subject")}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent transition-all"
                placeholder="Enter the subject of your message"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                {...register("content")}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent transition-all resize-none"
                placeholder="Write your message here..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] border border-[#FFE566] transition-all font-semibold text-lg shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {isSubmitting && (
                <Spin indicator={<LoadingOutlined spin />} size="small" />
              )}
              <Mail className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            We typically respond within 24-48 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
