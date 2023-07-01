import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../../Common/Navigation";
const Appointment = () => {
  const router = useRouter();
  const { doctorId } = router.query;
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [patientInfo, setPatientInfo] = useState("");
  const [doctorInfo, setDoctorInfo] = useState("");
  // Handle time slot selection
  const handleAppoinment = (eventInfo) => {
    setSelectedTime(eventInfo);
    setSelectedEvent(eventInfo.event);
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
  const handleConfirmAppointment = () => {
    // Make the appointment request using Axios
    const startTime = new Date(selectedTime.startStr).toLocaleTimeString();
    const endTime = new Date(selectedTime.endStr).toLocaleTimeString();
    axios
      .post(`${process.env.service}/api/appointment/create`, {
        patientId: patientId,
        doctorId: doctorId,
        appointmentDate: selectedTime.startStr,
        startTime: selectedTime.startStr,
        endTime: selectedTime.endStr,
      })
      .then((response) => {
        console.log("Appointment created successfully:", response.data);
        // Handle success response, e.g., show a success message to the user
        getAppointmentsByDoctorId(doctorId);
      })
      .catch((error) => {
        console.error("Failed to create appointment:", error);
        // Handle error, e.g., show an error message to the user
      });
    setShowConfirmation(false);
  };
  const handleCancelAppointment = () => {
    setShowConfirmation(false);
  };
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
          setPatientId(decoded.patient._id);
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
    if (patientId) {
      fetchPatientInfo(patientId);
    }
  }, [patientId]);
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
  }, [doctorId]);

  const getAppointmentsByDoctorId = (doctorId) => {
    // Make the GET request using Axios
    axios
      .get(`${process.env.service}/api/appointment/doctor/${doctorId}`)
      .then((response) => {
        // Handle the response data
        const appointments = response.data.appointments;
        setAppointments(appointments);
        setEvents(
          appointments.map((appointment) => ({
            title: appointment.status,
            start: appointment.startTime,
            end: appointment.endTime,
            color: statusColors[appointment.status],
          }))
        );
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  const statusColors = {
    pending: "#e3a008",
    confirmed: "#1a56db",
    cancelled: "#c81e1e",
  };

  const selectAllow = (selectInfo) => {
    const startHour = selectInfo.start.getHours();
    const startMinute = selectInfo.start.getMinutes();

    // Disable selection for 12:00 PM
    if (startHour === 12 && startMinute === 0) {
      return false;
    }

    return true;
  };

  return (
    <div>
      <Navigation />
      <div className="sm:container center sm:mx-auto">
        <nav
          className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center"></li>
            <li>
              <div className="flex items-center">
                <a
                  href="/Patient/Doctor"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  Danh sách bác sĩ
                </a>
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
                  đặt lịch khám với bác sĩ {doctorInfo.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <FullCalendar
          height="500px"
          plugins={[timeGridPlugin, interactionPlugin]}
          selectable={true}
          initialView="timeGridWeek"
          select={handleAppoinment}
          dayMaxEvents={true}
          events={events}
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
          selectAllow={selectAllow}
          eventContent={(eventInfo) => {
            return (
              <div>
                <button onClick={() => handleAppoinment(eventInfo)}>
                  <p>
                    {eventInfo.event.title === "pending"
                      ? "Đang chờ"
                      : eventInfo.event.title === "confirmed"
                      ? "Đặt thành công"
                      : eventInfo.event.title == "cancelled"
                      ? "Đã hủy"
                      : eventInfo.event.title}
                  </p>
                </button>
              </div>
            );
          }}
        />
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
                    Thông tin đặt khám
                  </h3>
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
                <div className="p-6 ">
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
                          {new Date(selectedEvent.start).toLocaleTimeString()} -{" "}
                          {new Date(selectedEvent.end).toLocaleTimeString()}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                          Ngày khám:{" "}
                          {new Date(selectedTime.start).toLocaleDateString(
                            "en-GB"
                          )}
                        </p>

                        <p className="text-base leading-relaxed text-black-500 dark:text-gray-400">
                          Khung giờ:{" "}
                          {new Date(selectedTime.start).toLocaleTimeString()} -{" "}
                          {new Date(selectedTime.end).toLocaleTimeString()}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Modal footer */}
                {selectedEvent?.title === "pending" ||
                selectedEvent?.title === "confirmed" ||
                selectedEvent?.title === "cancelled" ? (
                  <></>
                ) : (
                  <>
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
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
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
