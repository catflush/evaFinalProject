import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { WiAlien } from "react-icons/wi";

const Login = () => {
  const navigate = useNavigate();
  const [{ email, password }, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if user is already logged in and load saved email from localStorage
  useEffect(() => {
    // Check for saved email in localStorage
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    // Check if user is already logged in
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      // Validate token with the API
      validateToken(token);
    }
  }, [navigate]);

  // Function to validate token with the API
  const validateToken = async (token) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/users/login";
      
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        // Token is valid, redirect to dashboard
        const userData = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
        
        // Set user data in global state if you have a state management solution
        // For example, if using Context API or Redux
        // setUser(userData);
        
        // Redirect to dashboard with user data
        navigate("/dashboard", { 
          state: { 
            user: userData,
            fromLogin: true 
          } 
        });
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    } catch (err) {
      // Error validating token, remove it
      console.error("Token validation error:", err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!email || !password) throw new Error("All fields are required");
      setLoading(true);
      
      // API endpoint for login
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/users/login";
      
      // Send login request to the API
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Save email to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      
      // Prepare user data
      const userData = {
        id: data._id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      };
      
      // Store token in localStorage or sessionStorage based on remember me
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(userData));
      }
      
      // Set user data in global state if you have a state management solution
      // For example, if using Context API or Redux
      // setUser(userData);
      
      // Show success message
      toast.success("Login successful! Redirecting to dashboard...");
      
      // Redirect to dashboard with user data
      navigate("/dashboard", { 
        state: { 
          user: userData,
          fromLogin: true 
        } 
      });
    } catch (error) {
      // Handle specific error messages
      if (error.message.includes("Invalid credentials")) {
        toast.error("Invalid email or password");
      } else if (error.message.includes("User not found")) {
        toast.error("No account found with this email");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <WiAlien className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Make.io</span>
            </div>
            <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
            <p className="text-center text-base-content/70 mt-2">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  name="email"
                  value={email}
                  onChange={handleChange}
                  type="email"
                  className="grow"
                  placeholder="your@email.com"
                />
              </label>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  name="password"
                  value={password}
                  onChange={handleChange}
                  type="password"
                  className="grow"
                  placeholder="••••••••"
                />
              </label>
              <div className="flex justify-between items-center">
                <label className="label cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm mr-2" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="label-text">Remember me</span>
                </label>
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </div>
            </div>
            
            <div className="form-control mt-6">
              <button 
                className="btn btn-primary w-full" 
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
          
          <div className="divider">OR</div>
          
          <div className="text-center mt-2">
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary font-medium">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
