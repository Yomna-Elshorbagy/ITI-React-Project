import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import { store } from "./Store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import KayanChatbot from "./Components/Chatbot/Chatbot";
import AdminProtectedRoute from "./Shared/ProtectedRoutes/AdminProtectedRoutes";
import ProtectedRoutes from "./Shared/ProtectedRoutes/ProtectedRoutes";

const Layout = lazy(() => import("./Components/Layout/layout"));
const Home = lazy(() => import("./Pages/Home/Home"));
const Products = lazy(() => import("./Pages/Products/Products"));
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const ProductDetails = lazy(
  () => import("./Pages/ProductDetails/ProductDetails")
);
const Reviews = lazy(() => import("./Pages/Reviews/Reviews"));
const About = lazy(() => import("./Pages/About/About"));
const UserProfile = lazy(() => import("./Pages/Profile/UserProfile"));
const NotFound = lazy(() => import("./Components/NotFound/NotFound"));
const Category = lazy(() => import("./Pages/Category/Category"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Register = lazy(() => import("./Pages/Register/Register"));
const ForgetPassword = lazy(
  () => import("./Pages/ForgetPassword/ForgetPassword")
);
const Checkout = lazy(() => import("./Pages/Checkout/Checkout"));
const ContactUs = lazy(() => import("./Pages/Contact/ContactUs"));
const AuthLayout = lazy(() => import("./Components/AuthLayout/AuthLayout"));

const DashboardLayout = lazy(() => import("./Dashboard/Dashboared"));
const Overview = lazy(() => import("./Dashboard/Pages/OverView/OverView"));
const OrderProducts = lazy(() => import("./Dashboard/Pages/Products/Products"));
const Orders = lazy(() => import("./Dashboard/Pages/Orders/Orders"));
const Users = lazy(() => import("./Dashboard/Pages/Users/Users"));
const Reports = lazy(() => import("./Dashboard/Pages/Reports/Reports"));
const DashCategories = lazy(
  () => import("./Dashboard/Pages/Categories/Categories")
);
const ContactsPage = lazy(() => import("./Dashboard/Pages/Contact/Contacts"));
const Coupons = lazy(() => import("./Dashboard/Pages/Coupons/Coupons"));

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      {
        path: "checkout",
        element: (
          <ProtectedRoutes>
            <Checkout />{" "}
          </ProtectedRoutes>
        ),
      },
      { path: "products", element: <Products /> },
      {
        path: "cart",
        element: (
          <ProtectedRoutes>
            <Cart />
          </ProtectedRoutes>
        ),
      },
      { path: "productDetails/:id", element: <ProductDetails /> },
      {
        path: "reviews/:id",
        element: (
          <ProtectedRoutes>
            <Reviews />
          </ProtectedRoutes>
        ),
      },
      { path: "category", element: <Category /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <ContactUs /> },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <UserProfile />
          </ProtectedRoutes>
        ),
      },
      { path: "qr-login", element: <UserProfile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "dashboard",
    element: (
      <AdminProtectedRoute>
        <DashboardLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: "products", element: <OrderProducts /> },
      { path: "orders", element: <Orders /> },
      { path: "users", element: <Users /> },
      { path: "categories", element: <DashCategories /> },
      { path: "coupons", element: <Coupons /> },
      { path: "emails", element: <ContactsPage /> },
      { path: "reports", element: <Reports /> },
    ],
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgetPass", element: <ForgetPassword /> },
    ],
  },
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <GoogleOAuthProvider clientId="700704531343-884jrghj44cpak2fo1na231uudd889nj.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen text-lg font-semibold">
                Loading...
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
          <Toaster />
          <KayanChatbot />
        </Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
