import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Hooks/reduxHooks";
import { insertUserToken } from "../../Store/Slices/AuthSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const api = axios.create({
    baseURL: "https://iti-react-backend.vercel.app/auth",
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ===> On Success
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("Google ID Token:", idToken);

      const { data } = await api.post("/google-login", { idToken });
      console.log("Google Login Response:", data);

      localStorage.setItem("accessToken", data.accessToken);
      dispatch(insertUserToken(data.accessToken));

      MySwal.fire({
        title: "✅ Login Successful!",
        text: "Redirecting to home in 3 seconds...",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => navigate("/home"),
      });
    } catch (error: any) {
      console.error("Login failed:", error);

      MySwal.fire({
        title: "❌ Google Login Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong, please try again.",
        icon: "error",
        confirmButtonColor: "#8B5E35",
      });
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="flex justify-center mt-6">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError}/>
    </div>
  );
}
