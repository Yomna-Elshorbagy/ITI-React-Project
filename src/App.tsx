import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Layout from "./Components/Layout/layout";
import Home from "./Pages/Home/Home";
import Products from "./Pages/Products/Products";
import Cart from "./Pages/Cart/Cart";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import About from "./Pages/About/About";
import UserProfile from "./Pages/Profile/UserProfile";
import NotFound from "./Components/NotFound/NotFound";
import Category from "./Pages/Category/Category";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import { store } from "./Store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ContactUs from "./Pages/Contact/ContactUs";
import AuthLayout from "./Components/AuthLayout/AuthLayout";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "productDetails/:id",
        element: <ProductDetails />,
      },
      {
        path: "category",
        element: <Category />,
      },

      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      { path: "qr-login", element: <UserProfile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "forgetPass",
        element: <ForgetPassword />,
      },
    ],
  },
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <GoogleOAuthProvider clientId="700704531343-884jrghj44cpak2fo1na231uudd889nj.apps.googleusercontent.com">
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <RouterProvider router={router} />
            <Toaster />
          </Provider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
