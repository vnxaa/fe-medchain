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
import React, { useEffect } from "react";
import { Bar, Pie, Radar } from "react-chartjs-2";
import Navigation from "../Common/Navigation";
const Dashboard = () => {
  const router = useRouter();
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
  }, [router]);
  const dataBar = {
    labels: ["Bác sĩ", "Bệnh nhân", "Nhân viên"], // Update the labels to match the data
    datasets: [
      {
        backgroundColor: ["#34D399", "#EF4444", "#F59E0B"], // Remove the color for "Users"
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [50, 100, 80], // Replace these numbers with actual data for "Doctors," "Patients," and "Staff"
      },
    ],
  };
  const optionsDataBar = {
    indexAxis: "y", // Display the bars horizontally
    scales: {
      x: {
        beginAtZero: true,
        max: 200, // Set the maximum value for the x-axis
        ticks: {
          stepSize: 20, // Set the step size for the x-axis
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

  const dataBarRecords = {
    labels: ["Đã phê duyệt", "Đang chờ", "Từ chối"],
    datasets: [
      {
        backgroundColor: ["#34D399", "#F59E0B", "#EF4444"],
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        data: [50, 30, 20], // Replace these numbers with actual data
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
        data: [8, 92], // Điền tỉ lệ mắc tim bẩm sinh và tỉ lệ không mắc vào đây (ví dụ: 8% và 92%)
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
        max: 40,
      },
    },
  };
  const dataRadar = {
    labels: ["0-2", "3-6", "7-10", "11-14"],
    datasets: [
      {
        label: "Nam",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        data: [30, 25, 20, 18],
      },
      {
        label: "Nữ",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        data: [25, 20, 22, 30],
      },
    ],
  };

  const dataRadarDoctor = {
    labels: ["18-25", "26-35", "36-45", "46-55", "56-60"],
    datasets: [
      {
        label: "Male",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        data: [15, 25, 30, 20, 10], // Replace these numbers with actual data for male employees aged 18-60
      },
      {
        label: "Female",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        data: [10, 20, 15, 25, 5], // Replace these numbers with actual data for female employees aged 18-60
      },
    ],
  };

  const dataRadarStaff = {
    labels: ["18-25", "26-35", "36-45", "46-55", "56-60"],
    datasets: [
      {
        label: "Male",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
        data: [12, 22, 28, 18, 8], // Replace these numbers with actual data for male staff members aged 18-60
      },
      {
        label: "Female",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        data: [8, 15, 10, 20, 5], // Replace these numbers with actual data for female staff members aged 18-60
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
                      <Bar data={dataBarRecords} options={optionsDataBar} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
                <div className=" h-fit col-span-2">
                  <div className="max-w h-fit p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê bệnh án
                    </h5>
                    <div style={{ textAlign: "center" }}>
                      <Bar data={dataBarRecords} options={optionsDataBar} />
                    </div>
                  </div>
                </div>
                <div className=" h-fit col-span-2 ">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê yêu cầu cấp tài khoản nhân viên
                    </h5>
                    <div style={{ textAlign: "center" }}>
                      <Bar data={dataBarRecords} options={optionsDataBar} />
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
                    <div className="h-[350px] flex items-center justify-center">
                      <Radar data={dataRadar} options={optionsRadar} />
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
                  <div className="max-w h-fit p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      Thống kê bệnh nhân mắc tim bẩm sinh
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
