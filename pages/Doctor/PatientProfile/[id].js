import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../../Common/Navigation";
const PatientProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [patientInfo, setPatientInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchPatientInfo = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/patient/${id}`
      );
      setPatientInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch patient information:", error);
    }
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
        if (decoded.doctor) {
          // User is a doctor, allow access to the doctor page
          console.log("Access granted to doctor page");
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
    if (id) {
      fetchPatientInfo(id);
    }
  }, [id, router]);
  if (!patientInfo) {
    return <div>Loading...</div>; // Display a loading state while fetching data
  }
  return (
    <div>
      <Navigation />

      <div className="sm:container center sm:mx-auto">
        <nav
          className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center"></li>
            <li>
              <div className="flex items-center">
                <Link
                  href="/Doctor/Patient"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  Danh sách bệnh nhân
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  {patientInfo.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="max-w-2xl mx-auto overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="p-4 bg-white -lg rounded-2xl w-80 dark:bg-gray-800">
              <div className="flex flex-row items-start gap-4">
                <img
                  src={patientInfo.picture}
                  alt="Patient"
                  className="rounded-lg w-28 h-28"
                />
                <div className="flex flex-col justify-between w-full h-28">
                  <div>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">
                      {patientInfo.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {patientInfo.walletAddress}
                    </p>
                    <a
                      href={`/Doctor/MedicalRecord/${id}`}
                      type="button"
                      style={{ marginTop: "25px" }}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Tạo bệnh án
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patientInfo.gender &&
                    `${
                      patientInfo.gender.charAt(0).toUpperCase() +
                      patientInfo.gender.slice(1)
                    }`}
                </dd>
              </div>
              <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Ngày Sinh</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(patientInfo.birthday).toLocaleDateString("en-GB")}
                </dd>
              </div>
              <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patientInfo.contactNumber}
                </dd>
              </div>
              <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patientInfo.address}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div
          className="mx-auto overflow-hidden bg-white shadow sm:rounded-lg"
          style={{ marginTop: "10px" }}
        >
          <div className="flex">
            <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
              <li
                className={`w-full ${activeTab === "profile" && "bg-gray-100"}`}
              >
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900 bg-gray-100 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={activeTab === "profile" ? "page" : undefined}
                  onClick={() => handleTabClick("profile")}
                >
                  Bệnh án
                </p>
              </li>
            </ul>
          </div>

          {activeTab === "profile" && (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Tên bệnh án
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ngày nhập viện
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ngày xuất viện
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ngày tạo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Kha_Ngan_NFT_Medical_Record_20230414
                    </th>
                    <td className="px-6 py-4">20/3/2023</td>
                    <td className="px-6 py-4">1/4/2023</td>
                    <td className="px-6 py-4">3/4/2023</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
