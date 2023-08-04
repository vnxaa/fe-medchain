import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Navigation from "../Common/Navigation";
const Dashboard = () => {
  const router = useRouter();
  const [totalPendingInWeek, SetTotalPendingInWeek] = useState([]);
  const [dataBarchart, setDataBarchart] = useState([]);
  Chart.register(
    LinearScale,
    CategoryScale,
    BarElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement
  );
  const getPendingAppointmentsForCurrentWeek = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/appointment/pending/current-week`
      );
      const data = response?.data?.data;
      //   console.log(response?.data?.data);
      SetTotalPendingInWeek(data);
      // Handle the data as needed
    } catch (error) {
      console.error("Error:", error.message);
      // Handle errors
    }
  };
  const getCurrentWeekConfirmedAndCancelledAppointments = async () => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/appointment/confirmed-and-cancelled/current-week`
      );

      if (response.data.success) {
        setDataBarchart(response.data.data);
      } else {
        console.log("Failed to fetch data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);

        // Check if the user is a patient
        if (decoded?.user?.role == "staff") {
          // User is a patient, allow access to the patient page
          console.log("Access granted to staff page");
        } else {
          // User is not a patient, redirect to another page or show an error message
          console.log("Access denied. User is not a staff");
          router.push("../Common/Permission");
        }
      } catch (error) {
        // Handle decoding error
        console.error("Failed to decode token:", error);
      }
    } else {
      // Token not found, redirect to login page or show an error message
      router.push("/Staff/LoginPage");

      console.log("Token not found. Please log in.");
    }
    getPendingAppointmentsForCurrentWeek();
    getCurrentWeekConfirmedAndCancelledAppointments();
  }, [router]);
  const dataBar = {
    labels: ["Đặt thành công", "Đặt thất bại"],
    datasets: [
      {
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
        data: dataBarchart, // Replace with actual data for successful and failed bookings
      },
    ],
  };

  const optionsBar = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Set the step size for the y-axis ticks
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Show the legend to display the label for each dataset
        position: "top", // Adjust the position of the legend (top, bottom, left, right)
      },
      datalabels: {
        display: true, // Show data labels on top of the bars
        color: "#000", // Set the color of the data labels
        font: {
          size: 14, // Set the font size of the data labels
        },
        formatter: (value) => {
          return value; // Customize the data label format if needed
        },
      },
    },
  };

  const options = {
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        // max: 100,

        ticks: {
          // Add percentage symbol to y-axis ticks
          callback: function (value) {
            return value;
          },
          stepSize: 1,
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
          return value; // Add percentage symbol to data labels
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
  const data = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
    datasets: [
      {
        borderColor: "#3B82F6",
        borderWidth: 2,
        data: totalPendingInWeek,
        pointRadius: 5, // Set the radius for the data points
        pointHoverRadius: 7, // Set the radius when hovering over data points
      },
    ],
  };
  return (
    <div>
      <Navigation />
      <div className="sm:container sm:mx-auto">
        <div className=" ">
          {/* Sidebar */}

          <main className="p-2 h-auto pt-4 mt-32">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="grid grid-cols-2 grid-rows-2 ">
                <div className=" h-fit col-span-2">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex  font-bold mb-2 text-gray-900 dark:text-white">
                      <span className="mr-2">
                        Thống kê đặt khám đang chờ phê duyệt trong tuần
                      </span>
                    </h5>

                    <div className="h-[368px] flex items-center justify-center">
                      <Line
                        data={data}
                        options={options}
                        plugins={[ChartDataLabels]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 grid-rows-2">
                <div className=" h-fit col-span-2">
                  <div className="max-w h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="text-lg lg:text-xl flex mt-1 font-bold mb-5 text-gray-900 dark:text-white">
                      Thống kê đặt khám trong tuần
                    </h5>

                    <Bar data={dataBar} options={optionsBar} />
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
