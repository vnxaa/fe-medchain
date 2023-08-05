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
import ChartDataLabels from "chartjs-plugin-datalabels";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Bar, Line, Pie, Radar } from "react-chartjs-2";
import Navigation from "../Common/Navigation";
const Dashboard = () => {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState(null);
  const [bookingRates, setBookingRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mintedRecords, setMintedRecords] = useState([]);
  const [draftRecords, setDraftRecords] = useState([]);
  const [rejectRecords, setRejectRecords] = useState([]);
  const [patientGenderCounts, setPatientGenderCounts] = useState(null);
  const [totalHeartDisease, setTotalHeartDisease] = useState([]);
  const [totalNormal, setTotalNormal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(totalHeartDisease.length);

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

  const fetchPatienGenderData = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/accountRequest/patient/gender-counts`
      );
      // console.log(response.data);
      setPatientGenderCounts(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // Function to fetch booking rates for a specific doctor
  const fetchBookingRateForDoctor = async (doctorId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.service}/api/appointment/booking-rate/${doctorId}`
      );
      setBookingRates(response.data.bookingRates);
    } catch (error) {
      console.error("Error fetching booking rate:", error);
    } finally {
      setLoading(false);
    }
  };
  const getMedicalRecordsByDoctorId = async (doctorId) => {
    try {
      // Make the GET request to the API endpoint
      const response = await axios.get(
        `${process.env.service}/api/medicalRecord/doctor/${doctorId}`
      );

      // Extract the medical records from the response data
      // const medicalRecords = response.data;

      setMintedRecords(response.data.mintedRecords.length);
      setDraftRecords(response.data.draftRecords.length);
      setRejectRecords(response.data.rejectRecords.length);
      // Process the medical records as needed
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error("Error:", error.message);
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
          const doctorId = jwt_decode(token)?.user?._id;
          setDoctorId(doctorId);
        } else {
          // User is not a doctor, redirect to another page or show an error message
          console.log("Access denied. User is not a doctor");
          router.push("../Common/Permission");
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
    fetchPatienGenderData();
    fetchNFTs();
  }, [router]);
  // Calculate the booking rate for a specific doctor
  useEffect(() => {
    if (doctorId) {
      fetchBookingRateForDoctor(doctorId);
      getMedicalRecordsByDoctorId(doctorId);
    }
  }, [doctorId]);

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
  // Create chart data and options
  const data = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
    datasets: [
      {
        borderColor: "#3B82F6",
        borderWidth: 2,
        data: bookingRates,
        pointRadius: 5, // Set the radius for the data points
        pointHoverRadius: 7, // Set the radius when hovering over data points
      },
    ],
  };
  const options = {
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        max: 100,
        ticks: {
          // Add percentage symbol to y-axis ticks
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    // Add datalabels plugin
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        font: {
          weight: "bold",
        },
        formatter: function (value) {
          return value + "%"; // Add percentage symbol to data labels
        },
      },
      legend: {
        display: false, // Hide the legend
      },
    },
    // Show data when hovering over data points
    hover: {
      mode: "nearest",
      intersect: false,
    },

    layout: {
      padding: {
        top: 30, // Add extra padding at the top to accommodate labels above 100
      },
    },
  };

  // Dữ liệu cho biểu đồ cột
  const dataBar = {
    labels: ["Chờ duyệt", "Được duyệt", "Bị từ chối"],
    datasets: [
      {
        backgroundColor: ["#3B82F6", "#34D399", "#EF4444"],
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [draftRecords, mintedRecords, rejectRecords],
      },
    ],
  };
  const optionsDataBar = {
    indexAxis: "y",
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      datalabels: {
        display: true, // Disable the datalabels plugin
      },
    },
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

  const dataRadar = {
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
                    <h5 className="text-lg lg:text-xl flex  font-bold  text-gray-900 dark:text-white">
                      <span className="mr-2">Tỉ lệ đặt khám trong tuần</span>
                      {loading ? (
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

                    <div className="h-[387px] flex items-center justify-center">
                      <Line
                        data={data}
                        options={options}
                        plugins={[ChartDataLabels]}
                      />
                    </div>
                  </div>
                </div>
                <div className=" h-fit col-span-2 ">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê bệnh án
                    </h5>
                    <Bar data={dataBar} options={optionsDataBar} />
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
                      Thống kê bệnh nhân
                    </h5>
                    <div className="h-[350px] flex items-center justify-center">
                      <Radar data={dataRadar} options={optionsRadar} />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="border-2 mt-16 rounded-lg border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-fit flex items-center">
                <Pie data={dataDoughnut} options={optionsDoughnut} />
              </div> */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
