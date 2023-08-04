import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navigation from "../Common/Navigation";
const Staff = () => {
  const router = useRouter();
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);
        console.log(decoded);

        // Check if the user is a hospital
        if (decoded.hospital) {
          // User is a hospital, allow access to the hospital page
          console.log("Access granted to hospital page");
        } else {
          // User is not a hospital, redirect to another page or show an error message
          console.log("Access denied. User is not a hospital");
          router.push("../Common/Permission");
        }
      } catch (error) {
        // Handle decoding error
        console.error("Failed to decode token:", error);
      }
    } else {
      // Token not found, redirect to login page or show an error message
      // router.push("/Hospital/LoginPage");

      console.log("Token not found. Please log in.");
    }
  }, []);

  return (
    <div>
      <Navigation />
      <div className="sm:container sm:mx-auto" style={{ maxWidth: "900px" }}>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto flex flex-wrap">
            <div className="flex flex-wrap -m-4">
              <div className="p-4 lg:w-1/2 md:w-full">
                <div className="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col">
                  <div className="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-12 h-12"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                      Quản lý tài khoản nhân viên
                    </h2>
                    <p className="leading-relaxed text-base">
                      Cho phép tài khoản nhân viên đăng nhập vào hệ thống.
                    </p>
                    <a
                      href="./StaffAccountList"
                      className="mt-3 text-indigo-500 inline-flex items-center"
                    >
                      Quản lý
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4 lg:w-1/2 md:w-full">
                <div className="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col">
                  <div className="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                      Tra cứu thông tin nhân viên
                    </h2>
                    <p className="leading-relaxed text-base">
                      Tra cứu thông tin cá nhân của nhân viên trong hệ thống.
                    </p>
                    <a
                      href="./StaffList"
                      className="mt-3 text-indigo-500 inline-flex items-center"
                    >
                      Tra cứu
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Staff;
