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
import EthCrypto from "eth-crypto";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PolarArea, Radar } from "react-chartjs-2";
import Navigation from "../Common/Navigation";

const Dashboard = () => {
  const router = useRouter();
  const [Totalnfts, setTotalNFTs] = useState(0);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [totalConfirmedAppointments, setTotalConfirmedAppointments] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(2);
  const [medicalRecordsResult, setMedicalRecordsResult] = useState({});
  const [tokenURI, setTokenURI] = useState("");
  //4. Khám toàn thân
  const [mach, setMach] = useState("");
  const [huyetap, setHuyetap] = useState("");
  const [nhietdo, setNhietdo] = useState("");
  const [nhiptho, setNhiptho] = useState("");
  const [cannang, setCannang] = useState("");
  const [chieucao, setChieucao] = useState("");
  const [huyetaptamthu, setHuyetaptamthu] = useState("");
  const [huyetaptamtruong, setHuyetaptamtruong] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fechDauHieuSinhTon = () => {
    const dauHieuSinhTon =
      medicalRecordsResult?.chuyen_mon?.kham_toan_than?.dau_hieu_sinh_ton;

    const dauHieuSinhTonString = JSON.stringify(dauHieuSinhTon);

    const infoArray = dauHieuSinhTonString.split(",");

    infoArray.forEach((info) => {
      const value = (info.split(":")[1] || "")
        .replace(/[^0-9./]/g, "") // Remove non-numeric characters and keep the dot (for decimal values)
        .trim(); // Remove leading and trailing spaces

      if (info.includes("Mạch")) {
        setMach(value.replace("/", ""));
      } else if (info.includes("Huyết áp")) {
        const [tamthu, tamtruong] = value.split("/");
        setHuyetaptamthu(tamthu);
        setHuyetaptamtruong(tamtruong);
      } else if (info.includes("Nhiệt độ")) {
        setNhietdo(value);
      } else if (info.includes("Nhịp thở")) {
        setNhiptho(value.replace("/", ""));
      } else if (info.includes("Cân nặng")) {
        setCannang(value);
      } else if (info.includes("Chiều cao")) {
        setChieucao(value);
      }
    });
  };

  // console.log(
  //   mach,
  //   huyetaptamthu,
  //   huyetaptamtruong,

  //   nhietdo,
  //   nhiptho,
  //   cannang,
  //   chieucao
  // );
  // console.log(tokenURI);
  const fetchData = async () => {
    try {
      // const response = await axios.get(tokenURI);

      const data = JSON.parse(tokenURI);

      // console.log(data);
      const decryptedData = await EthCrypto.decryptWithPrivateKey(
        process.env.PRIVATE_KEY, // privateKey
        data
        // encrypted-data
      );
      setMedicalRecordsResult(JSON.parse(decryptedData));
      // Use the 'data' variable as needed
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNFTs = async (address) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/nfts?address=${address}`);
      const lastItem = response.data[0];
      // console.log(response.data);
      setTokenURI(lastItem?.tokenURI);
      setTotalNFTs(response.data.length);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getConfirmedAppointmentsByPatientId = async (patientId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/appointment/confirmed-appointments/${patientId}`
      );

      const data = response.data;

      const confirmedAppointments = data.data;
      // console.log(confirmedAppointments);
      setConfirmedAppointments(confirmedAppointments);
      const totalConfirmedAppointments = confirmedAppointments.length;
      setTotalConfirmedAppointments(totalConfirmedAppointments);
    } catch (error) {
      console.error("Error fetching confirmed appointments:", error);
      throw error;
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

        // Check if the user is a patient
        if (decoded.patient) {
          fetchNFTs(decoded.patient.walletAddress);
          getConfirmedAppointmentsByPatientId(decoded.patient?._id);
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
    if (tokenURI) {
      fetchData();
    }
    if (medicalRecordsResult?.chuyen_mon?.kham_toan_than?.dau_hieu_sinh_ton) {
      fechDauHieuSinhTon();
    }
  }, [
    router,
    tokenURI,
    medicalRecordsResult?.chuyen_mon?.kham_toan_than?.dau_hieu_sinh_ton,
  ]);

  const data = {
    labels: [
      "Mạch (lần/phút)",
      "Nhịp thở (lần/phút)",
      "Huyết áp tâm thu (mmHg)",
      "Huyết áp tâm trương (mmHg)",
      "Nhiệt độ (°C)",
      "Cân nặng (kg)",
      "Chiều cao (cm)",
    ],
    datasets: [
      {
        label: "Mạch",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        data: [mach, NaN, NaN, NaN, NaN, NaN, NaN],
      },
      {
        label: "Nhịp thở",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        data: [NaN, nhiptho, NaN, NaN, NaN, NaN, NaN],
      },
      // Add more datasets with specific data points
      {
        label: "Huyết áp tâm thu",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        pointBackgroundColor: "rgba(255, 206, 86, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 206, 86, 1)",
        data: [NaN, NaN, huyetaptamthu, NaN, NaN, NaN, NaN],
      },
      {
        label: "Huyết áp tâm trương",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        data: [NaN, NaN, NaN, huyetaptamtruong, NaN, NaN, NaN],
      },
      {
        label: "Nhiệt độ",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(153, 102, 255, 1)",
        data: [NaN, NaN, NaN, NaN, nhietdo, NaN, NaN],
      },
      {
        label: "Cân nặng",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        pointBackgroundColor: "rgba(255, 159, 64, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 159, 64, 1)",
        data: [NaN, NaN, NaN, NaN, NaN, cannang, NaN],
      },
      {
        label: "Chiều cao",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        data: [NaN, NaN, NaN, NaN, NaN, NaN, chieucao],
      },
    ],
  };

  const options = {
    // Customize the options according to your preferences
    scale: {
      ticks: {
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 200, // Adjust this value based on the range of your data
      },
    },
    elements: {
      point: {
        radius: 10, // Set the desired point size in pixels
      },
      line: {
        tension: 0.5, // Adjust the curve tension for the lines connecting points
      },
    },
    fill: true, // Set to true to fill the area under the radar chart
  };

  const dataPolarArea = {
    labels: ["Tổng số bệnh án", "Tổng số lần đặt khám thành công"],
    datasets: [
      {
        data: [Totalnfts, totalConfirmedAppointments], // Replace these numbers with the actual data
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const optionsPolarArea = {
    scale: {
      ticks: {
        beginAtZero: true,
        stepSize: 2,
        max: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };
  // Calculate total number of pages
  const totalPages = Math.ceil(confirmedAppointments.length / accountsPerPage);

  // Get current accounts based on pagination
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentConfirmedAppointments = confirmedAppointments.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
  // Update current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div>
      <Navigation />
      <div className="sm:container sm:mx-auto">
        <div className=" ">
          {/* Sidebar */}
          <main className="p-2 h-auto pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Column 1 */}
              <div className="">
                <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                    <span className="mr-2">Sức khỏe tổng quát </span>
                  </h5>
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
                  <div style={{ textAlign: "center" }}>
                    {/* Radar Chart Data and Options */}
                    <Radar data={data} options={options} />
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="h-fit">
                <div className="max-w h-auto  p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <h5 className="text-lg lg:text-xl mb-2 flex font-bold mb-2 text-gray-900 dark:text-white">
                    Chẩn đoán xác định:{" "}
                    {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh}
                  </h5>
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
                  {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh ===
                    "Tứ chứng Fallot" && (
                    <>
                      <div style={{ width: "auto", height: "700px" }}>
                        <img
                          src="https://i.ibb.co/PWZDj7Q/tu-chung-fallot.jpg"
                          alt="tu-chung-fallot"
                          border={0}
                        />
                      </div>
                    </>
                  )}
                  {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh ===
                    "Thông liên thất" && (
                    <>
                      <div style={{ width: "auto", height: "700px" }}>
                        <img
                          src="https://i.ibb.co/2qQLXVg/thonglienthat.jpg"
                          alt="thonglienthat"
                          border={0}
                        />
                      </div>
                    </>
                  )}
                  {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh ===
                    "Thông liên nhĩ" && (
                    <>
                      <div style={{ width: "auto", height: "700px" }}>
                        <img
                          src="https://i.ibb.co/Bw2MKZv/thong-lien-nhi.jpg"
                          alt="thong-lien-nhi"
                          border={0}
                        />
                      </div>
                    </>
                  )}
                  {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh ===
                    "Còn ống động mạch chủ" && (
                    <>
                      <div style={{ width: "auto", height: "700px" }}>
                        <img
                          src="https://i.ibb.co/dkY5H7h/con-ong-dong-mach.jpg"
                          alt="con-ong-dong-mach"
                          border={0}
                        />
                      </div>
                    </>
                  )}
                  {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh ===
                    "Hẹp eo động mạch chủ" && (
                    <>
                      <div style={{ width: "auto", height: "700px" }}>
                        <img
                          src="https://i.ibb.co/2M4bgSG/hep-eo-dong-mach-chu.jpg"
                          alt="hep-eo-dong-mach-chu"
                          border={0}
                        />
                      </div>
                    </>
                  )}
                  {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh ===
                    "Bất thường van tim" && (
                    <>
                      <div style={{ width: "auto", height: "700px" }}>
                        <img
                          src="https://i.ibb.co/H4TR89V/benh-van-tim.jpg"
                          alt="benh-van-tim"
                          border={0}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Column 1 */}
              <div className="">
                <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <h5 className="text-lg lg:text-xl mb-2 flex font-bold mb-2 text-gray-900 dark:text-white">
                    Thống kê chung
                  </h5>
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
                  <div className="ml-36">
                    <div style={{ width: "500px", height: "380px" }}>
                      <PolarArea
                        data={dataPolarArea}
                        options={optionsPolarArea}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 */}

              <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                <h5 className="text-lg lg:text-xl flex font-bold mb-2 text-gray-900 dark:text-white">
                  Lịch sử đặt khám
                </h5>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-12 py-5">
                        Bác sĩ
                      </th>
                      <th scope="col" className="px-6 py-5">
                        Ngày khám
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Giờ khám
                      </th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentConfirmedAppointments.map((doctor) => (
                      <tr
                        key={doctor?._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4">
                          {doctor?.doctor?.picture ? (
                            <div
                              scope="row"
                              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              <img
                                className="w-10 h-10 rounded-full"
                                src={doctor?.doctor?.picture || ""}
                                alt="doctor"
                              />
                              <div className="pl-3">
                                <div className="text-base font-semibold">
                                  {doctor?.doctor?.name}
                                </div>
                                <div className="font-normal text-gray-500">
                                  {doctor?.doctor?.specialization}
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
                          <p className="font-medium ">
                            {new Date(doctor?.slot?.date).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium ">
                            {new Date(
                              doctor?.slot?.startTime
                            ).toLocaleTimeString()}{" "}
                            -{" "}
                            {new Date(
                              doctor?.slot?.endTime
                            ).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`/AppointmentInformation/${doctor?.code}`}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            Xem
                          </a>
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
                          currentPage === 1
                            ? "cursor-not-allowed opacity-50"
                            : ""
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
