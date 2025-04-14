import { useEffect } from "react";
import { useUser } from "../context/useUser";
import { useServices } from "../context/ServiceContext";
import { FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const { user } = useUser();
  const { services, loading, fetchServices } = useServices();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Welcome Header Section */}
      <div className="bg-base-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || 'Maker'}!
            </h1>
            <p className="text-base-content/70">
              Explore our services and start your learning journey today.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : services.length > 0 ? (
          services.slice(0, 3).map((service) => (
            <div key={service._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              {service.attachments && service.attachments.length > 0 && (
                <figure className="px-4 pt-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${service.attachments[0].path}`}
                    alt={service.title}
                    className="rounded-xl h-48 w-full object-cover"
                  />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title">
                  {service.title}
                  <div className={`badge ${
                    service.level === 'beginner' ? 'badge-success' :
                    service.level === 'intermediate' ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {service.level}
                  </div>
                </h2>
                <p className="text-base-content/70">{service.description}</p>
                <div className="card-actions justify-between items-center mt-4">
                  <span className="text-xl font-bold text-primary">
                    ${service.price}
                  </span>
                  <Link to="/dashboard/book-service" className="btn btn-primary">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No services available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new services!</p>
          </div>
        )}
      </div>

      {/* View All Services Button */}
      <div className="mt-8 text-center">
        <Link to="/dashboard/services" className="btn btn-primary btn-lg">
          View All Services
          {!loading && <span className="badge badge-accent ml-2">{services.length}</span>}
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome; 