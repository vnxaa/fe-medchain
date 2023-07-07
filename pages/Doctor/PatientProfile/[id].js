import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Navigation from "../../Common/Navigation";
const PatientProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [patientInfo, setPatientInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [doctorInfo, setDoctorInfo] = useState([]);

  const filterRecords = (searchTerm) => {
    setStatusFilter(searchTerm);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const fetchMedicalRecordsByPatientId = useCallback(
    async (patientId) => {
      try {
        const response = await axios.get(
          `${process.env.service}/api/medicalRecord/patient/${patientId}`
        );
        const allRecords = response.data;
        if (statusFilter.toLowerCase() === "all") {
          setMedicalRecords(allRecords);
        } else {
          const filteredRecords = allRecords.filter((record) => {
            const status = record.status.toLowerCase();
            return status.includes(statusFilter.toLowerCase());
          });

          setMedicalRecords(filteredRecords);
        }
      } catch (error) {
        console.error("Failed to fetch medical records:", error);
      }
    },
    [statusFilter]
  );
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
        if (decoded?.user?.role === "doctor") {
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
      fetchMedicalRecordsByPatientId(id);
    }
  }, [id, router]);
  useEffect(() => {
    fetchMedicalRecordsByPatientId(id);
  }, [statusFilter, fetchMedicalRecordsByPatientId]);
  useEffect(() => {
    if (medicalRecords.length > 0) {
      const doctorIds = medicalRecords.map((record) => record.doctorId);

      const fetchDoctorInfo = async (doctorId) => {
        try {
          const response = await axios.get(
            `${process.env.service}/api/doctor/${doctorId}`
          );
          const doctorData = response.data;
          setDoctorInfo((prevInfo) => ({
            ...prevInfo,
            [doctorId]: doctorData,
          }));
        } catch (error) {
          console.error(
            `Failed to fetch doctor information for ID ${doctorId}:`,
            error
          );
        }
      };

      doctorIds.forEach((doctorIds) => {
        fetchDoctorInfo(doctorIds);
      });
    }
  }, [medicalRecords]);
  if (!patientInfo) {
    return (
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
    );
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
                <div className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                  <Link href="/Doctor/Patient">Danh sách bệnh nhân</Link>
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
                {patientInfo.picture ? (
                  <img
                    src={patientInfo.picture}
                    alt="Patient"
                    className="rounded-lg w-28 h-28"
                  />
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

                <div className="flex flex-col justify-between w-full h-28">
                  <div>
                    <p className="text-xl font-medium text-gray-800 dark:text-white">
                      {patientInfo.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {patientInfo.walletAddress}
                    </p>
                    <a
                      href={`/Doctor/CreateMedicalRecord/${id}`}
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
                  {patientInfo.fatherContact && (
                    <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span>Bố: {patientInfo.fatherContact}</span>
                    </p>
                  )}
                  {patientInfo.motherContact && (
                    <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span>Mẹ: {patientInfo.motherContact}</span>
                    </p>
                  )}
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
              <li>
                <div className="relative">
                  <select
                    className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-40 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    // value={statusFilter}
                    onChange={(e) => filterRecords(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="minted">Minted</option>
                    <option value="draft">Draft</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>
              </li>
            </ul>
          </div>

          {activeTab === "profile" && (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center"></div>
                    </th>

                    <th scope="col" className="px-12 py-5">
                      Bác sĩ
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ngày tạo
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map((record, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="w-4 p-4"></td>

                      <td className="px-6 py-2">
                        {doctorInfo[record.doctorId]?.picture ? (
                          <div
                            scope="row"
                            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <img
                              className="w-10 h-10 rounded-full"
                              src={doctorInfo[record.doctorId]?.picture || ""}
                              alt="doctor"
                            />
                            <div className="pl-3">
                              <div className="text-base font-semibold">
                                {doctorInfo[record.doctorId]?.name}
                              </div>
                              <div className="font-normal text-gray-500">
                                {doctorInfo[record.doctorId]?.specialization}
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
                        {new Date(record.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`/Doctor/MedicalRecord/${record._id}`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Xem
                        </a>
                      </td>
                    </tr>
                  ))}
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
