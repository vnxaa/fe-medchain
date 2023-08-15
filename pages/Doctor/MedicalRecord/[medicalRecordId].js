import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../../Common/Navigation";
const MedicalRecord = () => {
  const router = useRouter();
  const { medicalRecordId } = router.query;
  const [medicalRecords, setMedicalRecords] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [rejectReasons, setRejectReasons] = useState({});
  const [patientInfo, setPatientInfo] = useState({});
  const [doctorInfo, setDoctorInfo] = useState({});
  const [medicalRecordsResult, setMedicalRecordsResult] = useState({});
  const [doctorId, setDoctorId] = useState(null);
  const getRejectReasonsByMedicalRecordId = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/rejectReason/medicalRecord/${id}`
      );
      // console.log(response.data?.rejectReason);
      const length = response.data?.rejectReason.length - 1;
      const reasons = response.data?.rejectReason[length]?.reason;
      setRejectReasons(reasons);
    } catch (error) {
      console.error("Failed to fetch reject reasons:", error);
    }
  };

  const handleToggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };
  const fetchPatientInfo = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/patient/${id}`
      );
      const patientData = response.data;
      setPatientInfo(patientData);
    } catch (error) {
      console.error(`Failed to fetch patient information for ID ${id}:`, error);
    }
  };

  const fetchDoctorInfo = async (doctorId) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/doctor/${doctorId}`
      );
      const doctorData = response.data;
      setDoctorInfo(doctorData);
    } catch (error) {
      console.error(
        `Failed to fetch doctor information for ID ${doctorId}:`,
        error
      );
    }
  };
  const fetchMedicalRecords = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/medicalRecord/${id}`
      );
      setMedicalRecords(response.data);

      setMedicalRecordsResult(JSON.parse(response.data.diagnosis[0]));
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
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
          setDoctorId(decoded?.user?._id);
          // User is a doctor, allow access to the doctor page
          console.log("Access granted to doctor page");
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
    if (medicalRecordId) {
      fetchMedicalRecords(medicalRecordId);
      getRejectReasonsByMedicalRecordId(medicalRecordId);
    }
  }, [router, medicalRecordId]);
  useEffect(() => {
    if (medicalRecords?.patientId && medicalRecords?.doctorId) {
      fetchPatientInfo(medicalRecords?.patientId);
      fetchDoctorInfo(medicalRecords?.doctorId);
    }
  }, [medicalRecords]);
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
                <div className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                  <Link href="/Doctor/MedicalRecord">Danh sách bệnh án</Link>
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
                  Bệnh án tim của bệnh nhân{" "}
                  {medicalRecordsResult?.hanh_chinh?.ho_va_ten}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className=" top-0 left-0 mt-2 right-0 bottom-0 flex items-center justify-center">
          <div className=" w-full max-w-2xl">
            {/* Modal content */}
            <div className=" bg-white rounded-lg shadow dark:bg-gray-700">
              {medicalRecordsResult?.hanh_chinh?.ho_va_ten ? (
                <>
                  {" "}
                  {/* Modal header */}
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Bệnh án tim của bệnh nhi{" "}
                      {medicalRecordsResult?.hanh_chinh?.ho_va_ten}
                    </h3>
                    {medicalRecords?.status === "minted" && (
                      <div>
                        <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                          NFT
                        </span>
                      </div>
                    )}
                    {medicalRecords?.status === "draft" && (
                      <div>
                        <span className="ml-2 bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                          Nháp
                        </span>
                      </div>
                    )}
                    {medicalRecords?.status === "reject" && (
                      <div>
                        <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                          Từ chối
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Modal body */}
                  <div className="p-6 max-h-[calc(100vh-24rem)] overflow-y-auto">
                    <p className="block  text-xl font-medium text-gray-900 dark:text-white">
                      A, Hành chính:
                    </p>
                    <div className="ml-2">
                      <div className="block ">
                        <p className="inline   text-base font-medium text-gray-900 dark:text-white">
                          1, Họ và tên:{" "}
                        </p>
                        <p className="inline text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                          {medicalRecordsResult?.hanh_chinh?.ho_va_ten}
                        </p>
                      </div>

                      <div className="block">
                        <p className="inline text-base font-medium text-gray-900 dark:text-white">
                          2, Giới tính:{" "}
                        </p>
                        <p className="inline text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                          {medicalRecordsResult?.hanh_chinh?.gioi_tinh &&
                            `${
                              medicalRecordsResult?.hanh_chinh?.gioi_tinh
                                .charAt(0)
                                .toUpperCase() +
                              medicalRecordsResult?.hanh_chinh?.gioi_tinh.slice(
                                1
                              )
                            }`}
                        </p>
                      </div>

                      <div className="block">
                        <p className="inline text-base font-medium text-gray-900 dark:text-white">
                          3, Sinh ngày:{" "}
                        </p>
                        <p className="inline text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                          {new Date(
                            medicalRecordsResult?.hanh_chinh?.sinh_ngay
                          ).toLocaleDateString("en-GB")}
                        </p>
                      </div>

                      <div className="block">
                        <p className="inline text-base font-medium text-gray-900 dark:text-white">
                          4, Địa chỉ:{" "}
                        </p>
                        <p className="inline text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                          {medicalRecordsResult?.hanh_chinh?.dia_chi}
                        </p>
                      </div>

                      <p className="block  text-base font-medium text-gray-900 dark:text-white">
                        5, Thông tin liên lạc:
                      </p>
                      <div className="text-sm ml-2 leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.hanh_chinh?.thong_tin_lien_lac
                          ?.bo && (
                          <div className="text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                            {
                              medicalRecordsResult?.hanh_chinh
                                .thong_tin_lien_lac.bo
                            }
                          </div>
                        )}
                        {medicalRecordsResult.hanh_chinh?.thong_tin_lien_lac
                          ?.me && (
                          <div className="text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                            {
                              medicalRecordsResult?.hanh_chinh
                                ?.thong_tin_lien_lac?.me
                            }
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="block  text-xl font-medium text-gray-900 dark:text-white">
                      B, Chuyên môn:
                    </p>

                    <div className="ml-2">
                      <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                        1, Lý do vào viện:
                      </p>
                      <p className="text-sm ml-2 leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.chuyen_mon?.ly_do_vao_vien}
                      </p>
                      <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                        2, Bệnh sử:
                      </p>
                      <p className="text-sm ml-2 leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.chuyen_mon?.benh_su}
                      </p>
                      <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                        3, Tiền sử:
                      </p>
                      <p className="block  ml-2 text-base font-medium text-gray-900 dark:text-white">
                        3.1, Tiền sử sản khoa:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {
                          medicalRecordsResult?.chuyen_mon?.tien_su
                            ?.tien_su_san_khoa
                        }
                      </p>
                      <p className="block ml-2  text-base font-medium text-gray-900 dark:text-white">
                        3.2, Tiền sử bệnh tật:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {
                          medicalRecordsResult?.chuyen_mon?.tien_su
                            ?.tien_su_benh_tat
                        }
                      </p>
                      <p className="block  ml-2 text-base font-medium text-gray-900 dark:text-white">
                        3.3, Tiền sử ngoại khoa:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {
                          medicalRecordsResult?.chuyen_mon?.tien_su
                            ?.tien_su_ngoai_khoa
                        }
                      </p>
                      <p className="block ml-2  text-base font-medium text-gray-900 dark:text-white">
                        3.4, Tiền sử dị ứng:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {
                          medicalRecordsResult?.chuyen_mon?.tien_su
                            ?.tien_su_di_ung
                        }
                      </p>
                      <p className="block ml-2 text-base font-medium text-gray-900 dark:text-white">
                        3.5, Dinh dưỡng:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.chuyen_mon?.tien_su?.dinh_duong}
                      </p>
                      <p className="block ml-2 text-base font-medium text-gray-900 dark:text-white">
                        3.6, Phát triển tâm thần vận động:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {
                          medicalRecordsResult?.chuyen_mon?.tien_su
                            ?.phat_trien_tam_than_van_dong
                        }
                      </p>
                      <p className="block ml-2  text-base font-medium text-gray-900 dark:text-white">
                        3.7, Tiêm chủng:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.chuyen_mon?.tien_su?.tiem_chung}
                      </p>
                      <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                        4, Khám toàn thân:
                      </p>
                      <p className="block ml-2 text-base font-medium text-gray-900 dark:text-white">
                        4.1, Dấu hiệu sinh tồn:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {
                          medicalRecordsResult?.chuyen_mon?.kham_toan_than
                            ?.dau_hieu_sinh_ton
                        }
                      </p>
                      <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                        5, Khám cơ quan:
                      </p>
                      <p className="block ml-2  text-base font-medium text-gray-900 dark:text-white">
                        5.1, Tim mạch:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {
                          medicalRecordsResult?.chuyen_mon?.kham_co_quan
                            ?.tim_mach
                        }
                      </p>
                      <p className="block ml-2  text-base font-medium text-gray-900 dark:text-white">
                        5.2, Hô hấp:
                      </p>
                      <p className="text-sm ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.chuyen_mon?.kham_co_quan?.ho_hap}
                      </p>
                      <p className="block ml-2 text-base font-medium text-gray-900 dark:text-white">
                        5.3, Tiêu hóa:
                      </p>
                      <p className="text-sm  ml-4 leading-relaxed text-gray-900 dark:text-white">
                        {
                          medicalRecordsResult?.chuyen_mon?.kham_co_quan
                            ?.tieu_hoa
                        }
                      </p>
                      <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                        6, Tóm tắt bệnh án:
                      </p>
                      <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.chuyen_mon?.tomtatbenhan}
                      </p>
                      <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                        7, Chẩn đoán sơ bộ:
                      </p>
                      <p className="text-sm ml-2 leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.chuyen_mon?.chan_doan_so_bo}
                      </p>
                      <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                        8, Chẩn đoán xác định:
                      </p>
                      <p className="text-sm ml-2 leading-relaxed text-gray-900 dark:text-white">
                        {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh}
                      </p>
                    </div>
                  </div>
                  {/* Modal footer */}
                  <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    {medicalRecords?.status === "reject" && (
                      <>
                        <button
                          onClick={handleToggleDrawer}
                          data-modal-hide="staticModal"
                          type="button"
                          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Xem lý do
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div>
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDrawer ||
        (medicalRecords?.status === "reject" && (
          <div
            style={{ zIndex: 9999 }}
            className="fixed p-4 top-0 right-0 bottom-0 w-96 bg-white shadow-lg dark:bg-gray-800"
          >
            <div>
              <h5 className="inline-flex  items-center mb-6 text-base font-semibold text-gray-500 dark:text-gray-400">
                <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  Từ chối
                </span>
              </h5>
              <button
                type="button"
                onClick={handleToggleDrawer}
                data-drawer-hide="drawer-contact"
                aria-controls="drawer-contact"
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
              <form action="#" className="mb-6">
                {/* <div className="flex items-center mb-5 space-x-4">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={doctorInfo.picture}
                  />
                  <div className="font-medium dark:text-white">
                    <div>{doctorInfo?.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {doctorInfo.contactNumber}
                    </div>
                  </div>
                </div> */}
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Lý do:
                  </label>

                  <textarea
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={rejectReasons || ""}
                    disabled={true}
                  />
                </div>
                {medicalRecords.doctorId === doctorId && (
                  <>
                    {" "}
                    <a
                      //   onClick={mintNFT}
                      href={`/Doctor/EditMedicalRecord/${medicalRecordId}`}
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Sửa bệnh án
                    </a>
                  </>
                )}
              </form>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MedicalRecord;
