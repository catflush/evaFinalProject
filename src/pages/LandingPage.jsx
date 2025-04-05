import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-neutral text-neutral-content">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Makey</h1>
            <p className="py-6">Whether your passion is baking, DIY, or coding, Make.io has the tools to turn your individual expertise into engaging courses. From live sessions and Q&As to personalized coaching, everything you need is right at your fingertips - no matter your niche.</p>
            <Link to="/register" className="btn btn-accent text-accent-content">Get Started</Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Why Choose Make.io?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-neutral text-neutral-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Community</h3>
                <p>Our platform gives you everything you need in one place. No extra tools required. Designed for community leaders, it's your go-to platform for coaching, courses, and connection..</p>
              </div>
            </div>
            <div className="card bg-neutral text-neutral-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Real-time Courses</h3>
                <p>Need to host events? We've got you covered. Go from group coaching and workshops to conferences and summits. Integrate live events directly into your community space, no problem.</p>
              </div>
            </div>
            <div className="card bg-neutral text-neutral-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Monetize Your Skills</h3>
                <p>Make data-driven decisions with our comprehensive analytics and reporting tools.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

/*  
<div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <WiAlien className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Alien</span>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto py-8">
          <h1 className="text-2xl font-semibold">Welcome to StreamLine</h1>
          <p className="mt-4">
            Your one-stop solution for streamlined workflows.
          </p>
        </section>
      </main>
    </div>
     */
