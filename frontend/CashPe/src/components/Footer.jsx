import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <nav className="grid grid-flow-col gap-4">
        <Link to="/about" className="link link-hover">
          About us
        </Link>
        <Link to="/contact" className="link link-hover">
          Contact
        </Link>
        <Link to="/privacy" className="link link-hover">
          Privacy Policy
        </Link>
        <Link to="/terms" className="link link-hover">
          Terms of Service
        </Link>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.072 1.623-4.662 2.6-7.495 2.6-.485 0-.965-.029-1.435-.083 2.986 1.972 6.518 3.125 10.33 3.125 12.428 0 16.255-10.435 16.255-19.683 0-.476-.015-.95-.04-1.424z"></path>
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.515 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.588-1.333h2.412v-3.481c-.427-.096-1.509-.192-3.008-.192-3.48 0-5.912 1.761-5.912 5.667v2.514z"></path>
            </svg>
          </a>
        </div>
      </nav>
      <aside>
        <p>Copyright © 2024 - All right reserved by CashPe Ltd</p>
      </aside>
    </footer>
  );
};

export default Footer;