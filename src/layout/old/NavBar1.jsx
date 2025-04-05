import { Link } from "react-router-dom";
import { WiAlien } from "react-icons/wi";

function NavBar() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-40 w-full bg-background">
          {/*           <div className="container flex h-16 items-center justify-between py-4"> */}
          <div className="navbar bg-pink-500 text-xl text-white font-bold md:flex items-center gap-6">
            {" "}
            <div className="flex items-center gap-2">
              <WiAlien className="h-6 w-6 text-white" />
              <span className="text-xl text-white font-bold">Alien</span>
            </div>
            {/* Mobile menu button */}
            <div className="dropdown md:hidden">
              <label tabIndex={0} className="btn m-1">
                Menu
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Parent</a>
                  <ul className="p-2">
                    <li>
                      <a>Submenu 1</a>
                    </li>
                    <li>
                      <a>Submenu 2</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>Item 3</a>
                </li>
              </ul>
            </div>
            {/* Desktop navigation */}
            <div className="navbar-center hidden lg:flex gap-6 justify-center">
              <Link
                to="/booking"
                className="text-xl text-white font-bold hover:text-primary"
              >
                Booking
              </Link>
              <Link
                to="/contact"
                className="text-xl text-white font-bold hover:text-primary"
              >
                Contact
              </Link>
            </div>
            <div className="navbar-end">
              <button className="btn bg-lime-200 text-neutral">Log In</button>
              <button className="btn bg-lime-200 text-neutral">Sign up</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
