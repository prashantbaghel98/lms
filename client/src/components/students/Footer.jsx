import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">

        {/* Logo & Description */}
        <div>
          <img
            className="h-10 mb-5"
            src={assets.logo_dark}
            alt="Logo"
          />

          <p className="text-gray-400 leading-7">
            Learn from industry experts and build real-world skills with
            high-quality courses designed to help you grow your career and
            achieve your goals.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h2 className="text-lg font-semibold mb-5">Company</h2>

          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer transition">
              Home
            </li>
            <li className="hover:text-white cursor-pointer transition">
              About Us
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Contact Us
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Subscribe to our Newsletter
          </h2>

          <p className="text-gray-400 mb-6 leading-6">
            Get the latest news, updates, and learning resources delivered
            straight to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} GreatStack. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;