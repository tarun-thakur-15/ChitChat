"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import {
  signupApi,
  loginApi,
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../app/services/api";
import { ResetPasswordRequest } from "@/app/services/schema";
import {
  MessageSquare,
  Users,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import OTPInput from "react-otp-input";
import { useRouter } from "next/navigation";
import ChatShat from "../app/images/ChatShat.png";
import { socket } from "@/socket";
import { MeResponse } from "@/app/services/schema";
import { Button } from "./ui/button";
interface HeaderProps {
  isLoggedInParent: boolean;
  user?: MeResponse["user"];
}
export default function AuthComponent({ isLoggedInParent, user }: HeaderProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginFormLevel, setLoginFormLevel] = useState(1);
  const [signupFormLevel, setSignupFormLevel] = useState(1);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginFormLoading, setIsLoginFormLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    password: "",
    email: "",
    otp: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoginFormLoading(true);
      if (isLogin) {
        // ================= LOGIN FLOW =================
        if (loginFormLevel === 1) {
          const data = await loginApi({
            identifier: formData.username,
            password: formData.password,
          });

          toast.success(data.message || "Login Successfull🎉");

          // window.location.reload();
        } else if (loginFormLevel === 2) {
          const data = await forgotPasswordApi({
            identifier: formData.username,
          });
          toast.success(data.message || "OTP Sent on Email");
          setLoginFormLevel(3);
        } else if (loginFormLevel === 3) {
          const data = await verifyOtpApi({
            identifier: formData.username,
            code: formData.otp,
            purpose: "password_reset",
          });
          toast.success(data.message || "Password Changed Successfully");
          setResetToken(data.resetToken || "");
          setLoginFormLevel(4);
        }
      } else {
        // ================= SIGNUP FLOW =================
        if (signupFormLevel === 1) {
          const data = await signupApi({
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
          });

          toast.success(data.message || "Signup OTP sent");
          setSignupFormLevel(2);
        } else if (signupFormLevel === 2) {
          const data = await verifyOtpApi({
            identifier: formData.username,
            code: formData.otp,
            purpose: "signup",
          });
          toast.success(data.message || "Signup OTP verified");
          window.location.reload();
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data.message);
    } finally {
      setIsLoginFormLoading(true);
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken) {
      toast.error("Reset token missing. Please verify OTP again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const data: ResetPasswordRequest = {
      resetToken,
      newPassword,
      confirmPassword,
    };

    try {
      const res = await resetPasswordApi(data);

      toast.success(res.message || "Password changed successfully");

      setLoginFormLevel(1); // Go back to login form
      // Reset form
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedInParent && user?._id) {
      console.log("📢 Registering user with socket:", user._id);
      socket.emit("register-user", user._id);
    }
  }, [isLoggedInParent, user]);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            {/* <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg"
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ChatWave
          </h1> */}
            <Image
              src={ChatShat}
              alt="ChatShat"
              className="h-[200px] w-auto justify-self-center"
            />
            <p className="text-gray-600 dark:text-gray-400">
              Baatein Unlimited
            </p>
          </div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 mb-[70px]"
          >
            <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Sign Up
              </button>
            </div>

            {isLogin &&
              (loginFormLevel === 1 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username or Email
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your username"
                      required
                    />

                    <label className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-11 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        <Lock className="w-5 h-5 inline mr-2" />
                         {isLoginFormLoading ? "Signing In..." : "Sign In"}
                      </motion.button>
                    </div>
                  </div>
                  <p
                    className="text-blue-600"
                    onClick={() => setLoginFormLevel(2)}
                  >
                    forget password?
                  </p>
                </form>
              ) : loginFormLevel === 2 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter email or Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                    required
                  />

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-[5rem] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      <Lock className="w-5 h-5 inline mr-2" />
                       {isLoginFormLoading ? "Sending OTP..." : "Send OTP"}
                    </motion.button>
                  </div>
                </form>
              ) : loginFormLevel === 3 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <OTPInput
                    value={formData.otp}
                    onChange={(otp: string) =>
                      setFormData({ ...formData, otp })
                    }
                    numInputs={6}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="text-center text-lg border border-gray-300 rounded focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 !w-5 !h-10 sm:!w-12 sm:!h-12 md:!w-14 md:!h-14"
                      />
                    )}
                    shouldAutoFocus
                    containerStyle="flex gap-[2px] md:gap-3 w-full justify-between"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <Lock className="w-5 h-5 inline mr-2" />
                      {isLoginFormLoading ? "Verifying..." : "Verify OTP"}
                  </motion.button>
                </form>
              ) : (
                loginFormLevel === 4 && (
                  <form className="space-y-4" onSubmit={handleResetPassword}>
                    <div className="space-y-2">
                      <label
                        className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="newPassword"
                      >
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Changing password..." : "Change Password"}
                    </Button>
                  </form>
                )
              ))}

            {!isLogin &&
              (signupFormLevel === 1 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Create Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                    <label className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your username"
                      required
                    />
                    {/* 🔥 Add Email field */}
                    <label className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />

                    <label className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-11 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        <Lock className="w-5 h-5 inline mr-2" />
                        Get OTP
                      </motion.button>
                    </div>
                  </motion.div>
                </form>
              ) : signupFormLevel === 2 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <OTPInput
                    value={formData.otp}
                    onChange={(otp: string) =>
                      setFormData({ ...formData, otp })
                    }
                    numInputs={6}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="text-center text-lg border border-gray-300 rounded focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 !w-5 !h-10 sm:!w-12 sm:!h-12 md:!w-14 md:!h-14"
                      />
                    )}
                    shouldAutoFocus
                    containerStyle="flex gap-[2px] md:gap-3 w-full justify-between"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <Lock className="w-5 h-5 inline mr-2" />
                    Verify OTP
                  </motion.button>
                </form>
              ) : null)}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
