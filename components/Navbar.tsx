// Updated Navbar with Dark Theme
'use client';

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="bg-darkBg border-darkBorder">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-primaryAccent">
            AILearn
          </span>
        </Link>

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex text-sm bg-cardBg rounded-full focus:ring-4 focus:ring-accentHover"
            aria-expanded={dropdownOpen}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="User photo"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-14 mt-2 w-48 bg-cardBg divide-y divide-darkBorder rounded-lg shadow-lg">
              <div className="px-4 py-3">
                <span className="block text-sm text-textLight">User Name</span>
                <span className="block text-sm text-textMuted truncate">user@example.com</span>
              </div>
              <ul className="py-2">
                {['Dashboard', 'Settings', 'Sign out'].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-textLight hover:bg-accentHover hover:text-textLight"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => setNavOpen(!navOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-textMuted rounded-lg md:hidden hover:bg-accentHover"
            aria-controls="navbar-user"
            aria-expanded={navOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            navOpen ? 'block' : 'hidden'
          }`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-darkBorder rounded-lg bg-darkBg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
            {['Home', 'Courses', 'About', 'Contact'].map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="block py-2 px-3 text-textLight rounded-sm hover:bg-accentHover hover:text-textLight"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;