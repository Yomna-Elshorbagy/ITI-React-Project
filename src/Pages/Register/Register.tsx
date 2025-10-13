import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AuthSlider from "../../Shared/AuthSlider/AuthSlider";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Register() {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setAPIError] = useState("");
  const [success, setSuccess] = useState("");

  //===> implement validation using zod
  const passPattern = /^[A-Z][A-Za-z0-9]{5,20}$/;
  const mobilePattern = /^01[01245]\d{8}$/;
  const registerSchema = z
    .object({
      userName: z
        .string()
        .nonempty("Name is Required")
        .min(3, "Name must be at least 3 characters")
        .max(70),
      email: z.string().nonempty("Email is Required").email("Invalid email"),
      password: z
        .string()
        .nonempty("Password is Required")
        .regex(
          passPattern,
          "Password must start with uppercase and be 6-20 chars"
        ),
      Cpassword: z.string(),
      mobileNumber: z
        .string()
        .regex(mobilePattern, "Invalid Egyptian mobile number"),
      recoveryEmail: z.string().email("Invalid recovery email"),
      gender: z.enum(["male", "female"]).refine((val) => !!val, {
        message: "Please select a gender",
      }),
    })
    .refine(function (value) {
      if (value.password != value.Cpassword) {
        return false;
      }
      return true;
    }, "Passwords must match");

  type RegisterFormData = z.infer<typeof registerSchema>;
  const { register, handleSubmit, formState, watch } =
    useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      mode: "onSubmit",
    });
  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterFormData> = async (
    data: RegisterFormData
  ) => {
    setIsLoading(true); //make loading when submitting on button
    setAPIError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "https://iti-react-backend.vercel.app/auth/signup",
        data
      );

      if (res.data?.message === "user created Successfully") {
        //===> 1- set state
        setSuccess("Registered successfully! Redirecting to login...");

        //===> 2- show SweetAlert and redirect after 3s
        MySwal.fire({
          title: "🎉 Account Created!",
          text: "Redirecting to login in 3 seconds...",
          icon: "success",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#8B5E35",
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          navigate("/login");
        });
      } else {
        // ===> 3- Unexpected response
        setAPIError(res.data?.message || "Unexpected response");

        MySwal.fire({
          title: "Unexpected Response",
          text: res.data?.message || "Unexpected response",
          icon: "warning",
          confirmButtonColor: "#8B5E35",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setAPIError("Email already exists");

        MySwal.fire({
          icon: "error",
          title: "Email already exists",
          text: "Please use a different email address",
        });
      } else {
        setAPIError(error.response?.data?.message || "Network/Server error");

        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Network/Server error",
          showClass: { popup: "animate__animated animate__shakeX" },
          hideClass: { popup: "animate__animated animate__fadeOutUp" },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="register">
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 bg-[#f9f9f9] max-h-screen overflow-y-auto py-5 flex items-start dark:bg-gray-900 pb-5 dark:text-white">
          <div className="w-full px-5 md:px-0 md:w-[75%] mx-auto h-ful">
            <h1 className="text-[1.75rem] sm:text-[2rem] text-[#090f41] dark:text-white animate-pulse">
              Sign Up
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-5">
              Welcome in our Store
            </p>

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

              {/* username */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem] dark:text-white">
                  User Name
                </label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                  <input
                    type="text"
                    placeholder="UserName"
                    className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[#8B5E35] focus:outline-none"
                    {...register("userName")}
                  />
                </div>
                {formState.errors.userName && (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm dark:text-gray-400">
                    {formState.errors.userName.message}
                  </p>
                )}
              </div>

              {/* email */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem] dark:text-white">
                  E-mail
                </label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[#8B5E35] focus:outline-none"
                    {...register("email")}
                  />
                </div>
                {formState.errors.email && (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                    {formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem] dark:text-white">
                  Password
                </label>
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
                {formState.errors.password && (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                    {formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* confirm password */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem] dark:text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="xxxxxxxxxxxx"
                    className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[#8B5E35] focus:outline-none"
                    {...register("Cpassword")}
                  />
                </div>
                {formState.errors.Cpassword && (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                    {formState.errors.Cpassword.message}
                  </p>
                )}
              </div>

              {/* phone */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem] dark:text-white">Phone</label>
                <div className="relative">
                  <i className="fa-solid fa-mobile absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                  <input
                    type="tel"
                    placeholder="01023780008"
                    className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[#8B5E35] focus:outline-none"
                    {...register("mobileNumber")}
                  />
                </div>
                {formState.errors.mobileNumber && (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                    {formState.errors.mobileNumber.message}
                  </p>
                )}
              </div>
              {/* recovery email */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem] dark:text-white">
                  Recovery Email
                </label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[#8B5E35] focus:outline-none"
                    {...register("recoveryEmail")}
                  />
                </div>
                {formState.errors.recoveryEmail && (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                    {formState.errors.recoveryEmail.message}
                  </p>
                )}
              </div>

              {/* gender */}
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[1.125rem] dark:text-white">
                  Gender
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-[1.125rem] dark:text-white">
                    <input
                      type="radio"
                      value="male"
                      {...register("gender")}
                      className="accent-[#8B5E35]"
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2 text-[1.125rem] dark:text-white">
                    <input
                      type="radio"
                      value="female"
                      {...register("gender")}
                      className="accent-[#8B5E35]"
                    />
                    Female
                  </label>
                </div>
                {formState.errors.gender && (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                    {formState.errors.gender.message}
                  </p>
                )}
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#8B5E35] hover:bg-[#734927] active:scale-95 transition-transform duration-200 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-amber-200/30 disabled:opacity-60 disabled:cursor-not-allowed w-full"
              >
                {isLoading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="mt-5 pb-10 text-center text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="underline text-[#8B5E35]">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:block h-screen w-1/2 bg-gray-200 flex items-center justify-center">
          <AuthSlider />
        </div>
      </div>
    </section>
  );
}
