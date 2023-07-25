import styled from "@emotion/styled";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Barcode from "react-jsbarcode";
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
    --fc-today-bg-color: black !important;
  }
  .fc-timegrid-slot-lane {
    height: 40px;
  }
`;
const Appointment = () => {
  const router = useRouter();
  const { doctorId } = router.query;
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [patientInfo, setPatientInfo] = useState("");
  const [doctorInfo, setDoctorInfo] = useState("");
  const [showDrawerDoctor, setShowDrawerDoctor] = useState(false);
  const [showDrawerPatient, setShowDrawerPatient] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotId, setSlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasAppointments, setHasAppointments] = useState(false);
  const [appointmentsPatient, setAppointmentsPatient] = useState({});
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  // console.log(appointmentsPatient[0].status);
  // console.log(doctorId);
  // console.log(currentPatientId);

  const handleToggleDrawerDoctor = () => {
    setShowDrawerPatient(false);
    setShowDrawerDoctor(!showDrawerDoctor);
  };
  const handleToggleDrawerPatient = () => {
    setShowDrawerDoctor(false);
    setShowDrawerPatient(!showDrawerPatient);
  };
  // Handle time slot selection
  const handleAppoinment = (eventInfo) => {
    setSlotId(eventInfo.event?.extendedProps?.id);
    setSelectedTime(eventInfo?.event);
    setSelectedEvent(eventInfo.event);
    // console.log(eventInfo.event);
    // console.log(eventInfo.event.extendedProps.patientId);
    // fetchPatientInfo(eventInfo.event.extendedProps.patientId);
    if (
      eventInfo.event &&
      eventInfo.event.extendedProps &&
      eventInfo.event.extendedProps.patientId
    ) {
      // setPatientId(eventInfo.event.extendedProps.patientId);
      fetchPatientInfo(eventInfo.event.extendedProps.patientId);
    } else {
      fetchPatientInfo(currentPatientId);
    }
    setShowConfirmation(true);
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
  const handleConfirmAppointment = async () => {
    // Make the appointment request using Axios
    try {
      setLoading(true);
      await axios
        .post(`${process.env.service}/api/appointment/create`, {
          patientId: currentPatientId,
          doctorId: doctorId,
          slotId: slotId,
        })
        .then((response) => {
          console.log("Appointment created successfully:", response.data);
          // Handle success response, e.g., show a success message to the user
          fetchDataEvents(doctorId, currentPatientId);
        })
        .catch((error) => {
          console.error("Failed to create appointment:", error);
          // Handle error, e.g., show an error message to the user
        });
    } catch (error) {
      console.error("Error creating appointment:", error);
      // Handle error, e.g., show an error message to the user
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }

    window.location.reload();
  };

  const handleCancelAppointment = () => {
    setShowConfirmation(false);
    setShowDrawerPatient(false);
    setShowDrawerDoctor(false);
  };
  const checkPatientAppointments = async (doctorId, patientId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/events/check-appointments/${doctorId}/${patientId}`
      );
      const { hasAppointments, appointments } = response.data;
      setHasAppointments(hasAppointments);
      setAppointmentsPatient(appointments);
    } catch (error) {
      console.error("Error occurred during API call:", error.message);
    }
  };
  const fetchDataEvents = useCallback(async (doctorId, patientId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/events/patient/${doctorId}/${patientId}`
      );
      const { availableSlots, appointments } = response.data;
      // Filter out appointments with the "cancelled" status
      const filteredAppointments = appointments.filter(
        (appointment) => appointment.status !== "cancelled"
      );

      const currentTime = new Date(); // Get the current time

      const filteredAvailableSlots = availableSlots.filter(
        (slot) => new Date(slot?.startTime) > currentTime // Filter slots that are greater than the current time
      );
      const events = [
        ...filteredAppointments.map((appointment) => ({
          appointmentId: appointment?._id,
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
            id: slot?._id,
          },
        })),
      ];

      setAppointments(filteredAppointments);
      setAvailableSlots(filteredAvailableSlots);
      setEvents(events);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

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
          setCurrentPatientId(decoded?.patient?._id);
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
    if (currentPatientId) {
      fetchPatientInfo(currentPatientId);
    }
  }, [router, setCurrentPatientId]);
  useEffect(() => {
    if (doctorId && currentPatientId) {
      // Fetch doctor information
      fetchDoctorInfo(doctorId);

      // Check patient appointments and conditionally fetch events data
      checkPatientAppointments(doctorId, currentPatientId)
        .then((hasAppointments) => {
          if (!hasAppointments) {
            // Fetch events data
            fetchDataEvents(doctorId, currentPatientId);

            // Fetch events data every 5 seconds
            const intervalId = setInterval(() => {
              fetchDataEvents(doctorId, currentPatientId).catch((error) => {
                console.error(error);
              });
            }, 6000);

            // Cleanup the interval when the component unmounts or when the doctorId or currentPatientId changes
            return () => clearInterval(intervalId);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoadingAppointment(false);
        });
    }
  }, [doctorId, currentPatientId, fetchDataEvents]);

  const statusColors = {
    pending: "#e3a008",
    confirmed: "#1a56db",
    cancelled: "#c81e1e",
  };

  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - currentDate.getDay()); // Đưa ngày về đầu tuần (chủ nhật)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7); // Thêm một tuần vào cuối tuần

  // futureDate.setDate(futureDate.getDate() + 7);
  const calculateAge = (birthday) => {
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthday).getFullYear();
    const age = currentYear - birthYear;
    return age;
  };

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
                    <Link href="/Patient/Doctor">Danh sách bác sĩ</Link>
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
                    Đặt lịch khám với bác sĩ {doctorInfo.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          {loadingAppointment ? (
            <>
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
            <>
              {hasAppointments ? (
                <>
                  <div className="sm:container sm:mx-auto flex h-fit justify-center items-center">
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
                                aria-hidden="true"
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

                    <div className="">
                      {/* "Phiếu khám" Content */}
                      {appointmentsPatient[0]?.status === "pending" ? (
                        <>
                          <a
                            // href="#"
                            className="block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-start justify-center border-b rounded-t dark:border-gray-600">
                              <h5 className="mb-2 text-xl uppercase font-bold tracking-tight text-gray-900 dark:text-white">
                                THÔNG TIN ĐẶT KHÁM
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
                            <div className="flex justify-center ">
                              {/* <span className="bg-yellow-100 mt-1 ml-2 mb-4 text-yellow-800 text-lg font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                            Đang chờ xác nhận
                          </span> */}
                              <span className="border border-yellow-300 bg-yellow-100 text-yellow-800 mb-2 text-base font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                                Đang chờ xác nhận
                              </span>
                            </div>
                            <hr className="w-48 h-1 mx-auto bg-gray-200 border-0 rounded  dark:bg-gray-700" />
                            <div className="flex justify-center ">
                              <span className="font-medium text-lg mt-2">
                                Giờ khám
                              </span>
                            </div>
                            <div className="flex justify-center ">
                              <span className="font-medium text-blue-700 text-lg mb-2">
                                {new Date(
                                  appointmentsPatient[0]?.slot?.startTime
                                ).toLocaleTimeString()}{" "}
                                -{" "}
                                {new Date(
                                  appointmentsPatient[0]?.slot?.endTime
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
                                  appointmentsPatient[0]?.slot?.date
                                ).toLocaleDateString("en-GB")}
                              </p>
                            </div>

                            {/* <div className="flex justify-center mt-4">
                          <span className="font-medium text-lg">
                            Mã phiếu khám
                          </span>
                        </div>
                        <div className="flex justify-center">
                          <Barcode
                            value="64a7982655669a0fcab0242a"
                            options={{ format: "code128", displayValue: false }}
                          />
                        </div> */}
                          </a>
                        </>
                      ) : (
                        <>
                          <a
                            href={`/AppointmentInformation/${appointmentsPatient[0]?.code}`}
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
                                value={appointmentsPatient[0]?.code}
                                options={{
                                  format: "code128",
                                  displayValue: false,
                                }}
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
                                  appointmentsPatient[0]?.slot?.startTime
                                ).toLocaleTimeString()}{" "}
                                -{" "}
                                {new Date(
                                  appointmentsPatient[0]?.slot?.endTime
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
                                  appointmentsPatient[0]?.slot?.date
                                ).toLocaleDateString("en-GB")}
                              </p>
                            </div>
                            {/* <div className="flex justify-between">
                          <p className="font-normal text-gray-700 dark:text-gray-400">
                            Mã phiếu khám:
                          </p>
                          <p>{appointmentsPatient[0]?._id}</p>
                        </div> */}
                          </a>
                        </>
                      )}
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
                                aria-hidden="true"
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
              ) : (
                <>
                  <StyleWrapper>
                    <FullCalendar
                      height="auto"
                      plugins={[timeGridPlugin, interactionPlugin]}
                      // selectable={true}
                      initialView="timeGridWeek"
                      select={handleAppoinment}
                      dayMaxEvents={true}
                      validRange={{
                        // start: startOfWeek,
                        end: endOfWeek,
                      }}
                      events={events}
                      selectConstraint={availableSlots}
                      allDaySlot={false}
                      dayMaxEventRows={true}
                      slotDuration="00:30:00" // Set the slot duration to 30 minutes
                      slotLabelInterval="00:30" // Show slot labels every 1 hour
                      locale="vi"
                      slotMinTime="09:00:00"
                      slotMaxTime="17:00:00"
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
                      // selectAllow={selectAllow}
                      eventContent={(eventInfo) => {
                        return (
                          <button
                            type="button"
                            onClick={() => handleAppoinment(eventInfo)}
                          >
                            <p>
                              {/* {eventInfo.event.title === "confirmed" &&
                  eventInfo.event.extendedProps.patientId === currentPatientId
                    ? "Đã đặt thành công"
                    : "Đã có người đặt"} */}

                              {eventInfo.event.title === "pending" &&
                              eventInfo.event.extendedProps.patientId ===
                                currentPatientId
                                ? "Đang chờ"
                                : eventInfo.event.title === "confirmed" &&
                                  eventInfo.event.extendedProps.patientId ===
                                    currentPatientId
                                ? "Đặt thành công"
                                : eventInfo.event.title === "cancelled" &&
                                  eventInfo.event.extendedProps.patientId ===
                                    currentPatientId
                                ? "Đã hủy"
                                : eventInfo.event.title === "confirmed" &&
                                  eventInfo.event.extendedProps.patientId !==
                                    currentPatientId
                                ? "Đã có người đặt"
                                : eventInfo.event.title === "pending" &&
                                  eventInfo.event.extendedProps.patientId !==
                                    currentPatientId
                                ? "Đã có người đặt"
                                : eventInfo.event.title != null
                                ? "Đặt khám"
                                : ""}
                            </p>
                          </button>
                        );
                      }}
                    />
                  </StyleWrapper>
                </>
              )}
            </>
          )}
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Thông tin đặt khám {selectedEvent?.status}
                  </h3>
                  {selectedEvent.title === "confirmed" && (
                    <>
                      <span className="bg-blue-100 mt-1 ml-2 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        Đặt thành công
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
                  {selectedEvent.title === "cancelled" && (
                    <>
                      <span className="bg-red-100 mt-1 ml-2 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                        Đã hủy
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
                      onClick={handleCancelAppointment}
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

                <div className="p-6">
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
                            alt="doctor"
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
                  {selectedEvent?.title === "pending" ||
                  selectedEvent?.title === "confirmed" ||
                  selectedEvent?.title === "cancelled" ? (
                    <>
                      <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                        Ngày khám:{" "}
                        {selectedEvent &&
                          new Date(selectedEvent.start).toLocaleDateString(
                            "en-GB"
                          )}
                      </p>

                      <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                        Khung giờ:{" "}
                        {new Date(selectedEvent?.start).toLocaleTimeString()} -{" "}
                        {new Date(selectedEvent?.end).toLocaleTimeString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                        Ngày khám:{" "}
                        {new Date(selectedTime?.start).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>

                      <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                        Khung giờ:{" "}
                        {new Date(selectedTime?.start).toLocaleTimeString()} -{" "}
                        {new Date(selectedTime?.end).toLocaleTimeString()}
                      </p>
                    </>
                  )}
                </div>

                {/* Modal footer */}
                {selectedEvent?.title === "pending" ||
                selectedEvent?.title === "confirmed" ||
                selectedEvent?.title === "cancelled" ? (
                  <></>
                ) : (
                  <>
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                      {loading ? (
                        <>
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
                        <>
                          <button
                            onClick={handleConfirmAppointment}
                            data-modal-hide="staticModal"
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Đặt khám
                          </button>
                          <button
                            onClick={handleCancelAppointment}
                            data-modal-hide="staticModal"
                            type="button"
                            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                          >
                            Quay lại
                          </button>
                        </>
                      )}
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
                          <span>Bố: {patientInfo.fatherContact}</span>
                        </p>
                      )}
                      {patientInfo.motherContact && (
                        <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span>Mẹ: {patientInfo.motherContact}</span>
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

export default Appointment;
