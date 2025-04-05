import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-primary text-primary-content">
      <nav>
        <h6 className="footer-title opacity-100">Services</h6>
        <NavLink className="link link-hover text-primary-content/80" to="/branding">Branding</NavLink>
      </nav>
      <nav>
        <h6 className="footer-title opacity-100">Company</h6>
        <NavLink className="link link-hover text-primary-content/80" to="/about">About us</NavLink>
        <NavLink className="link link-hover text-primary-content/80" to="/contact">Contact</NavLink>
      </nav>
      <nav>
        <h6 className="footer-title opacity-100">Legal</h6>
        <NavLink className="link link-hover text-primary-content/80" to="/terms">Terms of use</NavLink>
        <NavLink className="link link-hover text-primary-content/80" to="/privacy">Privacy Policy</NavLink>
      </nav>
      <nav>
        <h6 className="footer-title opacity-100">Follow Us</h6>
        <div className="grid grid-flow-col gap-4">
          <NavLink className="link link-hover text-primary-content/80" to="/facebook">Facebook</NavLink>
          <NavLink className="link link-hover text-primary-content/80" to="/twitter">Twitter</NavLink>
          <NavLink className="link link-hover text-primary-content/80" to="/instagram">Instagram</NavLink>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
