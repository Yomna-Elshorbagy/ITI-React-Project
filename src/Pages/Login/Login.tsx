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
import { jwtDecode } from "jwt-decode";

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
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "x-client-user-agent": navigator.userAgent,
          },
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      if (data?.message === "logIn Successfully") {
        dispatch(insertUserToken(data.accessToken));

        let username = "User";
        let role = "user";
        try {
          const decoded: any = jwtDecode(data.accessToken);
          username = decoded?.name || "User";
          role = decoded?.role || "user";
          console.log("Decoded token:", decoded);
        } catch (error) {
          console.error("Error decoding token:", error);
        }

        const destination = role === "admin" ? "/dashboard" : "/home";
        const welcomeText =
          role === "admin"
            ? `Welcome, Admin ${username}!`
            : `Welcome, ${username}!`;

        setSuccess(welcomeText);
        MySwal.fire({
          title: `👋 ${welcomeText}`,
          text:
            role === "admin"
              ? "Redirecting you to the admin dashboard..."
              : "You have logged in successfully.",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => navigate(destination),
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
    <>
      <section className="register">
        <div className="flex min-h-screen">
          <div className="relative w-full md:w-1/2 bg-[var(--colo-text)] min-h-screen flex justify-center items-center">
            <button
              onClick={() => navigate("/")}
              className="absolute top-6 left-6 bg-white shadow-md rounded-full p-3 hover:bg-amber-50 hover:scale-105 transition duration-200"
              title="Back to Home"
            >
              <i className="fa-solid fa-arrow-left text-[#8B5E35] text-lg"></i>
            </button>

            <div className="w-full px-5 md:w-[75%] max-w-md">
              <h1 className="text-[1.75rem] sm:text-[2rem] text-[#090f41] animate-pulse text-center mb-6">
                Log in
              </h1>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="text-[#090f41]"
              >
                {apiError && (
                  <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 mb-3 text-center text-sm">
                    {apiError}
                  </p>
                )}

                {success && (
                  <p className="bg-green-100 text-green-700 border border-green-400 rounded p-2 mt-3 mb-3 text-center text-sm">
                    {success}
                  </p>
                )}

                <div className="flex flex-col gap-2 mb-5">
                  <label className="text-[1.125rem]">E-mail</label>
                  <div className="relative">
                    <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                    <input
                      type="email"
                      placeholder="E-mail"
                      className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[var(--wood-400)] focus:ring-2 focus:ring-[var(--wood-200)] focus:outline-none transition-all duration-200"
                      {...register("email")}
                    />
                  </div>
                  {formState.errors.email && formState.touchedFields.email && (
                    <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                      {formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 mb-5">
                  <label className="text-[1.125rem]">Password</label>
                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E35] animate-[var(--animate-bounce-slow)]"></i>
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="xxxxxxxxxxxx"
                      className="w-full pl-10 py-3 border border-gray-300 rounded focus:border-[var(--wood-400)] focus:ring-2 focus:ring-[var(--wood-200)]  ocus:outline-none transition-all duration-200"
                      {...register("password")}
                    />
                    <i
                      className={`fa-solid cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E35] ${
                        isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                    ></i>
                  </div>
                  {formState.errors.password &&
                    formState.touchedFields.password && (
                      <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mt-3 text-center text-sm">
                        {formState.errors.password.message}
                      </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[var(--wood-400)] hover:bg-[var(--wood-500)] active:scale-95 transition-transform duration-200 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-amber-200/30 disabled:opacity-60 disabled:cursor-not-allowed w-full"
                >
                  {isLoading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-gray-500">
                Create new account?{" "}
                <Link to="/register" className="underline text-[#8B5E35]">
                  Sign up
                </Link>
              </p>
              <p className=" text-center text-gray-500">
                Forget Password{" "}
                <Link to="/forgetPass" className="underline text-[#8B5E35]">
                  forget password
                </Link>
              </p>
            </div>
          </div>

          <div className="hidden md:block h-screen w-1/2 bg-gray-200 flex items-center justify-center">
            <AuthSlider />
          </div>
        </div>
      </section>
    </>
  );
}
