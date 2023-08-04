import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
const PatientList = () => {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${process.env.service}/api/patient/`);
      const data = response.data;

      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
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
      router.push("/Hospital/LoginPage");

      console.log("Token not found. Please log in.");
    }
    fetchPatients();
  }, [router]);
  const filterRecords = (value) => {
    setSearchTerm(value);
  };

  // Filter staff based on search term
  const filteredPatients = patients.filter((patient) => {
    if (patient?.name != null) {
      return patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });
  // Calculate total number of pages
  const totalPages = Math.ceil(patients.length / accountsPerPage);

  // Get current accounts based on pagination
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredPatients.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
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
      <div className="sm:container sm:mx-auto">
        <nav
          className="flex px-5 mb-2 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center"></li>
            <li>
              <div className="flex items-center">
                <div className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                  <Link href="/Hospital/Patient">Bệnh nhân</Link>
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
                  Danh sách bệnh nhân
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex p-4 items-center justify-between py-4 bg-white dark:bg-gray-800">
            <div className="font-medium">Danh sách bệnh nhân</div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Tìm bệnh nhân"
                onChange={(e) => filterRecords(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-12 py-5">
                  Bệnh nhân
                </th>
                <th scope="col" className="px-6 py-5">
                  Giới tính
                </th>
                <th scope="col" className="px-6 py-5 ">
                  Số điện thoại
                </th>
                <th scope="col" className="px-6 py-3">
                  Xem thông tin
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map((patient) => (
                <tr
                  key={patient._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">
                    {patient?.picture ? (
                      <div
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <img
                          className="w-10 h-10 rounded-full"
                          src={patient?.picture || ""}
                          alt="patient"
                        />
                        <div className="pl-3">
                          <div className="text-base font-semibold">
                            {patient?.name}
                          </div>
                          <div className="font-normal text-gray-500">
                            {calculateAge(patient?.birthday)} tuổi
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
                  <td className="px-6 text-gray-900 py-4">
                    {patient.gender.charAt(0).toUpperCase() +
                      patient.gender.slice(1)}
                  </td>
                  <td className="px-6 py-4">
                    {patient.fatherContact && (
                      <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <span>Bố: {patient.fatherContact}</span>
                      </p>
                    )}
                    {patient.motherContact && (
                      <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <span>Mẹ: {patient.motherContact}</span>
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`./PatientProfile/${patient._id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Xem thông tin
                    </a>
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
      </div>
    </div>
  );
};

export default PatientList;
