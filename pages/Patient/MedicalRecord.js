import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
const MedicalRecord = () => {
  const router = useRouter();
  const [nfts, setNFTs] = useState([]);
  const fetchNFTs = async (address) => {
    try {
      const response = await axios.get(`/api/nfts?address=${address}`);
      setNFTs(response.data);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };
  // console.log(nfts);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);
        console.log(decoded.patient.walletAddress);

        // Check if the user is a patient
        if (decoded.patient) {
          fetchNFTs(decoded.patient.walletAddress);
          // User is a patient, allow access to the patient page
          console.log("Access granted to patient page");
        } else {
          // User is not a patient, redirect to another page or show an error message
          console.log("Access denied. User is not a patient");
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

    // fetchNFTs(address);
  }, [router]);

  return (
    <div>
      <Navigation />
      <div className="sm:container sm:mx-auto">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex items-center justify-between py-4 bg-white dark:bg-gray-800">
            <div></div>
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
                placeholder="Tìm bệnh án"
              />
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center"></div>
                </th>
                <th scope="col" className="px-9 py-3">
                  NFT bệnh án
                </th>
                <th scope="col" className="px-9 py-5">
                  Mã hash
                </th>
                <th scope="col" className="px-6 py-3">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {nfts.map((record, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4"></td>
                  <td className="px-6 py-2">
                    <div className="pl-3">
                      <div className="font-normal text-gray-500">
                        <FontAwesomeIcon
                          icon={faHeartbeat}
                          size="2x"
                          className="mr-2 text-red-500"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className="pl-3">
                      <div className="text-base font-semibold">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${record.transactionHash}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className=" hover:text-blue-500"
                        >
                          {record.transactionHash}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-base font-semibold">
                      {new Date(record.timestamp * 1000).toLocaleDateString()}{" "}
                      {new Date(record.timestamp * 1000).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`./MedicalRecord/${record.tokenId}`}
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
