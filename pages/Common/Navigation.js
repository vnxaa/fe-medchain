import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
const Navigation = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [user, userInfo] = useState("");
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
      if (decodedToken?.user?.role === "doctor") {
        setRole("doctor");
        userInfo(decodedToken?.user);
      } else if (decodedToken?.patient) {
        setRole("patient");
        userInfo(decodedToken?.patient);
      } else if (decodedToken?.hospital) {
        setRole("hospital");
        userInfo(decodedToken?.hospital);
      } else if (decodedToken?.user?.role === "staff") {
        setRole("staff");
        userInfo(decodedToken?.user);
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
    <nav
      className="bg-white mb-2 border-b border-gray-200 dark:bg-gray-900"
      // style={{ marginBottom: "50px" }}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center">
          <div className="h-8 mr-1">
            <div className="">
              <div className="font-normal text-gray-500">
                <FontAwesomeIcon
                  icon={faHeartbeat}
                  size="2x"
                  className="mr-2 text-blue-500"
                />
              </div>
            </div>
          </div>
          <span className="self-center  text-2xl font-bold whitespace-nowrap dark:text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-bl from-purple-600 to-blue-500 hover:bg-gradient-to-bl">
              Medchain
            </span>
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
              src={user.picture}
              alt="user photo"
            />
          </button>
          {/* Dropdown menu */}

          <div
            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            style={{
              position: "absolute",
              inset: "0px auto auto 0px",
              margin: "0px",
              transform: "translate(1440px, 58px)",
            }}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                {user?.name}
              </span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                {/* {user.walletAddress &&
                  `${user.walletAddress.substring(
                    0,
                    5
                  )}...${user.walletAddress.substring(
                    user.walletAddress.length - 5
                  )}`} */}
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <a
                  href={
                    role === "doctor"
                      ? "/Doctor/Profile"
                      : role === "hospital"
                      ? "/Hospital/Profile"
                      : role === "patient"
                      ? "/Patient/Profile"
                      : role === "staff"
                      ? "/Staff/Profile"
                      : ""
                  }
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
                  href={
                    role === "doctor"
                      ? "/Doctor/Settings"
                      : role === "hospital"
                      ? "/Hospital/Settings"
                      : role === "patient"
                      ? "/Patient/Settings"
                      : role === "staff"
                      ? "/Staff/Settings"
                      : ""
                  }
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
                  href={
                    role === "doctor"
                      ? "/Doctor/LoginPage"
                      : role === "hospital"
                      ? "/Hospital/LoginPage"
                      : role === "patient"
                      ? "/Patient/LoginPage"
                      : role === "staff"
                      ? "/Staff/LoginPage"
                      : ""
                  }
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
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/Dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Hospital/Dashboard"
                      aria-current={
                        router.pathname === "/Hospital/Dashboard"
                          ? "page"
                          : undefined
                      }
                    >
                      Dashboard
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/MedicalRecord"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Hospital/MedicalRecord"
                      aria-current={
                        router.pathname === "/Hospital/MedicalRecord"
                          ? "page"
                          : undefined
                      }
                    >
                      Bệnh án
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/Doctor" ||
                      router.pathname === "/Hospital/DoctorAccount" ||
                      router.pathname === "/Hospital/DoctorList"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Hospital/Doctor"
                      aria-current={
                        router.pathname === "/Hospital/Doctor"
                          ? "page"
                          : undefined
                      }
                    >
                      Bác sĩ
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/Staff"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Hospital/Staff"
                      aria-current={
                        router.pathname === "/Hospital/Staff"
                          ? "page"
                          : undefined
                      }
                    >
                      Nhân viên
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Hospital/Patient"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Hospital/Patient"
                      aria-current={
                        router.pathname === "/Hospital/Patient"
                          ? "page"
                          : undefined
                      }
                    >
                      Bệnh nhân
                    </Link>
                  </div>
                </li>
              </>
            )}
            {role === "doctor" && (
              <>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Doctor/Dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Doctor/Dashboard"
                      aria-current={
                        router.pathname === "/Doctor/Dashboard"
                          ? "page"
                          : undefined
                      }
                    >
                      Dashboard
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Doctor/MedicalRecord"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Doctor/MedicalRecord"
                      aria-current={
                        router.pathname === "/Doctor/MedicalRecord"
                          ? "page"
                          : undefined
                      }
                    >
                      Bệnh án
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Doctor/Patient"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Doctor/Patient"
                      aria-current={
                        router.pathname === "/Doctor/Patient"
                          ? "page"
                          : undefined
                      }
                    >
                      Bệnh nhân
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Doctor/Appointment"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Doctor/Appointment"
                      aria-current={
                        router.pathname === "/Doctor/Appointment"
                          ? "page"
                          : undefined
                      }
                    >
                      Lịch khám
                    </Link>
                  </div>
                </li>
              </>
            )}
            {role === "patient" && (
              <>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Patient/Dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Patient/Dashboard"
                      aria-current={
                        router.pathname === "/Patient/Dashboard"
                          ? "page"
                          : undefined
                      }
                    >
                      Dashboard
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Patient/MedicalRecord"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Patient/MedicalRecord"
                      aria-current={
                        router.pathname === "/Patient/MedicalRecord"
                          ? "page"
                          : undefined
                      }
                    >
                      Bệnh án
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Patient/Doctor"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Patient/Doctor"
                      aria-current={
                        router.pathname === "/Patient/Doctor"
                          ? "page"
                          : undefined
                      }
                    >
                      Đặt lịch khám
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === ""
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link href="/CheckAppointment">
                      <a target="_blank" rel="noopener noreferrer">
                        Tra phiếu khám
                      </a>
                    </Link>
                  </div>
                </li>
              </>
            )}
            {role === "staff" && (
              <>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Staff/Dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Staff/Dashboard"
                      aria-current={
                        router.pathname === "/Staff/Dashboard"
                          ? "page"
                          : undefined
                      }
                    >
                      Dashboard
                    </Link>
                  </div>
                </li>

                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === "/Staff/Doctor"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link
                      href="/Staff/Doctor"
                      aria-current={
                        router.pathname === "/Staff/Doctor" ? "page" : undefined
                      }
                    >
                      Lịch khám bác sĩ
                    </Link>
                  </div>
                </li>
                <li>
                  <div
                    className={`block py-2 pl-3 pr-4 ${
                      router.pathname === ""
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    }`}
                  >
                    <Link href="/CheckAppointment">
                      <a target="_blank" rel="noopener noreferrer">
                        Tra phiếu khám
                      </a>
                    </Link>
                  </div>
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
