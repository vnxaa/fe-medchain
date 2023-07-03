import axios from "axios";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
const MedicalRecord = () => {
  const router = useRouter();
  const [patientInfo, setPatientInfo] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchMedicalRecords = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/medicalRecord`
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
  }, [statusFilter]);
  // console.log(medicalRecords);
  // console.log(patientInfo);
  // console.log(doctorInfo);

  const filterRecords = (searchTerm) => {
    setStatusFilter(searchTerm);
  };
  useEffect(() => {
    fetchMedicalRecords();
  }, [statusFilter, fetchMedicalRecords]);
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
    fetchMedicalRecords();
  }, [router]);

  useEffect(() => {
    if (medicalRecords.length > 0) {
      const patientIds = medicalRecords.map((record) => record.patientId);
      const doctorIds = medicalRecords.map((record) => record.doctorId);

      const fetchPatientInfo = async (id) => {
        try {
          const response = await axios.get(
            `${process.env.service}/api/patient/${id}`
          );
          const patientData = response.data;
          setPatientInfo((prevInfo) => ({
            ...prevInfo,
            [id]: patientData,
          }));
        } catch (error) {
          console.error(
            `Failed to fetch patient information for ID ${id}:`,
            error
          );
        }
      };

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

      patientIds.forEach((patientId) => {
        fetchPatientInfo(patientId);
      });

      doctorIds.forEach((doctorIds) => {
        fetchDoctorInfo(doctorIds);
      });
    }
  }, [medicalRecords]);
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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex items-center justify-between py-4 bg-white dark:bg-gray-800">
            <div></div>
            {/* <label htmlFor="table-search" className="sr-only">
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
                placeholder="Tìm bệnh án"
                onChange={(e) => filterRecords(e.target.value)}
              />
            </div> */}
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
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center"></div>
                </th>
                <th scope="col" className="px-12 py-3">
                  Bệnh nhân
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
                    <div
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src={patientInfo[record.patientId]?.picture || ""}
                        alt="doctor"
                      />
                      <div className="pl-3">
                        <div className="text-base font-semibold">
                          {patientInfo[record.patientId]?.name}
                        </div>
                        <div className="font-normal text-gray-500">
                          {calculateAge(
                            patientInfo[record.patientId]?.birthday
                          )}{" "}
                          tuổi
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">
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
                      href={`./MedicalRecord/${record._id}`}
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
      </div>
    </div>
  );
};

export default MedicalRecord;
