import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Barcode from "react-jsbarcode";
export default function CheckAppointment() {
  const router = useRouter();

  const [appointment, setAppointment] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [patientInfo, setPatientInfo] = useState({});
  const [doctorInfo, setDoctorInfo] = useState({});
  const [error, setError] = useState(null);
  const { code } = router.query;
  const [loading, setLoading] = useState(false);
  const fetchPatientInfo = async (patientId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/patient/${patientId}`
      );
      setPatientInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDoctorInfo = async (doctorId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/doctor/${doctorId}`
      );

      setDoctorInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Check if there is an "code" query parameter in the URL

    if (code) {
      // If "code" exists in the URL, automatically perform the search
      fetchAppointmentData(code);
    }
  }, [router, code]);
  useEffect(() => {
    // Check if there is an "code" query parameter in the URL

    if ((doctorId, patientId)) {
      // If "code" exists in the URL, automatically perform the search
      fetchDoctorInfo(doctorId);
      fetchPatientInfo(patientId);
    }
  }, [doctorId, patientId]);

  const fetchAppointmentData = async (code) => {
    try {
      setLoading(true);
      // Fetch appointment data based on the "code" from your backend API
      const response = await axios.get(
        `${process.env.service}/api/appointment/code/${code}`
      );

      setAppointment(response.data.appointment);
      setDoctorId(response.data.appointment?.doctor);
      setPatientId(response.data.appointment?.patient);
    } catch (error) {
      setError(true);
      console.error("Error fetching appointment data:", error);
    } finally {
      setLoading(false);
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
      <nav className="bg-white dark:bg-gray-900  w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center">
            <div className="h-8 mr-1">
              <div className="">
                <div className="font-normal text-gray-500">
                  <FontAwesomeIcon
                    icon={faHeartbeat}
                    size="2x"
                    className="mr-2 text-blue-500"
                  />
                </div>
              </div>
            </div>
            <span className="self-center  text-2xl font-bold whitespace-nowrap dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-bl  from-purple-600 to-blue-500 hover:bg-gradient-to-bl">
                Medchain
              </span>
            </span>
          </a>
          <div className="flex md:order-2"></div>
          <div
            className="items-center justify-between hcodeden w-full md:flex md:w-auto md:order-1"
            code="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <div
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  <Link href="/">Trang chủ</Link>
                </div>
              </li>
              <li>
                <div className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  <Link href="/Instruct">Hướng dẫn</Link>
                </div>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Đặt lịch khám
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Bệnh viện
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
      <div className="sm:container sm:mx-auto">
        <div className="mb-2 p-6 bg-white  font-medium h-fit border border-gray-200 rounded-lg shadow mt-2">
          <nav
            className="flex px-5 mb-2 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center"></li>
              <li>
                <div className="flex items-center">
                  <div className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                    <Link href="/CheckAppointment">Tra phiếu khám</Link>
                  </div>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                    Thông tin phiếu khám
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          {loading ? (
            <>
              <div>
                <svg
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
            <>
              {error || appointment?.status !== "confirmed" ? (
                <>
                  <div className=" flex  items-center justify-center">
                    <div className="relative  w-full max-w-md max-h-full">
                      <div className="relative bg-white rounded-lg  dark:bg-gray-700">
                        <div className="p-6 text-center">
                          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Mã phiếu khám không hợp lệ
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className=" flex  items-center justify-center">
                    <div className="w-40 h-62 mb-2 mr-6 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                      {/* Patient Information */}
                      <div className="relative inline-block">
                        {patientInfo.picture ? (
                          <>
                            <img
                              src={patientInfo.picture}
                              alt="staff"
                              className="rounded-full object-cover w-36 h-auto"
                            />
                          </>
                        ) : (
                          <>
                            <div role="status">
                              <svg
                                className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                {/* SVG path here */}
                              </svg>
                              <span className="sr-only">Loading...</span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="font-medium text-center ">
                        {patientInfo?.name}
                      </p>
                      <p className="text-center mb-2 font-normal italic">
                        {calculateAge(patientInfo?.birthday)} tuổi
                      </p>
                      <div className="flex items-center justify-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                          Bệnh nhân
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start justify-center border-b rounded-t dark:border-gray-600">
                      <a
                        // href="#"
                        className="block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-start justify-center border-b rounded-t dark:border-gray-600">
                          <h5 className="mb-2 text-xl uppercase font-bold tracking-tight text-gray-900 dark:text-white">
                            Phiếu khám bệnh
                          </h5>
                        </div>
                        <div className="flex justify-center ">
                          <span className="font-medium text-lg mt-2">
                            Bệnh Viện Phụ Sản - Nhi Đà Nẵng
                          </span>
                        </div>
                        <div className="flex justify-center ">
                          <span className="font-normal text-sm mb-2">
                            402 Lê Văn Hiến, Quận Ngũ Hành Sơn, Thành phố Đà
                            Nẵng
                          </span>
                        </div>
                        <div className="flex justify-center">
                          <span className="font-medium text-lg ">
                            Mã phiếu khám
                          </span>
                        </div>
                        <div className="flex justify-center mt-2">
                          <Barcode
                            value={appointment?.code}
                            options={{ format: "code128", displayValue: false }}
                          />
                        </div>
                        <div className="flex justify-center ">
                          <span className=" border border-blue-400 bg-blue-100 text-blue-800  mb-2 text-base font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-blue-400">
                            Đã xác nhận
                          </span>
                        </div>
                        <hr className="w-48 h-1 mx-auto bg-gray-200 border-0 rounded mt-2  dark:bg-gray-700" />
                        <div className="flex justify-center ">
                          <span className="font-medium text-lg mt-2">
                            Giờ khám
                          </span>
                        </div>
                        <div className="flex justify-center ">
                          <span className="font-medium text-blue-700 text-lg mb-2">
                            {new Date(
                              appointment?.slot?.startTime
                            ).toLocaleTimeString()}{" "}
                            -{" "}
                            {new Date(
                              appointment?.slot?.endTime
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <p className="font-normal text-gray-700 dark:text-gray-400">
                            Dịch vụ:
                          </p>
                          <p>Khám tim bẩm sinh</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="font-normal text-gray-700 dark:text-gray-400">
                            Ngày khám:
                          </p>
                          <p>
                            {" "}
                            {new Date(
                              appointment?.slot?.date
                            ).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                        {/* <div className="flex justify-between">
                          <p className="font-normal text-gray-700 dark:text-gray-400">
                            Mã phiếu khám:
                          </p>
                          <p>{appointmentsPatient[0]?._code}</p>
                        </div> */}
                      </a>
                    </div>
                    <div className="w-40 h-62 mb-2 ml-6 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                      {/* Doctor Information */}
                      <div className="relative inline-block">
                        {doctorInfo.picture ? (
                          <>
                            <img
                              src={doctorInfo.picture}
                              alt="staff"
                              className="rounded-full object-cover w-36 h-auto"
                            />
                          </>
                        ) : (
                          <>
                            <div role="status">
                              <svg
                                className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                {/* SVG path here */}
                              </svg>
                              <span className="sr-only">Loading...</span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="font-medium text-center ">
                        {doctorInfo?.name}
                      </p>
                      <p
                        style={{ wordWrap: "break-word" }}
                        className="text-center mb-2  font-normal italic"
                      >
                        {doctorInfo?.specialization}
                      </p>
                      <div className="flex items-center justify-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                          Bác sĩ
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* <footer className="bg-white dark:bg-gray-900 fixed w-full bottom-0 left-0">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className="flex items-center mb-4 sm:mb-0"
            >
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Medchain
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6 ">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6 ">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            Medchain
          </span>
        </div>
      </footer> */}
    </div>
  );
}
