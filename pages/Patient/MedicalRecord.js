import { faCube, faLink } from "@fortawesome/free-solid-svg-icons";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(8);
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

    // fetchNFTs(address);
  }, [router]);
  // Calculate total number of pages

  return (
    <div>
      <Navigation />
      <div className="sm:container sm:mx-auto">
        <div className="relative  overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex p-4 items-center justify-between py-4 bg-white dark:bg-gray-800">
            <div className="font-medium">Lịch sử bệnh án</div>
          </div>

          <div className="m-5 flex">
            {isLoading ? (
              <>
                {" "}
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
                  <span>Đang lấy dữ liệu từ Blockchain, vui lòng chờ!</span>
                </div>
              </>
            ) : (
              <>
                {" "}
                {nfts.map((record, index) => (
                  <div key={index} className="text-blue-400  ">
                    <div className="flex items-center ">
                      <div className=" ml-2 hover:text-blue-500">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`./MedicalRecord/${record.tokenId}`}
                        >
                          <FontAwesomeIcon icon={faCube} size="6x" />
                        </a>
                      </div>
                      {index !== nfts.length - 1 && (
                        <FontAwesomeIcon
                          icon={faLink}
                          size="2x"
                          className="m-2"
                        />
                      )}
                    </div>
                    <div>
                      <p className="m-2 font-semibold text-black  whitespace-nowrap ">
                        Bệnh án thứ {record.tokenId}
                      </p>
                      {/* <p className="ml-2 font-normal text-sm italic text-black">
                            Khối thứ {record.blockNumber}
                          </p> */}
                      <p className="ml-2 whitespace-nowrap  italic text-sm text-black">
                        {new Date(record.timestamp * 1000).toLocaleDateString()}{" "}
                        {new Date(record.timestamp * 1000).toLocaleTimeString()}
                      </p>
                      {/* <p className="ml-2 mt-2 text-black">
                            <a
                              href={`https://sepolia.etherscan.io/tx/${record.transactionHash}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              Chi tiết giao dịch
                            </a>
                          </p> */}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecord;
