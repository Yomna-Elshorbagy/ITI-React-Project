import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AuthSlider from "../../Shared/AuthSlider/AuthSlider";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { insertUserToken } from "../../Store/Slices/AuthSlice";

const MySwal = withReactContent(Swal);

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setAPIError] = useState("");
  const [success, setSuccess] = useState("");

  //===> implement validation using zod
  const passPattern = /^[A-Z][A-Za-z0-9]{5,20}$/;
  const registerSchema = z.object({
    email: z.string().nonempty("Email is Required").email("Invalid email"),
    password: z
      .string()
      .nonempty("password is Required")
      .regex(
        passPattern,
        "Password must start with uppercase and be 6-20 chars"
      ),
  });
  type RegisterFormData = z.infer<typeof registerSchema>;

  const { register, handleSubmit, formState } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const { mutate: login } = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const res = await axios.post(
        "https://iti-react-backend.vercel.app/auth/login",
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.message === "logIn Successfully") {
        // localStorage.setItem("accessToken", data.accessToken);
        dispatch(insertUserToken(data.accessToken));
        setSuccess("Login Successful!");
        MySwal.fire({
          title: "✅ Login Successful!",
          text: "Redirecting to home in 3 seconds...",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => navigate("/home"),
        });
      } else {
        setAPIError(data?.message || "Unexpected response");
        MySwal.fire({
          title: "❌ Login Failed",
          text: data?.message || "Unexpected response",
          icon: "error",
          confirmButtonColor: "#8B5E35",
        });
      }
    },
    onError: (error: any) => {
      console.error(error);
      setIsLoading(false);
      const errorMsg =
        error.response?.data?.message || "Network or server error.";
      setAPIError(errorMsg);
      MySwal.fire({
        title: "❌ Login Failed",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#8B5E35",
      });
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (formData) => {
    setIsLoading(true);
    setAPIError("");
    setSuccess("");
    login(formData);
  };

  return (
    <section className="register">
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 bg-[#f9f9f9] max-h-screen overflow-y-auto py-16 flex items-center">
          <div className="w-full px-5 md:px-0 md:w-[75%] mx-auto h-full">
            <h1 className="text-[1.75rem] sm:text-[2rem] text-[#090f41] animate-pulse">
              Log in
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="text-[#090f41]">
              {/* API Success & Error Alerts */}
              {apiError && (
                <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 mb-3 text-center text-sm">
                  {apiError}
                </p>
              )}

              {success && (
                <p className="bg-green-100 text-green-700 border border-green-400 rounded p-2 mt-3  mb-3 text-center text-sm">
                  {success}
                </p>
              )}

              {/* Email */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem]">E-mail</label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[#8B5E35] focus:outline-none"
                    {...register("email")}
                  />
                </div>
                {formState.errors.email && formState.touchedFields.email ? (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                    {formState.errors.email.message}
                  </p>
                ) : null}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem]">Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="xxxxxxxxxxxx"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded focus:border-[#8B5E35] focus:outline-none"
                    {...register("password")}
                  />
                  <i
                    className={`fa-solid cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)] ${
                      isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                    }`}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  ></i>
                </div>
                {formState.errors.password &&
                formState.touchedFields.password ? (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                    {formState.errors.password.message}
                  </p>
                ) : null}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#8B5E35] text-white py-3 px-6 rounded w-full hover:bg-[#734927] transition"
              >
                {isLoading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-5 pb-10 text-center text-gray-500">
              create new account?{" "}
              <Link to="/register" className="underline text-[#8B5E35]">
                sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Auth Slider Placeholder */}
        <div className="hidden md:block h-screen w-1/2 bg-gray-200 flex items-center justify-center">
          <AuthSlider />
        </div>
      </div>
    </section>
  );
}
