import axios from "axios";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../Common/Navigation";

const Patient = () => {
  const router = useRouter();
  const [patients, setPatients] = useState([]);

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
          fetchPatients();
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
  }, []);

  const fetchPatients = async () => {
    try {
      // Fetch all patients from the API
      const response = await axios.get(`${process.env.service}/api/patient`);
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };
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
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Họ và Tên
                </th>
                <th scope="col" className="px-6 py-3">
                  Giới tính
                </th>
                <th scope="col" className="px-6 py-3">
                  Tuổi
                </th>
                <th scope="col" className="px-6 py-3">
                  Số điện thoại
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <a href={`./PatientProfile/${patient._id}`}>
                      {patient.name}
                    </a>
                  </td>
                  <td className="px-6 py-4">{patient.gender}</td>
                  <td className="px-6 py-4">
                    {calculateAge(patient.birthday)}
                  </td>
                  <td className="px-6 py-4">{patient.contactNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patient;
