import axios from "axios";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
const AppointmentRequests = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(5);
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);

        // Check if the user is a patient
        if (decoded.user.role == "staff") {
          // User is a patient, allow access to the patient page
          console.log("Access granted to staff page");
        } else {
          router.push("/Staff/LoginPage");
          // User is not a patient, redirect to another page or show an error message
          console.log("Access denied. User is not a staff");
        }
      } catch (error) {
        // Handle decoding error
        console.error("Failed to decode token:", error);
      }
    } else {
      // Token not found, redirect to login page or show an error message
      router.push("/Staff/LoginPage");

      console.log("Token not found. Please log in.");
    }
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/doctor/getAll`
      );
      const data = response.data;
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  // Calculate total number of pages
  const totalPages = Math.ceil(doctors.length / accountsPerPage);

  // Get current accounts based on pagination
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = doctors.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
  // Update current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navigation />
      <div className="sm:container sm:mx-auto">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Địa chỉ ví
                </th>
                <th scope="col" className="px-6 py-3">
                  Họ và tên
                </th>
                {/* <th scope="col" className="px-6 py-3">
                  Trạng thái
                </th> */}
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map((doctor) => (
                <tr
                  key={doctor._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                    <div>
                      <div className="font-normal text-gray-500">
                        {doctor.walletAddress}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {doctor.name || "Tài khoản mới"}
                  </td>

                  <td className="px-6 py-4">
                    <a
                      href={`./Appointment/${doctor._id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Xem lịch khám
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
              {Array.from(Array(totalPages), (e, i) => {
                const pageNumber = i + 1;
                return (
                  <li key={i}>
                    <button
                      className={`block px-3 py-2 leading-tight text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                        pageNumber === currentPage ? "font-bold" : ""
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
                  className="block px-3 py-2 mr-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
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

export default AppointmentRequests;
