import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../../Common/Navigation";
const DoctorProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [doctorInfo, setDoctorInfo] = useState("");
  const [patientId, setPatientId] = useState("");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(2);
  const [activeTab, setActiveTab] = useState("profile");
  const [patientInfo, setPatientInfo] = useState({});
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);
        console.log(decoded);

        // Check if the user is a patient
        if (decoded.patient) {
          setPatientId(decoded.patient._id);
          setPatientInfo(decoded.patient);
          // User is a patient, allow access to the patient page
          console.log("Access granted to patient page");
        } else {
          // User is not a patient, redirect to another page or show an error message
          console.log("Access denied. User is not a patient");
          router.push("../Common/Permission");
        }
      } catch (error) {
        // Handle decoding error
        console.error("Failed to decode token:", error);
      }
    } else {
      // Token not found, redirect to login page or show an error message
      router.push("/Patient/LoginPage");

      console.log("Token not found. Please log in.");
    }
    if (id) {
      fetchDoctorInfo(id);
    }
    if (patientId && id) {
      fetchMedicalRecordProvide(id, patientId);
    }
  }, [id, router, patientId]);
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
  const fetchMedicalRecordProvide = async (doctorId, patientId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/medicalRecord/doctor/${doctorId}/patient/${patientId}`
      );
      //   console.log(response.data);
      setMedicalRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // Calculate total number of pages
  const totalPages = Math.ceil(medicalRecords.length / accountsPerPage);

  // Get current accounts based on pagination
  const indexOfLast = currentPage * accountsPerPage;
  const indexOfFirst = indexOfLast - accountsPerPage;
  const currentMedicalRecords = medicalRecords.slice(indexOfFirst, indexOfLast);
  // Update current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const calculateAge = (birthday) => {
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthday).getFullYear();
    const age = currentYear - birthYear;
    return age;
  };
  return (
    <div>
      <Navigation />

      <div className="sm:container center sm:mx-auto">
        <nav
          className="flex px-5 py-3 text-gray-700 mb-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center"></li>
            <li>
              <div className="flex items-center">
                <div className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                  <Link href="/Patient/Doctor">Danh sách bác sĩ</Link>
                </div>
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
                  Bác sĩ {doctorInfo?.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex flex-wrap justify-center ">
          <div className="">
            <div className="sm:container mb-2 sm:mx-auto flex flex-col items-center">
              <div className="w-40 h-62 mb-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="relative inline-block">
                  {doctorInfo.picture ? (
                    <>
                      <img
                        src={doctorInfo.picture}
                        alt="staff"
                        className="rounded-full object-cover w-36 h-auto"
                      />
                    </>
                  ) : (
                    <>
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </>
                  )}
                </div>
                <p className="font-medium text-center ">{doctorInfo?.name}</p>

                <p
                  style={{ wordWrap: "break-word" }}
                  className="text-center mb-2 font-light italic"
                >
                  @{doctorInfo?.username}
                </p>
                <div className="flex items-center justify-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    Bác sĩ
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2 sm:pl-2">
            <div className="max-w-full   p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <p className="font-medium mb-2 text-lg">Hồ sơ cá nhân</p>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Giới tính
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorInfo.gender &&
                        `${
                          doctorInfo.gender.charAt(0).toUpperCase() +
                          doctorInfo.gender.slice(1)
                        }`}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Ngày Sinh
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(doctorInfo?.birthday).toLocaleDateString(
                        "en-GB"
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorInfo?.contactNumber}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Địa chỉ
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorInfo?.address}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorInfo?.email}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
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
                  Bệnh án đã cấp
                </p>
              </li>
            </ul>
          </div>

          {activeTab === "profile" && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center"></div>
                    </th>
                    <th scope="col" className="px-3 py-3">
                      NFT bệnh án
                    </th>
                    <th scope="col" className="px-12 py-5">
                      Bệnh nhân
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ngày tạo
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentMedicalRecords.map((record, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="w-4 p-4"></td>
                      <td className="px-6 p-7">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                          NFT
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        {patientInfo?.picture ? (
                          <div
                            scope="row"
                            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <img
                              className="w-10 h-10 rounded-full"
                              src={patientInfo?.picture || ""}
                              alt="patient"
                            />
                            <div className="pl-3">
                              <div className="text-base font-semibold">
                                {patientInfo?.name}
                              </div>
                              <div className="font-normal text-gray-500">
                                {calculateAge(patientInfo?.birthday)} tuổi
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <svg
                              aria-hidden="true"
                              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-base font-semibold">
                          {new Date(record.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          <Link href="/Patient/MedicalRecord/45">Xem</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav aria-label="Page navigation example">
                <ul className="flex items-center -space-x-px h-10 text-base">
                  <li>
                    <button
                      className={`block px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                        currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      onClick={() => {
                        if (currentPage !== 1) {
                          paginate(currentPage - 1);
                        }
                      }}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 1 1 5l4 4"
                        />
                      </svg>
                    </button>
                  </li>
                  {Array.from(Array(totalPages), (e, i) => {
                    const pageNumber = i + 1;
                    return (
                      <li key={i}>
                        <button
                          className={`${
                            pageNumber === currentPage
                              ? "z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                              : "flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          }`}
                          onClick={() => paginate(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}
                  <li>
                    <button
                      className={`block px-4 h-10 mr-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                        currentPage === totalPages
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      onClick={() => {
                        if (currentPage !== totalPages) {
                          paginate(currentPage + 1);
                        }
                      }}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
