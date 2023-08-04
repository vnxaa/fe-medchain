import styled from "@emotion/styled";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Navigation from "../../Common/Navigation";
export const StyleWrapper = styled.div`
  .fc td {
    // background: red;
  }
  .fc-col-header-cell {
    padding: 20px;
  }
  .fc-col-header {
    background: #f1f5f8;
  }

  :root {
    --fc-today-bg-color: black;
  }
  .fc-timegrid-slot-lane {
    height: 40px;
  }
`;
const AppointmentRequests = () => {
  const router = useRouter();
  const { doctorId } = router.query;
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState("");
  const [patientInfo, setPatientInfo] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null); // Store the selected event
  const [appointmentId, setAppointmentId] = useState(null);
  const [showDrawerDoctor, setShowDrawerDoctor] = useState(false);
  const [showDrawerPatient, setShowDrawerPatient] = useState(false);
  const [slotId, setSlotId] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  // console.log(appointments);
  // console.log(appointmentId);
  const handleToggleDrawerDoctor = () => {
    setShowDrawerPatient(false);
    setShowDrawerDoctor(!showDrawerDoctor);
  };
  const handleToggleDrawerPatient = () => {
    setShowDrawerDoctor(false);
    setShowDrawerPatient(!showDrawerPatient);
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
  const statusColors = {
    pending: "#e3a008",
    confirmed: "#1a56db",
    cancelled: "#c81e1e",
  };
  const getAppointmentsByDoctorId = useCallback(async (doctorId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/events/staff/${doctorId}`
      );

      const { availableSlots, appointments } = response.data;
      const currentTime = new Date(); // Get the current time

      const filteredAvailableSlots = availableSlots.filter(
        (slot) => new Date(slot?.startTime) > currentTime // Filter slots that are greater than the current time
      );
      const events = [
        ...appointments.map((appointment) => ({
          appointmentId: appointment?._id,
          slotId: appointment?.slot?._id,
          title: appointment?.status,
          start: appointment?.slot?.startTime,
          end: appointment?.slot?.endTime,
          patientId: appointment?.patient,
          color: statusColors[appointment?.status],
        })),
        ...filteredAvailableSlots.map((slot) => ({
          title: "Available",
          start: slot?.startTime,
          end: slot?.endTime,
          extendedProps: {
            slotId: slot?._id,
          },
        })),
      ];

      setAppointments(appointments);
      setAvailableSlots(availableSlots);
      setEvents(events);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  }, []);

  async function updateAppointmentStatus(appointmentId, newStatus) {
    try {
      const response = await axios.put(
        `${process.env.service}/api/appointment/status/${appointmentId}`,
        { status: newStatus }
      );

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.appointmentId !== appointmentId)
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update appointment status");
    }
  }

  async function approveAppointment(appointmentId) {
    try {
      const response = await axios.put(
        `${process.env.service}/api/appointment/approve/${appointmentId}`
      );

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.appointmentId !== appointmentId)
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to approve appointment status");
    }
  }
  const updateStatusAvailableSlot = async () => {
    try {
      const response = await axios.put(
        `${process.env.service}/api/availableSlot/book/${slotId}`,
        {
          isBooked: false, // Set the desired status here
        }
      );
      console.log(response.data);
      // Handle the response as needed
    } catch (error) {
      console.error(error);
      // Handle the error
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
        if (decoded.user.role == "staff") {
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
  }, [router]);

  useEffect(() => {
    if (doctorId) {
      // Initial fetch of appointments
      getAppointmentsByDoctorId(doctorId);
      fetchDoctorInfo(doctorId);

      // Fetch appointments every 5 seconds
      const intervalId = setInterval(() => {
        getAppointmentsByDoctorId(doctorId);
      }, 5000);

      // Cleanup the interval when the component unmounts or when the doctorId changes
      return () => clearInterval(intervalId);
    }
  }, [doctorId, getAppointmentsByDoctorId]);
  const handleAppoinment = async (eventInfo) => {
    setSelectedEvent(eventInfo.event);

    if (eventInfo.event.extendedProps.slotId) {
      setSlotId(eventInfo.event.extendedProps.slotId);
    }
    if (eventInfo.event.extendedProps.patientId) {
      fetchPatientInfo(eventInfo.event.extendedProps.patientId);
    }
    if (eventInfo.event.extendedProps.appointmentId) {
      setAppointmentId(eventInfo.event.extendedProps.appointmentId);
    }

    setShowConfirmation(true);
  };
  const handleCancelAppoinment = async (slotId, appointmentId, newStatus) => {
    updateAppointmentStatus(appointmentId, newStatus);
    updateStatusAvailableSlot(slotId);
    setShowConfirmation(false);
  };
  const handleApprovelAppoinment = async (appointmentId) => {
    approveAppointment(appointmentId);
    setShowConfirmation(false);
  };
  const handleExit = () => {
    setShowConfirmation(false);
    setShowDrawerDoctor(false);
    setShowDrawerPatient(false);
  };
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - currentDate.getDay()); // Đưa ngày về đầu tuần (chủ nhật)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7); // Thêm một tuần vào cuối tuần
  return (
    <div>
      <Navigation />
      <div className="sm:container center sm:mx-auto">
        <div className="mb-2 p-6 bg-white font-medium  border border-gray-200 rounded-lg shadow">
          <nav
            className="flex px-5 mb-2 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center"></li>
              <li>
                <div className="flex items-center">
                  <div className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                    <Link href="/Staff/Doctor">Danh sách bác sĩ</Link>
                  </div>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    aria-hidden="true"
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
                    Xem lịch khám của bác sĩ {doctorInfo.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <StyleWrapper>
            <FullCalendar
              height="auto"
              plugins={[timeGridPlugin, interactionPlugin]}
              // selectable={true}
              initialView="timeGridWeek"
              // select={handleTimeSlotSelect}
              dayMaxEvents={true}
              events={events}
              allDaySlot={false}
              dayMaxEventRows={true}
              slotDuration="00:30:00" // Set the slot duration to 30 minutes
              slotLabelInterval="00:30" // Show slot labels every 1 hour
              locale="vi"
              slotMinTime="09:00:00"
              slotMaxTime="17:00:00"
              validRange={{
                // start: startOfWeek,
                end: endOfWeek,
              }}
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                omitZeroMinute: false,
              }}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hôm nay",
                week: "Tuần",
                day: "Ngày",
              }}
              titleFormat={{
                day: "numeric",
                year: "numeric",
                month: "long",
              }}
              //   selectAllow={selectAllow}
              eventContent={(eventInfo) => {
                return (
                  <div>
                    <button onClick={() => handleAppoinment(eventInfo)}>
                      <p>
                        {eventInfo.event.title === "pending"
                          ? "Đang chờ"
                          : eventInfo.event.title === "confirmed"
                          ? "Đặt thành công"
                          : eventInfo.event.title === "Available"
                          ? "Trống"
                          : eventInfo.event.title}
                      </p>
                    </button>
                  </div>
                );
              }}
            />
          </StyleWrapper>
        </div>
        {showConfirmation && (
          <div
            style={{ zIndex: 9999 }}
            className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          >
            <div className="relative w-full max-w-2xl">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  {selectedEvent.title === "pending" ||
                  selectedEvent.title === "confirmed" ? (
                    <>
                      {" "}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Thông tin đặt khám
                      </h3>
                    </>
                  ) : (
                    <>
                      {" "}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Thông tin khung giờ khám
                      </h3>
                    </>
                  )}
                  {selectedEvent.title === "confirmed" && (
                    <>
                      <span className="bg-blue-100 mt-1 ml-2 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        Đã xác nhận
                      </span>
                    </>
                  )}
                  {selectedEvent.title === "pending" && (
                    <>
                      <span className="bg-yellow-100 mt-1 ml-2 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                        Đang chờ xác nhận
                      </span>
                    </>
                  )}
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="staticModal"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      onClick={handleExit}
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                {/* Modal body */}
                {selectedEvent.title === "pending" ||
                selectedEvent.title === "confirmed" ? (
                  <>
                    <div className="p-6 ">
                      <ul
                        role="list"
                        className="divide-y divide-gray-200 dark:divide-gray-700"
                      >
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                className="w-8 h-8 rounded-full"
                                src={doctorInfo.picture}
                                alt="Neil image"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Bác sĩ {doctorInfo.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                {doctorInfo.contactNumber}
                              </p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <button
                                type="button"
                                onClick={handleToggleDrawerDoctor}
                                className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                              >
                                Xem thông tin
                              </button>
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                className="w-8 h-8 rounded-full"
                                src={patientInfo.picture}
                                alt="Bonnie image"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Bệnh nhân {patientInfo.name}
                              </p>
                              {patientInfo.fatherContact && (
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                  <span>Bố: {patientInfo.fatherContact}</span>
                                </p>
                              )}
                              {patientInfo.motherContact && (
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                  <span>Mẹ: {patientInfo.motherContact}</span>
                                </p>
                              )}
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <button
                                type="button"
                                onClick={handleToggleDrawerPatient}
                                className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                              >
                                Xem thông tin
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                        Ngày khám:{" "}
                        {new Date(selectedEvent.start).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>

                      <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                        Khung giờ:{" "}
                        {new Date(selectedEvent.start).toLocaleTimeString()} -{" "}
                        {new Date(selectedEvent.end).toLocaleTimeString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6 ">
                      <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                        Ngày khám:{" "}
                        {new Date(selectedEvent.start).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>

                      <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                        Khung giờ:{" "}
                        {new Date(selectedEvent.start).toLocaleTimeString()} -{" "}
                        {new Date(selectedEvent.end).toLocaleTimeString()}
                      </p>
                    </div>
                  </>
                )}

                {/* Modal footer */}

                {selectedEvent.title === "pending" && (
                  <>
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button
                        onClick={() => handleApprovelAppoinment(appointmentId)}
                        data-modal-hide="staticModal"
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Đặt khám
                      </button>
                      <button
                        onClick={() =>
                          handleCancelAppoinment(
                            slotId,
                            appointmentId,
                            "cancelled"
                          )
                        }
                        data-modal-hide="staticModal"
                        type="button"
                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        Hủy khám
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {showDrawerDoctor && (
          <div
            style={{ zIndex: 9999 }}
            className="fixed top-0 right-0 bottom-0 w-96 bg-white shadow-lg dark:bg-gray-800"
          >
            <div className="max-w-2xl mx-auto overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="p-4 bg-white -lg rounded-2xl w-80 dark:bg-gray-800">
                  <div className="flex flex-row items-start gap-4">
                    <img
                      src={doctorInfo.picture}
                      alt="Patient"
                      className="rounded-lg w-28 h-28"
                    />
                    <button
                      type="button"
                      onClick={handleToggleDrawerDoctor}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>

                      <span className="sr-only">Close menu</span>
                    </button>
                    <div className="flex flex-col justify-between w-full h-28">
                      <div>
                        <p className="text-xl font-medium text-gray-800 dark:text-white">
                          {doctorInfo.name}
                        </p>
                        <p className="text-xs text-gray-400"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Giới tính
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorInfo.gender &&
                        `${
                          doctorInfo.gender.charAt(0).toUpperCase() +
                          doctorInfo.gender.slice(1)
                        }`}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Ngày Sinh
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(doctorInfo.birthday).toLocaleDateString(
                        "en-GB"
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorInfo.contactNumber}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Địa chỉ
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctorInfo.address}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
        {showDrawerPatient && (
          <div
            style={{ zIndex: 9999 }}
            className="fixed top-0 right-0 bottom-0 w-96 bg-white shadow-lg dark:bg-gray-800"
          >
            <div className="max-w-2xl mx-auto overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="p-4 bg-white -lg rounded-2xl w-80 dark:bg-gray-800">
                  <div className="flex flex-row items-start gap-4">
                    <img
                      src={patientInfo.picture}
                      alt="Patient"
                      className="rounded-lg w-28 h-28"
                    />
                    <button
                      type="button"
                      onClick={handleToggleDrawerPatient}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>

                      <span className="sr-only">Close menu</span>
                    </button>
                    <div className="flex flex-col justify-between w-full h-28">
                      <div>
                        <p className="text-xl font-medium text-gray-800 dark:text-white">
                          {patientInfo.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {/* {patientInfo.walletAddress} */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Giới tính
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientInfo.gender &&
                        `${
                          patientInfo.gender.charAt(0).toUpperCase() +
                          patientInfo.gender.slice(1)
                        }`}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Ngày Sinh
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(patientInfo.birthday).toLocaleDateString(
                        "en-GB"
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientInfo.fatherContact && (
                        <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span>
                            Bố {patientInfo.fatherName}:{" "}
                            {patientInfo.fatherContact}
                          </span>
                        </p>
                      )}
                      {patientInfo.motherContact && (
                        <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span>
                            Mẹ {patientInfo.motherName}:{" "}
                            {patientInfo.motherContact}
                          </span>
                        </p>
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Địa chỉ
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {patientInfo.address}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentRequests;
