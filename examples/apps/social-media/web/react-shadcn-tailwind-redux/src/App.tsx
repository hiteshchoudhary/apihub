import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import { loadUser } from "./redux/slices/authSlice";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Navbar from "./components/Navbar";
import Register from "./pages/auth/register";
import AuthRoute from "./components/auth/AuthRoute";
import NonAuthRoute from "./components/auth/NonAuthRoute";
import Home from "./pages/home";
import Sidebar from "./components/sidebar";
import UserProfilePage from "@/pages/profile/user-profile-page";
import EditProfilePage from "./pages/profile/edit-profile-page";

function App() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id || !token) {
      dispatch(loadUser());
    }
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/register"
          element={
            <NonAuthRoute>
              <Register />
            </NonAuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <NonAuthRoute>
              <Login />
            </NonAuthRoute>
          }
        />

        <Route
          path="/user/:username"
          element={
            <AuthRoute>
              <Sidebar />
              <UserProfilePage />
            </AuthRoute>
          }
        />

        <Route
          path="/"
          element={
            <AuthRoute>
              <Sidebar />
              <Home />
            </AuthRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <AuthRoute>
              <Sidebar />
              <EditProfilePage />
            </AuthRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
