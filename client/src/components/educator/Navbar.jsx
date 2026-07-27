import React from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-9 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Welcome Text */}
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm text-gray-500">Welcome</p>
            <p className="font-semibold text-gray-800">
              {user ? user.fullName : "Developer"}
            </p>
          </div>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center justify-center rounded-full border border-gray-200 p-1 shadow-sm">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          ) : (
            <img
              src={assets.profile_img}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;