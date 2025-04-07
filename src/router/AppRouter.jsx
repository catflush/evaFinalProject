// src/router/AppRouter.jsx
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LandingPage from "../pages/LandingPage";
import BookingForm from "../pages/BookingForm";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import DashboardHome from "../pages/DashboardHome";
import DashboardProfile from "../pages/DashboardProfile";

function AppRouter() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="booking" element={<BookingForm />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<RegisterPage />} />
        
        {/* Dashboard Routes */}
        <Route path="dashboard" element={<DashboardPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="analytics" element={<div className="p-4">Analytics Page (Coming Soon)</div>} />
          <Route path="calendar" element={<div className="p-4">Calendar Page (Coming Soon)</div>} />
          <Route path="messages" element={<div className="p-4">Messages Page (Coming Soon)</div>} />
          <Route path="notifications" element={<div className="p-4">Notifications Page (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
export default AppRouter;
