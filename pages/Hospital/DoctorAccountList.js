import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
const DoctorAccountList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);
  const [accountRequests, setAccountRequests] = useState([]);
  const [loadingaccountRequests, setloadingaccountRequests] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRecordName, setSelectedRecordName] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedRecordPhoneNumber, setSelectedRecordPhoneNumber] =
    useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [generatedPass, setGeneratedPass] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [selectedRecordStatus, setSelectedRecordStatus] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [successRegister, setSuccessRegister] = useState(false);

  const router = useRouter();

  const handleToggleDrawer = (recordName, phoneNumber, status, email, id) => {
    setSelectedRecordName(recordName);
    setSelectedRecordPhoneNumber(phoneNumber);
    setSelectedRecordStatus(status);
    setSelectedEmail(email);
    setSelectedRecordId(id);
    setShowDrawer(!showDrawer);
  };
  async function getAllUsernames() {
    try {
      const response = await axios.get(
        `${process.env.service}/api/auth/usernames/`
      );
      const users = response.data;
      const usernames = users.map((user) => user?.username);
      setUsernames(usernames);

      // Handle the usernames data as needed
    } catch (error) {
      console.error(error);
      // Handle any errors that occurred during the request
    }
  }
  function generateUniqueUsername(fullname, phoneNumber) {
    // Remove whitespace and special characters from fullname
    const cleanedFullname = fullname
      .replace(/\s/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
    // Extract the last 4 digits of the phoneNumber
    const lastDigits = phoneNumber.slice(-4);

    // Concatenate the cleanedFullname and lastDigits to generate the username
    const username = `${cleanedFullname}${lastDigits}`;

    // Check if the generated username is already in use
    if (usernames.includes(username)) {
      let uniqueUsername = username;
      let counter = 1;

      // Append a number to the username until a unique username is found
      while (usernames.includes(uniqueUsername)) {
        uniqueUsername = `${username}${counter}`;
        counter++;
      }

      // Set the unique username
      setGeneratedUsername(uniqueUsername);
    } else {
      // The generated username is available
      setGeneratedUsername(username);
    }
  }
  function generatePassword(length) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  const generateAccount = () => {
    try {
      setLoading(true);
      getAllUsernames();
      generateUniqueUsername(selectedRecordName, selectedRecordPhoneNumber);
      setGeneratedPass(generatePassword(8));
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  const registerUser = async (username, password) => {
    try {
      setLoadingRegister(true);
      const response = await axios.post(
        `${process.env.service}/api/auth/register`,
        {
          username,
          password,
          role: "doctor",
          email: selectedEmail,
          contactNumber: selectedRecordPhoneNumber,
          name: selectedRecordName,
        }
      );

      const data = response.data;
      console.log(data);
      updateAccountRequestStatus(selectedRecordId, "approved");
      // Handle the response data as needed
      setSelectedRecordStatus((prevState) => ({
        ...prevState,
        status: "approved",
      }));
      setSuccessRegister(true);
    } catch (error) {
      console.error(error);
      setSuccessRegister(false);
      // Handle any errors that occurred during the request
    } finally {
      setLoadingRegister(false);
    }
  };
  const updateAccountRequestStatus = async (accountId, status) => {
    try {
      const response = await axios.put(
        `${process.env.service}/api/accountRequest/status/${accountId}`,
        { status }
      );
      console.log("Account request status updated successfully");
      setSelectedRecordStatus((prevState) => ({
        ...prevState,
        status: status,
      }));
      getAccountRequestsByRole();
      // Handle the response data if needed
    } catch (error) {
      console.error(
        "Failed to update account request status:",
        error.response.data
      );
      // Handle the error if needed
    }
  };
  const handleToggleExit = () => {
    setLoading(false);
    setSuccess(false);
    setLoadingRegister(false);
    setSuccessRegister(false);
    setShowDrawer(!showDrawer);
    setGeneratedUsername("");
    setGeneratedPass("");
  };
  const filterRecords = (searchTerm) => {
    setStatusFilter(searchTerm);
  };
  const getAccountRequestsByRole = useCallback(async () => {
    try {
      setloadingaccountRequests(true);
      const response = await axios.get(
        `${process.env.service}/api/accountRequest/role/doctor`
      );
      const allAccountRequests = response.data;
      if (statusFilter.toLowerCase() === "all") {
        setAccountRequests(allAccountRequests);
      } else {
        const accountRequestsFillter = allAccountRequests.filter((record) => {
          const status = record.status.toLowerCase();
          return status.includes(statusFilter.toLowerCase());
        });
        setAccountRequests(accountRequestsFillter);
      }
    } catch (error) {
      console.error(error);
    }
  }, [statusFilter]);
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

    getAccountRequestsByRole();
  }, [router]);
  useEffect(() => {
    getAccountRequestsByRole();
  }, [statusFilter, getAccountRequestsByRole]);

  // Calculate total number of pages
  const totalPages = Math.ceil(accountRequests.length / accountsPerPage);

  // Get current accounts based on pagination
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accountRequests.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  // Update current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                  <Link href="/Hospital/Doctor">Bác sĩ</Link>
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
                  Danh sách yêu cầu cấp tài khoản bác sĩ
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-6 py-3">
                  <div className="relative">
                    <select
                      className="block p-2  text-sm text-gray-900 border border-gray-300 rounded-lg w-30 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={statusFilter}
                      onChange={(e) => filterRecords(e.target.value)}
                    >
                      <option value="all">Tất cả</option>
                      <option value="pending">Đang chờ</option>
                      <option value="approved">Chấp nhận</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Họ và tên
                </th>
                <th scope="col" className="px-6 py-5">
                  Số điện thoại
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map((record, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">
                    {record.status === "approved" && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        Chấp nhận
                      </span>
                    )}
                    {record.status === "rejected" && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                        Từ chối
                      </span>
                    )}
                    {record.status === "pending" && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                        Đang chờ
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-2">{record.fullName}</td>
                  <td className="px-6 py-2">{record.phoneNumber}</td>
                  <td className="px-6 py-4">{record.email}</td>
                  <td className="px-6 py-4">
                    {new Date(record.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleToggleDrawer(
                          record.fullName,
                          record.phoneNumber,
                          record.status,
                          record.email,
                          record._id
                        )
                      }
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Xem
                    </button>
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
      {showDrawer && (
        <div
          style={{ zIndex: 9999 }}
          className="fixed p-4 top-0 right-0 bottom-0 w-96 bg-white shadow-lg dark:bg-gray-800"
        >
          <div>
            <h5 className="inline-flex  items-center mb-6 text-base font-semibold text-gray-500 dark:text-gray-400"></h5>
            <button
              type="button"
              onClick={handleToggleExit}
              data-drawer-hide="drawer-contact"
              aria-controls="drawer-contact"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
            {selectedRecordStatus === "pending" && (
              <>
                <form className="mb-6">
                  <div className="mb-6">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tên tài khoản
                    </label>
                    <input
                      type="username"
                      id="username"
                      value={generatedUsername}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      //   placeholder="name@company.com"
                      disabled
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="subject"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Mật khẩu
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      //   placeholder="Let us know how we can help you"
                      value={generatedPass}
                      required
                      disabled
                    />
                  </div>
                </form>
              </>
            )}
            {selectedRecordStatus === "approved" && (
              <>
                <div
                  className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 inline w-4 h-4 mr-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Đã cấp tài khoản</span>
                  </div>
                </div>
              </>
            )}

            {!success && selectedRecordStatus === "pending" && !loading && (
              <>
                <button
                  type="submit"
                  onClick={generateAccount}
                  className="text-white bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 block"
                >
                  Tự động tạo
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    updateAccountRequestStatus(selectedRecordId, "rejected");
                    setShowDrawer(!showDrawer);
                  }}
                  className="text-white bg-red-700 hover:bg-red-800 w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 block"
                >
                  Từ chối
                </button>
              </>
            )}
            {!loading && selectedRecordStatus === "pending" && success && (
              <>
                <button
                  type="submit"
                  onClick={() => registerUser(generatedUsername, generatedPass)}
                  className="text-white bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 block"
                >
                  Tạo tài khoản
                </button>
              </>
            )}
            {successRegister && !loadingRegister && (
              <>
                {" "}
                <div
                  className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 inline w-4 h-4 mr-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">
                      Tạo tài khoản và gửi đến email thành công
                    </span>
                  </div>
                </div>
              </>
            )}
            {!loading && selectedRecordStatus === "rejected" && (
              <>
                <div
                  className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 inline w-4 h-4 mr-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Đã hủy yêu cầu</span>
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={() => {
                    updateAccountRequestStatus(selectedRecordId, "pending");
                    setShowDrawer(!showDrawer);
                  }}
                  className="text-white bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 block"
                >
                  Mở lại yêu cầu
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAccountList;
