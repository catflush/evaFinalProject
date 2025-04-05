import { Outlet } from "react-router-dom";
import NavBar from "../components/UI/NavBar";
import Footer from "../components/UI/Footer";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-base-300">
      {/* Navbar with acid theme colors */}
      <div className="sticky top-0 z-50 bg-primary shadow-lg">
        <NavBar />
      </div>

      {/* Main content with acid theme styling */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto bg-base-100 rounded-lg shadow-lg p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer with acid theme colors */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
