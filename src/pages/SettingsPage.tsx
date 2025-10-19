import React, { useState } from "react";
import { Tabs, Spin, App } from "antd";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { User, Lock, Trash2 } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/AuthProvider";
import { useAlertNotification } from "../hooks/AlertNotification";
import unitOfWork from "../api/unit-of-work";
import { weakPasswordRegex } from "../helpers/http-status-codes";
import { useNavigate } from "react-router-dom";

// Profile Update Schema
const ProfileSchema = z.object({
  firstName: z
    .string()
    .nonempty({ message: "First Name is required" })
    .min(3, { message: "First Name must be at least 3 characters long" }),
  lastName: z
    .string()
    .nonempty({ message: "Last Name is required" })
    .min(3, { message: "Last Name must be at least 3 characters long" }),
});

type ProfileData = z.infer<typeof ProfileSchema>;

// Password Change Schema
const PasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty({ message: "Current password is required" }),
    newPassword: z
      .string()
      .nonempty({ message: "New password is required" })
      .regex(weakPasswordRegex, {
        message:
          "Password must contain:\n• At least 8 characters\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character (@$!%*?&)",
      }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordData = z.infer<typeof PasswordSchema>;

// Account Deletion Schema
const DeleteAccountSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email address is required" })
    .email({ message: "Invalid email format" }),
});

type DeleteAccountData = z.infer<typeof DeleteAccountSchema>;

const SettingsPage: React.FC = () => {
  const { modal } = App.useApp();
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const openNotification = useAlertNotification();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setError: setErrorProfile,
    clearErrors: clearErrorsProfile,
  } = useForm<ProfileData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    setError: setErrorPassword,
    clearErrors: clearErrorsPassword,
  } = useForm<PasswordData>({
    resolver: zodResolver(PasswordSchema),
  });

  // Delete Account Form
  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    formState: { errors: deleteErrors },
    watch: watchDelete,
    setError: setErrorDelete,
    clearErrors: clearErrorsDelete,
  } = useForm<DeleteAccountData>({
    resolver: zodResolver(DeleteAccountSchema),
  });

  const emailInput = watchDelete("email");
  const isDeleteButtonEnabled = emailInput === user?.email;

  // Profile Update Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) =>
      await unitOfWork.auth.updateProfile(data),
    onSuccess: async () => {
      await refreshUser();
      clearErrorsProfile();
      openNotification("Profile updated successfully!", "success");
    },
    onError: (error: any) => {
      setErrorProfile("root", { message: error[0] });
    },
  });

  // Password Change Mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return await unitOfWork.auth.updatePassword(data);
    },
    onSuccess: () => {
      resetPassword();
      clearErrorsPassword();
      openNotification("Password changed successfully!", "success");
    },
    onError: (error: any) => {
      setErrorPassword("root", { message: error[0] });
    },
  });

  // Delete Account Mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (data: DeleteAccountData) =>
      await unitOfWork.auth.deleteAccount(data),
    onSuccess: async () => {
      clearErrorsDelete();
      openNotification("Account deleted successfully", "success");
      await logout();
      navigate("/");
    },
    onError: (error: any) => {
      setErrorDelete("root", { message: error[0] });
      openNotification(error[0] || "Failed to delete account", "error");
    },
  });

  // Profile Submit Handler
  const onProfileSubmit: SubmitHandler<ProfileData> = async (data) => {
    updateProfileMutation.mutate(data);
  };

  // Password Submit Handler
  const onPasswordSubmit: SubmitHandler<PasswordData> = async (data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  // Delete Account Submit Handler
  const onDeleteSubmit: SubmitHandler<DeleteAccountData> = async (data) => {
    modal.confirm({
      title: (
        <div style={{ fontSize: "18px", fontWeight: 600 }}>Delete Account</div>
      ),
      content: (
        <span style={{ fontSize: "15px" }}>
          This action cannot be undone. All your data including trips and
          markers will be permanently deleted.
        </span>
      ),
      okText: "Yes, delete my account",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteAccountMutation.mutate(data);
      },
    });
  };

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Profile
        </span>
      ),
      children: (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          {user?.isOauth && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium mb-1">OAuth Account</p>
              <p className="text-yellow-700 text-sm">
                Your profile information is managed by your {user.oauthProvider}{" "}
                account and cannot be edited here.
              </p>
            </div>
          )}
          {profileErrors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">
                {profileErrors.root?.message}
              </p>
            </div>
          )}
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  {...registerProfile("firstName")}
                  type="text"
                  disabled={user?.isOauth}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent outline-none transition-all ${
                    user?.isOauth
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder="John"
                />
                {profileErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {profileErrors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  {...registerProfile("lastName")}
                  type="text"
                  disabled={user?.isOauth}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent outline-none transition-all ${
                    user?.isOauth
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder="Doe"
                />
                {profileErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {profileErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                title="email"
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {!user?.isOauth && (
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full md:w-auto px-6 py-2 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] border border-[#FFE566] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {updateProfileMutation.isPending && (
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                )}
                Save Changes
              </button>
            )}
          </form>
        </div>
      ),
    },
  ];

  // Password tab
  tabItems.push({
    key: "password",
    label: (
      <span className="flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Password
      </span>
    ),
    children: user?.isOauth ? (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 font-medium mb-2">OAuth Account</p>
          <p className="text-yellow-700">
            You signed in using {user.oauthProvider}. Password management is
            handled by your {user.oauthProvider} account. To change your
            password, please visit your {user.oauthProvider} account settings.
          </p>
        </div>
      </div>
    ) : (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        {passwordErrors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">
              {passwordErrors.root?.message}
            </p>
          </div>
        )}
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              {...registerPassword("currentPassword")}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent outline-none transition-all"
              placeholder="Enter current password"
              autoComplete="current-password"
            />
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              {...registerPassword("newPassword")}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent outline-none transition-all"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1 whitespace-pre-line">
                {passwordErrors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              {...registerPassword("confirmPassword")}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent outline-none transition-all"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            {passwordErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full md:w-auto px-6 py-2 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] border border-[#FFE566] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {changePasswordMutation.isPending && (
              <Spin indicator={<LoadingOutlined spin />} size="small" />
            )}
            Change Password
          </button>
        </form>
      </div>
    ),
  });

  // Delete Account Tab
  tabItems.push({
    key: "delete",
    label: (
      <span className="flex items-center gap-2">
        <Trash2 className="w-4 h-4" />
        Delete Account
      </span>
    ),
    children: (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Delete Account</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium mb-2">Warning!</p>
          <p className="text-red-700 text-sm">
            This action is permanent and cannot be undone. All your trips,
            markers, and personal data will be permanently deleted.
          </p>
        </div>

        {deleteErrors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm font-semibold">
              {deleteErrors.root?.message}
            </p>
          </div>
        )}

        <form
          onSubmit={handleDeleteSubmit(onDeleteSubmit)}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm your email address to delete your account
            </label>
            <input
              {...registerDelete("email")}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder={user?.email}
              autoComplete="email"
            />
            {deleteErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {deleteErrors.email.message}
              </p>
            )}
            {emailInput && !isDeleteButtonEnabled && (
              <p className="text-red-500 text-sm mt-1">
                Email does not match your account email
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isDeleteButtonEnabled || deleteAccountMutation.isPending}
            className="w-full md:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 border border-red-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {deleteAccountMutation.isPending && (
              <Spin indicator={<LoadingOutlined spin />} size="small" />
            )}
            Delete My Account
          </button>
        </form>
      </div>
    ),
  });

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {user?.isOauth && user.oauthPicture ? (
            <img
              src={user.oauthPicture}
              alt="User Profile"
              className="h-20 w-20 rounded-full object-cover shadow-lg border-2 border-yellow-400"
            />
          ) : (
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-yellow-300 text-black border-2 border-amber-400 shadow-lg">
              <span className="font-bold text-2xl">
                {user?.firstName
                  .split(" ")[0]
                  .charAt(0)
                  .toUpperCase()
                  .concat(user?.lastName.charAt(0).toUpperCase())}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="settings-tabs"
      />
    </div>
  );
};

export default SettingsPage;
