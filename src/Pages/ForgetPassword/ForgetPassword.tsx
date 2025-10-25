import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AuthSlider from "../../Shared/AuthSlider/AuthSlider";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { insertUserToken } from "../../Store/Slices/AuthSlice";
import SEO from "../../Components/SEO/SEO";

const MySwal = withReactContent(Swal);

const emailSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
});

const passPattern = /^[A-Z][A-Za-z0-9]{5,20}$/;

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("Password is required")
      .regex(
        passPattern,
        "Password must start with uppercase and be 6-20 characters"
      ),
    rePassword: z.string(),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords must match",
    path: ["rePassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ForgetPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  // ------------------ Handlers ------------------
  const sendCode: SubmitHandler<EmailFormData> = async (data) => {
    setEmail(data.email);
    setLoading(true);

    try {
      await axios.put("https://iti-react-backend.vercel.app/auth/forgetPass", {
        email: data.email,
      });
      setOtp("");
      setStep(1);
      MySwal.fire({
        title: "✅ OTP Sent!",
        text: `OTP sent to ${data.email}`,
        icon: "success",
        confirmButtonColor: "#8B5E35",
      });
    } catch (err: any) {
      const msg = err.response?.data?.message;

      if (msg?.toLowerCase().includes("you already has otp")) {
        setStep(1);
        MySwal.fire({
          title: "ℹ️ OTP Already Sent",
          text: "Please check your email for the existing OTP.",
          icon: "info",
          confirmButtonColor: "#8B5E35",
        });
      } else {
        MySwal.fire({
          title: "❌ Error",
          text: msg || "Failed to send OTP",
          icon: "error",
          confirmButtonColor: "#8B5E35",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = () => {
    if (otp.length !== 6) {
      MySwal.fire({
        title: "❌ Invalid OTP",
        text: "OTP must be 6 digits",
        icon: "error",
        confirmButtonColor: "#8B5E35",
      });
      return;
    }
    setStep(2);
  };

  const resetPassword: SubmitHandler<PasswordFormData> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(
        "https://iti-react-backend.vercel.app/auth/changePass",
        {
          email,
          otp,
          newPass: data.newPassword,
        }
      );
      const token = response.data?.accessToken;
      console.log(response);
      console.log(token);

      if (token) {
        dispatch(insertUserToken(token));
      }
      MySwal.fire({
        title: "✅ Password Reset Successful!",
        text: "Redirecting to home...",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => navigate("/home"),
      });
    } catch (err: any) {
      MySwal.fire({
        title: "❌ Error",
        text: err.response?.data?.message || "Failed to reset password",
        icon: "error",
        confirmButtonColor: "#8B5E35",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SEO
        title="Kayan | Reset Password"
        description="Reset your Kayan account password quickly and securely."
      />

      {/* Left Side */}
      <div className="w-full md:w-1/2 bg-[#f5f0e9] flex flex-col items-center justify-center py-16">
        <div className="w-full px-4 sm:w-3/4 lg:w-2/3">
          <h1 className="text-2xl mb-2 font-['Playfair_Display'] text-[var(--wood-400)]">
            Forget Password
          </h1>
          <p className="text-gray-600 mb-5 font-['Playfair_Display']">
            Please finish these steps to reset your password
          </p>

          {/* Custom Stepper */}
          <div className="flex items-center justify-between mb-5 font-['Playfair_Display'] text-grey-600">
            {["Send Code", "Verify Code", "Change Password"].map(
              (title, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      step === index
                        ? "bg-[var(--wood-400)]"
                        : step > index
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-1 text-xs text-center ${
                      step >= index ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {title}
                  </span>
                  {index !== 2 && (
                    <div
                      className={`h-1 w-full mt-1 ${
                        step > index ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>

          <div className="mt-5">
            {/* ===> step 0: Send Code */}
            {step === 0 && (
              <form onSubmit={handleEmailSubmit(sendCode)}>
                <div className="mb-4">
                  <label className="block mb-1 font-['Playfair_Display']">
                    E-mail
                  </label>
                  <input
                    type="text"
                    {...registerEmail("email")}
                    className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[var(--wood-400)] focus:ring-2 focus:ring-[var(--wood-200)] focus:outline-none transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  {emailErrors.email && (
                    <p className="text-red-500">{emailErrors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[var(--wood-400)] text-white px-4 py-2 rounded cursor-pointer font-['Playfair_Display']"
                >
                  {loading ? "Sending..." : "Send Code"}
                </button>
              </form>
            )}

            {/* ===> Step 1: Verify OTP */}
            {step === 1 && (
              <div>
                <div className="mb-4 text-center">
                  <label className="block mb-2 font-medium text-gray-700 font-['Playfair_Display']">
                    Enter the 6-digit OTP sent to your email
                  </label>

                  {/* OTP input boxes */}
                  <div className="flex justify-center gap-2 mb-4">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/, "");
                          if (!value) return;

                          const newOtp =
                            otp.substring(0, index) +
                            value +
                            otp.substring(index + 1);
                          setOtp(newOtp);

                          const nextInput = document.getElementById(
                            `otp-${index + 1}`
                          );
                          if (nextInput)
                            (nextInput as HTMLInputElement).focus();
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasteData = e.clipboardData
                            .getData("text")
                            .trim();
                          if (/^\d{6}$/.test(pasteData)) {
                            setOtp(pasteData);
                          } else {
                            MySwal.fire({
                              title: "⚠️ Invalid OTP format",
                              text: "Please paste a 6-digit code",
                              icon: "warning",
                              confirmButtonColor: "#8B5E35",
                            });
                          }
                        }}
                        id={`otp-${index}`}
                        className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[var(--wood-400)] focus:ring-2 focus:ring-[var(--wood-200)] focus:outline-none transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    className="border px-4 py-2 rounded cursor-pointer"
                    onClick={() => setStep(0)}
                  >
                    Back
                  </button>
                  <button
                    className="bg-[var(--wood-400)] text-white px-4 py-2 rounded cursor-pointer font-['Playfair_Display']"
                    onClick={verifyCode}
                  >
                    Verify Code
                  </button>
                </div>
              </div>
            )}

            {/* ===> Step 2: Reset Password */}
            {step === 2 && (
              <>
                <form onSubmit={handlePasswordSubmit(resetPassword)}>
                  <div className="mb-4">
                    <label className=" font-['Playfair_Display']">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        {...registerPassword("newPassword")}
                        className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[var(--wood-400)] focus:ring-2 focus:ring-[var(--wood-200)] focus:outline-none transition-all duration-200"
                      />
                      <span
                        className="absolute right-3 top-2 cursor-pointer"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      >
                        {isPasswordVisible ? "🙈" : "👁️"}
                      </span>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-red-500">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4 font-['Playfair_Display']">
                    <label>Confirm Password</label>
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      {...registerPassword("rePassword")}
                      className="w-full border rounded px-3 py-2"
                    />
                    {passwordErrors.rePassword && (
                      <p className="text-red-500">
                        {passwordErrors.rePassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[var(--wood-400)] text-white px-4 py-2 rounded cursor-pointer font-['Playfair_Display']"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="pb-10 pt-10 text-center text-gray-500">
          Are you want to login?{" "}
          <Link to="/login" className="underline text-[#8B5E35]">
            Login
          </Link>
        </p>
      </div>

      {/* ===> right side slider*/}
      <div className="hidden md:block md:w-1/2 bg-yellow-100">
        <AuthSlider />
      </div>
    </div>
  );
}
