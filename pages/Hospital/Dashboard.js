import axios from "axios";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Bar, Pie, Radar } from "react-chartjs-2";
import Navigation from "../Common/Navigation";
const Dashboard = () => {
  const router = useRouter();
  const [mintedRecords, setMintedRecords] = useState([]);
  const [draftRecords, setDraftRecords] = useState([]);
  const [rejectRecords, setRejectRecords] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);

  const [doctorPendingCount, setDoctorPendingCount] = useState(0);
  const [doctorApprovedCount, setDoctorApprovedCount] = useState(0);
  const [doctorRejectedCount, setDoctorRejectedCount] = useState(0);

  const [staffPendingCount, setStaffPendingCount] = useState(0);
  const [staffApprovedCount, setStaffApprovedCount] = useState(0);
  const [staffRejectedCount, setStaffRejectedCount] = useState(0);
  const [patientGenderCounts, setPatientGenderCounts] = useState(null);
  const [doctorGenderCounts, setDoctorGenderCounts] = useState(null);
  const [staffGenderCounts, setStaffGenderCounts] = useState(null);
  const [totalHeartDisease, setTotalHeartDisease] = useState([]);
  const [totalNormal, setTotalNormal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async (tokenURI) => {
    try {
      const response = await axios.get(tokenURI);
      const data = response.data?.chuyen_mon?.chan_doan_xac_dinh;
      console.log(data);
      // data.map((item) => console.log(item));
      if (data !== undefined && data !== "" && data !== "Bình thường") {
        setTotalHeartDisease((prevData) => [...prevData, data]);
      }
      if (data === "Bình thường") {
        setTotalNormal((prevData) => [...prevData, data]);
      }
    } catch (error) {
      // Handle the error gracefully (you can customize the error handling here)
      console.error(`Error fetching data for tokenURI: ${tokenURI}`, error);
    }
  };

  const fetchNFTs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/getAllNFTs`);
      const nftsData = response.data;
      console.log(nftsData);
      const tokenURIs = nftsData.map((nft) => nft.tokenURI);

      // Use a Set to keep track of processed tokenURIs and avoid duplicates
      const processedTokenURIs = new Set();

      // Fetch medical records for each 'tokenURI'
      for (const tokenURI of tokenURIs) {
        // Check if the tokenURI has already been processed
        if (!processedTokenURIs.has(tokenURI)) {
          // Add the tokenURI to the set before fetching the data to mark it as processed
          processedTokenURIs.add(tokenURI);

          // Fetch data for the tokenURI and add it to medicalRecordsResult
          await fetchData(tokenURI);
        }
      }

      // For debugging purposes, you can log the tokenURIs array
      console.log(tokenURIs);

      // Additional logic can be added here if needed
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchGenderCounts = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/accountRequest/staff/gender-counts`
      );

      // Update the state with the data received from the API
      setStaffGenderCounts(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const getDoctorGenderCounts = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/accountRequest/doctor/gender-counts`
      );
      setDoctorGenderCounts(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const fetchPatienGenderData = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/accountRequest/patient/gender-counts`
      );
      console.log(response.data);
      setPatientGenderCounts(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getStaffAccountRequestStatistics = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/accountRequest/total/staff-account`
      );

      const { pendingCount, approvedCount, rejectedCount } = response.data;
      setStaffPendingCount(pendingCount);
      setStaffApprovedCount(approvedCount);
      setStaffRejectedCount(rejectedCount);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const getDoctorAccountRequestStatistics = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/accountRequest/total/doctor-account`
      );

      const { pendingCount, approvedCount, rejectedCount } = response.data;
      setDoctorPendingCount(pendingCount);
      setDoctorApprovedCount(approvedCount);
      setDoctorRejectedCount(rejectedCount);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const getTotalUserCounts = async () => {
    try {
      // Make the GET request to the API endpoint
      const response = await axios.get(
        `${process.env.service}/api/accountRequest/total/user`
      );

      // Handle the response data
      const { staffCount, patientCount, doctorCount } = response.data;

      setStaffCount(staffCount);
      setPatientCount(patientCount);
      setDoctorCount(doctorCount);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const getMedicalRecordStatistics = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/medicalRecord/hospital/statistics`
      );

      setMintedRecords(response.data.mintedRecords.length);
      setDraftRecords(response.data.draftRecords.length);
      setRejectRecords(response.data.rejectRecords.length);
    } catch (error) {
      console.error(error);
    }
  };
  Chart.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    RadialLinearScale,
    Filler
  );
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
      // router.push("/Hospital/LoginPage");

      console.log("Token not found. Please log in.");
    }
    getMedicalRecordStatistics();
    getTotalUserCounts();
    getDoctorAccountRequestStatistics();
    getStaffAccountRequestStatistics();
    fetchPatienGenderData();
    getDoctorGenderCounts();
    fetchGenderCounts();
    fetchNFTs();
  }, [router]);
  const dataBar = {
    labels: ["Bác sĩ", "Bệnh nhân", "Nhân viên"], // Update the labels to match the data
    datasets: [
      {
        backgroundColor: ["#34D399", "#EF4444", "#F59E0B"], // Remove the color for "Users"
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [doctorCount, patientCount, staffCount], // Replace these numbers with actual data for "Doctors," "Patients," and "Staff"
      },
    ],
  };
  const optionsDataBar = {
    indexAxis: "y", // Display the bars horizontally
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Set the step size for the x-axis
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      datalabels: {
        anchor: "end",
        align: "top",
        font: {
          weight: "bold",
        },
        formatter: function (value) {
          return value; // Display the data value on top of each bar
        },
      },
    },
    responsive: true, // Enable responsiveness
  };

  const dataBarMedicalRecords = {
    labels: ["Đã duyệt", "Chờ duyệt", "Từ chối"],
    datasets: [
      {
        backgroundColor: ["#34D399", "#F59E0B", "#EF4444"],
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        data: [mintedRecords, draftRecords, rejectRecords], // Replace these numbers with actual data
      },
    ],
  };
  const dataBarDoctorAccount = {
    labels: ["Đã duyệt", "Chờ duyệt", "Từ chối"],
    datasets: [
      {
        backgroundColor: ["#34D399", "#F59E0B", "#EF4444"],
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        data: [doctorApprovedCount, doctorPendingCount, doctorRejectedCount], // Replace these numbers with actual data
      },
    ],
  };
  const dataBarStaffAccount = {
    labels: ["Đã duyệt", "Chờ duyệt", "Từ chối"],
    datasets: [
      {
        backgroundColor: ["#34D399", "#F59E0B", "#EF4444"],
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        data: [staffApprovedCount, staffPendingCount, staffRejectedCount], // Replace these numbers with actual data
      },
    ],
  };
  const dataDoughnut = {
    labels: [
      "Số bệnh nhân mắc tim bẩm sinh",
      "Số bệnh nhân không mắc tim bẩm sinh",
    ],
    datasets: [
      {
        backgroundColor: ["#3B82F6", "#E5E7EB"],
        borderWidth: 1,
        data: [totalHeartDisease.length, totalNormal.length], // Điền tỉ lệ mắc tim bẩm sinh và tỉ lệ không mắc vào đây (ví dụ: 8% và 92%)
      },
    ],
  };

  const optionsDoughnut = {
    plugins: {
      legend: {
        display: true, // Hide the legend
      },
      datalabels: {
        display: true, // Disable the datalabels plugin
      },
    },
    radius: "90%",
  };

  const optionsRadar = {
    scale: {
      ticks: {
        beginAtZero: true,
        stepSize: 10,
        precision: 0,
      },
    },
    elements: {
      point: {
        radius: 5, // Set the desired point size in pixels
      },
      line: {
        tension: 0.5, // Adjust the curve tension for the lines connecting points
      },
    },
  };
  const dataRadarPatient = {
    labels: ["0-2 tuổi", "3-6 tuổi", "7-10 tuổi", "11-14 tuổi"],
    datasets: [
      {
        label: "Nam",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        data: patientGenderCounts?.male,
      },
      {
        label: "Nữ",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        data: patientGenderCounts?.female,
      },
    ],
  };

  const dataRadarDoctor = {
    labels: [
      "18-25 tuổi",
      "26-35 tuổi",
      "36-45 tuổi",
      "46-55 tuổi",
      "56-60 tuổi",
    ],
    datasets: [
      {
        label: "Nam",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        data: doctorGenderCounts?.male, // Replace these numbers with actual data for male employees aged 18-60
      },
      {
        label: "Nữ",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        data: doctorGenderCounts?.female, // Replace these numbers with actual data for female employees aged 18-60
      },
    ],
  };

  const dataRadarStaff = {
    labels: [
      "18-25 tuổi",
      "26-35 tuổi",
      "36-45 tuổi",
      "46-55 tuổi",
      "56-60 tuổi",
    ],
    datasets: [
      {
        label: "Nam",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        data: staffGenderCounts?.male, // Replace these numbers with actual data for male staff members aged 18-60
      },
      {
        label: "Nữ",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        data: staffGenderCounts?.female, // Replace these numbers with actual data for female staff members aged 18-60
      },
    ],
  };

  return (
    <div>
      <Navigation />
      <div className="sm:container sm:mx-auto">
        <div className=" ">
          {/* Sidebar */}

          <main className="p-2 h-auto pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
                <div className="h-fit col-span-2">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      <span className="mr-2">Thống kê số lượng người dùng</span>
                    </h5>

                    <div style={{ textAlign: "center" }}>
                      <Bar data={dataBar} options={optionsDataBar} />
                    </div>
                  </div>
                </div>
                <div className=" h-fit col-span-2 ">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê yêu cầu cấp tài khoản bác sĩ
                    </h5>
                    <div style={{ textAlign: "center" }}>
                      <Bar
                        data={dataBarDoctorAccount}
                        options={optionsDataBar}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
                <div className=" h-fit col-span-2">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê bệnh án
                    </h5>

                    <div style={{ textAlign: "center" }}>
                      <Bar
                        data={dataBarMedicalRecords}
                        options={optionsDataBar}
                      />
                    </div>
                  </div>
                </div>
                <div className=" h-fit col-span-2 ">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê yêu cầu cấp tài khoản nhân viên
                    </h5>
                    <div style={{ textAlign: "center" }}>
                      <Bar
                        data={dataBarStaffAccount}
                        options={optionsDataBar}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
                <div className="h-fit col-span-2">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      <span className="mr-2">Thống kê bệnh nhân</span>
                    </h5>
                    <div className="h-[379px] flex items-center justify-center">
                      <Radar data={dataRadarPatient} options={optionsRadar} />
                    </div>
                  </div>
                </div>
                <div className=" h-fit col-span-2 ">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê bác sĩ
                    </h5>
                    <div className="h-[350px] flex items-center justify-center">
                      <Radar data={dataRadarDoctor} options={optionsRadar} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
                <div className=" h-fit col-span-2">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      <span className="mr-2">
                        Thống kê bệnh nhân mắc tim bẩm sinh
                      </span>
                      {isLoading ? (
                        <>
                          {" "}
                          <div>
                            <svg
                              aria-hidden="true"
                              className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                      ) : (
                        <></>
                      )}
                    </h5>
                    <div className="h-[380px] flex items-center justify-center">
                      <Pie data={dataDoughnut} options={optionsDoughnut} />
                    </div>
                  </div>
                </div>
                <div className=" h-fit col-span-2 ">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê nhân viên
                    </h5>
                    <div className="h-[350px] flex items-center justify-center">
                      <Radar data={dataRadarStaff} options={optionsRadar} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
