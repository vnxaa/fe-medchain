import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Navigation = () => {
  const router = useRouter();
  const [role, setRole] = React.useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      handleNavigation("../Common/Permission");
    } else {
      const decodedToken = jwt_decode(token);
      // Decode the token to obtain the user's role
      if (decodedToken?.doctor) {
        setRole("doctor");
      } else if (decodedToken?.patient) {
        setRole("patient");
      } else if (decodedToken?.hospital) {
        setRole("hospital");
      }
    }
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  // Function to clear the token from local storage
  const clearToken = () => {
    localStorage.removeItem("token");
  };

  // Example usage:
  // Call the clearToken function when the user signs out
  const handleSignOut = () => {
    // Perform sign out logic here

    // Clear the token from local storage
    clearToken();
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://flowbite.com/" className="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8 mr-3"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Medchain
          </span>
        </a>
        <div className="flex items-center md:order-2">
          <button
            type="button"
            className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
            onClick={() => {
              const dropdown = document.getElementById("user-dropdown");
              dropdown.classList.toggle("hidden");
            }}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="/docs/images/people/profile-picture-3.jpg"
              alt="user photo"
            />
          </button>
          {/* Dropdown menu */}
          <div
            className="z-50 hidden my-4 text-base list-none bg-white absolute divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
            style={{ marginTop: "250px" }}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                Bonnie Green
              </span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                name@flowbite.com
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <a
                  href="./Profile"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white ${
                    router.pathname.endsWith("/Profile")
                      ? "md:text-blue-700"
                      : ""
                  }`}
                >
                  Hồ sơ
                </a>
              </li>
              <li>
                <a
                  href="./Settings"
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white ${
                    router.pathname.endsWith("/Settings")
                      ? "md:text-blue-700"
                      : ""
                  }`}
                >
                  Cài đặt
                </a>
              </li>
              <li>
                <a
                  href="./LoginPage"
                  className="block px-4 py-2 text-sm text-gray-700 text-red-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  onClick={handleSignOut}
                >
                  Thoát
                </a>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-2"
            aria-expanded={isMenuOpen ? "true" : "false"}
            onClick={handleMenuToggle}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center  justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? "" : "hidden"
          }`}
          id="mobile-menu-2"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {role === "hospital" && (
              <>
                <li>
                  <a
                    href="./Dashboard"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/Dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Hospital/Dashboard"
                        ? "page"
                        : undefined
                    }
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="./MedicalRecord"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/MedicalRecord"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Hospital/MedicalRecord"
                        ? "page"
                        : undefined
                    }
                  >
                    Bệnh án
                  </a>
                </li>
                <li>
                  <a
                    href="./Doctor"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/Doctor"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Hospital/Doctor"
                        ? "page"
                        : undefined
                    }
                  >
                    Bác sĩ
                  </a>
                </li>
                <li>
                  <a
                    href="./Patient"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/Patient"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Hospital/Patient"
                        ? "page"
                        : undefined
                    }
                  >
                    Bệnh nhân
                  </a>
                </li>
              </>
            )}
            {role === "doctor" && (
              <>
                <li>
                  <a
                    href="./Dashboard"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Doctor/Dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Doctor/Dashboard"
                        ? "page"
                        : undefined
                    }
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="./MedicalRecord"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Doctor/MedicalRecord"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Doctor/MedicalRecord"
                        ? "page"
                        : undefined
                    }
                  >
                    Bệnh án
                  </a>
                </li>
                <li>
                  <a
                    href="./Patient"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Doctor/Patient"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Doctor/Patient" ? "page" : undefined
                    }
                  >
                    Bệnh nhân
                  </a>
                </li>
              </>
            )}
            {role === "patient" && (
              <>
                <li>
                  <a
                    href="./Dashboard"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Patient/Dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Patient/Dashboard"
                        ? "page"
                        : undefined
                    }
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="./MedicalRecord"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Patient/MedicalRecord"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Patient/MedicalRecord"
                        ? "page"
                        : undefined
                    }
                  >
                    Bệnh án
                  </a>
                </li>
                <li>
                  <a
                    href="./Doctor"
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Patient/Doctor"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                    aria-current={
                      router.pathname === "/Patient/Doctor" ? "page" : undefined
                    }
                  >
                    Bác sĩ
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
