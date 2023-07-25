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
import { PolarArea, Radar } from "react-chartjs-2";
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

        // Check if the user is a patient
        if (decoded.patient) {
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
  }, [router]);

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
        data: [110, NaN, NaN, NaN, NaN, NaN, NaN],
      },
      {
        label: "Nhịp thở",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        data: [NaN, 35, NaN, NaN, NaN, NaN, NaN],
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
        data: [NaN, NaN, 120, NaN, NaN, NaN, NaN],
      },
      {
        label: "Huyết áp tâm trương",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        data: [NaN, NaN, NaN, 60, NaN, NaN, NaN],
      },
      {
        label: "Nhiệt độ",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(153, 102, 255, 1)",
        data: [NaN, NaN, NaN, NaN, 37, NaN, NaN],
      },
      {
        label: "Cân nặng",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        pointBackgroundColor: "rgba(255, 159, 64, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 159, 64, 1)",
        data: [NaN, NaN, NaN, NaN, NaN, 7.5, NaN],
      },
      {
        label: "Chiều cao",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        data: [NaN, NaN, NaN, NaN, NaN, NaN, 67],
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
        data: [5, 7], // Replace these numbers with the actual data
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
                    <span className="mr-2">Sức khỏe tổng quát</span>
                  </h5>
                  <div style={{ textAlign: "center" }}>
                    {/* Radar Chart Data and Options */}
                    <Radar data={data} options={options} />
                  </div>
                  <h5 className="text-normal flex  font-bold mb-2 text-gray-900 dark:text-white">
                    <span className="mr-2">
                      Chẩn đoán xác định: Tứ chứng Fallot
                    </span>
                  </h5>
                </div>
              </div>

              {/* Column 2 */}
              <div className="h-fit">
                <div className="max-w h-[500px] p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <h5 className="text-lg lg:text-xl mb-6 flex font-bold mb-2 text-gray-900 dark:text-white">
                    Thống kê chung
                  </h5>
                  <div className="ml-36">
                    <div style={{ width: "500px", height: "400px" }}>
                      <PolarArea
                        data={dataPolarArea}
                        options={optionsPolarArea}
                      />
                    </div>
                  </div>
                </div>

                <div className="max-w h-fit p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-2">
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
                      </tr>
                    </thead>
                    <tbody>
                      {/* {currentAccounts.map((doctor) => (
                          <tr
                            key={doctor._id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <td className="px-6 py-4">
                              {doctor?.picture ? (
                                <div
                                  scope="row"
                                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  <img
                                    className="w-10 h-10 rounded-full"
                                    src={doctor?.picture || ""}
                                    alt="doctor"
                                  />
                                  <div className="pl-3">
                                    <div className="text-base font-semibold">
                                      {doctor?.name}
                                    </div>
                                    <div className="font-normal text-gray-500">
                                      {doctor?.specialization}
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
                                {doctor?.contactNumber}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={`./Appointment/${doctor._id}`}
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                Đặt lịch khám
                              </a>
                            </td>
                          </tr>
                        ))} */}
                    </tbody>
                  </table>
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
