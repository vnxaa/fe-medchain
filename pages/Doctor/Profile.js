import axios from "axios";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [doctorInfo, setDoctorInfo] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);
        console.log(decoded);

        // Check if the user is a doctor
        if (decoded?.user?.role === "doctor") {
          // User is a doctor, allow access to the doctor page
          console.log("Access granted to doctor page");
          const doctorId = jwt_decode(token)?.user?._id;
          fetchDoctorInfo(doctorId);
        } else {
          // User is not a doctor, redirect to another page or show an error message
          console.log("Access denied. User is not a doctor");
        }
      } catch (error) {
        // Handle decoding error
        console.error("Failed to decode token:", error);
      }
    } else {
      // Token not found, redirect to login page or show an error message
      router.push("/Doctor/LoginPage");

      console.log("Token not found. Please log in.");
    }
  }, [router]);

  const fetchDoctorInfo = async (doctorId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/doctor/${doctorId}`
      );

      setDoctorInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="sm:container center sm:mx-auto">
        <div className="max-w-2xl mx-auto overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="p-4 bg-white -lg rounded-2xl w-80 dark:bg-gray-800">
              <div className="flex flex-row items-start gap-4">
                <img
                  src={doctorInfo.picture}
                  alt="Doctor"
                  className="rounded-lg w-28 h-28"
                />
                <div className="flex flex-col justify-between w-full h-28">
                  <div>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">
                      {doctorInfo.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {doctorInfo.walletAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Chuyên khoa
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {doctorInfo.specialization}
                </dd>
              </div>
              <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {(doctorInfo.gender &&
                    `${
                      doctorInfo.gender.charAt(0).toUpperCase() +
                      doctorInfo.gender.slice(1)
                    }`) ||
                    "Chưa cập nhật"}
                </dd>
              </div>
              <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Ngày Sinh</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {(doctorInfo.birthday &&
                    new Date(doctorInfo.birthday).toLocaleDateString(
                      "en-GB"
                    )) ||
                    "Chưa cập nhật"}
                </dd>
              </div>
              <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {(doctorInfo.contactNumber && doctorInfo.contactNumber) ||
                    "Chưa cập nhật"}
                </dd>
              </div>
              <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {(doctorInfo.address && doctorInfo.address) ||
                    "Chưa cập nhật"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* <div
          className="mx-auto overflow-hidden bg-white shadow sm:rounded-lg"
          style={{ marginTop: "10px" }}
        >
          <div className="flex">
            <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
              <li
                className={`w-full ${activeTab === "profile" && "bg-gray-100"}`}
              >
                <a
                  href="#"
                  className="inline-block w-full p-4 text-gray-900 bg-gray-100 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={activeTab === "profile" ? "page" : undefined}
                  onClick={() => handleTabClick("profile")}
                >
                  Profile
                </a>
              </li>
              <li
                className={`w-full ${
                  activeTab === "dashboard" && "bg-gray-100"
                }`}
              >
                <a
                  href="#"
                  className="inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                  onClick={() => handleTabClick("dashboard")}
                >
                  Dashboard
                </a>
              </li>
              <li
                className={`w-full ${
                  activeTab === "settings" && "bg-gray-100"
                }`}
              >
                <a
                  href="#"
                  className="inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                  onClick={() => handleTabClick("settings")}
                >
                  Settings
                </a>
              </li>
              <li
                className={`w-full ${activeTab === "invoice" && "bg-gray-100"}`}
              >
                <a
                  href="#"
                  className="inline-block w-full p-4 bg-white rounded-r-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                  onClick={() => handleTabClick("invoice")}
                >
                  Invoice
                </a>
              </li>
            </ul>
          </div>

          {activeTab === "profile" && (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Product name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Color
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td className="px-6 py-4">Silver</td>
                    <td className="px-6 py-4">Laptop</td>
                    <td className="px-6 py-4">$2999</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Microsoft Surface Pro
                    </th>
                    <td className="px-6 py-4">White</td>
                    <td className="px-6 py-4">Laptop PC</td>
                    <td className="px-6 py-4">$1999</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Magic Mouse 2
                    </th>
                    <td className="px-6 py-4">Black</td>
                    <td className="px-6 py-4">Accessories</td>
                    <td className="px-6 py-4">$99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
