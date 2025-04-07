import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  FaHome, 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaChartLine,
  FaCalendarAlt,
  FaEnvelope,
  FaBell
} from "react-icons/fa";

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from location state or localStorage/sessionStorage
    const userFromState = location.state?.user;
    const userFromStorage = JSON.parse(
      localStorage.getItem("user") || 
      sessionStorage.getItem("user") || 
      "null"
    );
    
    if (userFromState) {
      setUser(userFromState);
    } else if (userFromStorage) {
      setUser(userFromStorage);
    } else {
      // No user data found, redirect to login
      toast.error("Please log in to access the dashboard");
      navigate("/login");
    }
    
    setLoading(false);
    
    // Show welcome message if coming from login
    if (location.state?.fromLogin) {
      toast.success(`Welcome back, ${userFromState?.firstName || userFromStorage?.firstName || 'User'}!`);
    }
  }, [location, navigate]);

  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    
    // Show logout message
    toast.success("You have been logged out successfully");
    
    // Redirect to login page
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          className="btn btn-circle btn-ghost" 
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center gap-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span>{user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
                </div>
              </div>
              <div>
                <h2 className="font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-base-content/70">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="menu menu-lg p-2">
              <li>
                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                  <FaHome className="h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/profile" className={location.pathname === "/dashboard/profile" ? "active" : ""}>
                  <FaUser className="h-5 w-5" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard/analytics" className={location.pathname === "/dashboard/analytics" ? "active" : ""}>
                  <FaChartLine className="h-5 w-5" />
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/dashboard/calendar" className={location.pathname === "/dashboard/calendar" ? "active" : ""}>
                  <FaCalendarAlt className="h-5 w-5" />
                  Calendar
                </Link>
              </li>
              <li>
                <Link to="/dashboard/messages" className={location.pathname === "/dashboard/messages" ? "active" : ""}>
                  <FaEnvelope className="h-5 w-5" />
                  Messages
                  <span className="badge badge-sm badge-primary">3</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/notifications" className={location.pathname === "/dashboard/notifications" ? "active" : ""}>
                  <FaBell className="h-5 w-5" />
                  Notifications
                  <span className="badge badge-sm badge-error">5</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/settings" className={location.pathname === "/dashboard/settings" ? "active" : ""}>
                  <FaCog className="h-5 w-5" />
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-base-300">
            <button 
              className="btn btn-error btn-block gap-2" 
              onClick={handleLogout}
            >
              <FaSignOutAlt className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10">
                    <span>{user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li><Link to="/dashboard/profile">Profile</Link></li>
                  <li><Link to="/dashboard/settings">Settings</Link></li>
                  <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <FaChartLine className="h-8 w-8" />
                </div>
                <div className="stat-title">Total Views</div>
                <div className="stat-value text-primary">25.6K</div>
                <div className="stat-desc">21% more than last month</div>
              </div>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaUser className="h-8 w-8" />
                </div>
                <div className="stat-title">New Users</div>
                <div className="stat-value text-secondary">2.6K</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
              </div>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaCalendarAlt className="h-8 w-8" />
                </div>
                <div className="stat-title">Bookings</div>
                <div className="stat-value">86%</div>
                <div className="stat-desc text-secondary">31 bookings today</div>
              </div>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaEnvelope className="h-8 w-8" />
                </div>
                <div className="stat-title">Messages</div>
                <div className="stat-value">12</div>
                <div className="stat-desc">↘︎ 3 unread</div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="bg-base-100 rounded-box shadow-lg p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 