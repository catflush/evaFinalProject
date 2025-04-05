import { Link, NavLink } from "react-router-dom";
import { WiAlien } from "react-icons/wi";

const NavBar = () => {
  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
            <li><Link to="/about" className="text-neutral-content">About</Link></li>
            <li><Link to="/features" className="text-neutral-content">Features</Link></li>
            <li><Link to="/blog" className="text-neutral-content">Blog</Link></li>
            <li><Link to="/booking" className="text-neutral-content">Booking</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          <WiAlien className="h-6 w-6" />
          <span className="font-bold">Make.</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/about" className="text-primary-content hover:text-accent">About</NavLink></li>
          <li><NavLink to="/features" className="text-primary-content hover:text-accent">Features</NavLink></li>
          <li><NavLink to="/blog" className="text-primary-content hover:text-accent">Blog</NavLink></li>
          <li><NavLink to="/booking" className="text-primary-content hover:text-accent">Booking</NavLink></li>
        </ul>
      </div>
      <div className="navbar-end">
        <NavLink to="/login" className="btn btn-ghost">Log In</NavLink>
        <NavLink to="/signup" className="btn btn-accent text-accent-content">Sign up</NavLink>
      </div>
    </div>
  );
};

export default NavBar;
