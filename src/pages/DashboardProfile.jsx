import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const DashboardProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage/sessionStorage
    const userFromStorage = JSON.parse(
      localStorage.getItem("user") || 
      sessionStorage.getItem("user") || 
      "null"
    );
    
    if (userFromStorage) {
      setUser(userFromStorage);
      setFormData({
        firstName: userFromStorage.firstName || "",
        lastName: userFromStorage.lastName || "",
        email: userFromStorage.email || "",
        phone: userFromStorage.phone || "",
        address: userFromStorage.address || "",
        bio: userFromStorage.bio || ""
      });
    }
    
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, you would send this to your API
      // For now, we'll just simulate a successful update
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data in storage
      const updatedUser = {
        ...user,
        ...formData
      };
      
      // Update in the appropriate storage
      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      // Update state
      setUser(updatedUser);
      
      // Show success message
      toast.success("Profile updated successfully!");
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update error:", err.message);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        {!isEditing ? (
          <button 
            className="btn btn-primary btn-sm gap-2" 
            onClick={() => setIsEditing(true)}
          >
            <FaEdit /> Edit Profile
          </button>
        ) : (
          <button 
            className="btn btn-ghost btn-sm gap-2" 
            onClick={() => setIsEditing(false)}
          >
            <FaTimes /> Cancel
          </button>
        )}
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input input-bordered" 
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input input-bordered" 
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered" 
                    required
                    disabled
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-bordered" 
                  />
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input input-bordered" 
                  />
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24" 
                  ></textarea>
                </div>
              </div>
              
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-20">
                    <span className="text-2xl">{user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-base-content/70">{user?.role || "User"}</p>
                </div>
              </div>
              
              <div className="divider"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaPhone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p>{user?.address || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start gap-3">
                    <FaUser className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Bio</p>
                      <p>{user?.bio || "No bio provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile; 