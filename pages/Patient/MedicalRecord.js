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
  const [isLoading, setIsLoading] = useState(false);
  const fetchNFTs = async (address) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/nfts?address=${address}`);
      setNFTs(response.data);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
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
          {isLoading && (
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
