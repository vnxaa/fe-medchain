import axios from "axios";
import { Contract, ethers } from "ethers";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import MedicalRecordNFT from "../../../artifacts/contracts/MedicalRecordNFT.sol/MedicalRecordNFT.json";
import Navigation from "../../Common/Navigation";
const MedicalRecord = () => {
  const router = useRouter();
  const { id } = router.query;
  const [patientInfo, setPatientInfo] = useState({});
  const [doctorInfo, setDoctorInfo] = useState({});
  const [medicalRecords, setMedicalRecords] = useState({});
  const [medicalRecordsResult, setMedicalRecordsResult] = useState({});

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
  //   console.log(medicalRecordsResult);
  //   console.log(medicalRecordsResult?);
  //   console.log(patientInfo.walletAddress);
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
      router.push("/Hospital/LoginPage");

      console.log("Token not found. Please log in.");
    }
    if (id) {
      fetchMedicalRecords(id);
    }
  }, [id, router]);
  useEffect(() => {
    fetchPatientInfo(medicalRecords.patientId);
    fetchDoctorInfo(medicalRecords.doctorId);
  }, [medicalRecords]);
  const mintNFT = async () => {
    try {
      const response = await axios.post(
        "https://api.nft.storage/upload",
        medicalRecordsResult,
        {
          headers: {
            Authorization: `Bearer ${process.env.NFT_STORAGE_KEY}`,
          },
        }
      );
      const ipfsHash = response.data.value.cid;
      const tokenUrl = `https://${ipfsHash}.ipfs.nftstorage.link`;
      console.log(tokenUrl);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // Create an instance of the contract
      const contract = new Contract(
        process.env.NFT_ADDRESS,
        MedicalRecordNFT.abi,
        signer
      );
      await contract.mintToken(patientInfo.walletAddress, tokenUrl);
    } catch (error) {
      console.log(error);
    }
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
                  href="/Hospital/MedicalRecord"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  Danh sách bệnh án
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
                  Bệnh án tim của bệnh nhân{" "}
                  {medicalRecordsResult?.hanh_chinh?.ho_va_ten}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className=" top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className=" w-full max-w-2xl">
            {/* Modal content */}
            <div className=" bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bệnh án tim của bệnh nhi{" "}
                  {medicalRecordsResult?.hanh_chinh?.ho_va_ten}
                </h3>
              </div>
              {/* Modal body */}
              <div className="p-6 max-h-[calc(100vh-24rem)] overflow-y-auto">
                <p className="block  text-xl font-medium text-gray-900 dark:text-white">
                  A, Hành chính:
                </p>

                <div className="block">
                  <p className="inline text-base font-medium text-gray-900 dark:text-white">
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
                        medicalRecordsResult?.hanh_chinh?.gioi_tinh.slice(1)
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
                <div className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.hanh_chinh?.thong_tin_lien_lac?.bo && (
                    <div className="text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                      {medicalRecordsResult?.hanh_chinh.thong_tin_lien_lac.bo}
                    </div>
                  )}
                  {medicalRecordsResult.hanh_chinh?.thong_tin_lien_lac?.me && (
                    <div className="text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                      {medicalRecordsResult?.hanh_chinh?.thong_tin_lien_lac?.me}
                    </div>
                  )}
                </div>

                <p className="block  text-xl font-medium text-gray-900 dark:text-white">
                  B, Chuyên môn:
                </p>
                <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                  1, Lý do vào viện:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.ly_do_vao_vien}
                </p>
                <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                  2, Bệnh sử:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.benh_su}
                </p>
                <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                  3, Tiền sử:
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  3.1, Tiền sử sản khoa:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.tien_su?.tien_su_san_khoa}
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  3.2, Tiền sử bệnh tật:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.tien_su?.tien_su_benh_tat}
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  3.3, Tiền sử ngoại khoa:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {
                    medicalRecordsResult?.chuyen_mon?.tien_su
                      ?.tien_su_ngoai_khoa
                  }
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  3.4, Tiền sử dị ứng:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.tien_su?.tien_su_di_ung}
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  3.5, Dinh dưỡng:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.tien_su?.dinh_duong}
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  3.6, Phát triển tâm thần vận động:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {
                    medicalRecordsResult?.chuyen_mon?.tien_su
                      ?.phat_trien_tam_than_van_dong
                  }
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  3.7, Tiêm chủng:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.tien_su?.tiem_chung}
                </p>
                <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                  4, Khám toàn thân:
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  4.1, Dấu hiệu sinh tồn:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {
                    medicalRecordsResult?.chuyen_mon?.kham_toan_than
                      ?.dau_hieu_sinh_ton
                  }
                </p>
                <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                  5, Khám cơ quan:
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  5.1, Tim mạch:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.kham_co_quan?.tim_mach}
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  5.2, Hô hấp:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.kham_co_quan?.ho_hap}
                </p>
                <p className="block  text-base font-medium text-gray-900 dark:text-white">
                  5.3, Tiêu hóa:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.kham_co_quan?.tieu_hoa}
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
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.chan_doan_so_bo}
                </p>
                <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                  8, Chẩn đoán xác định:
                </p>
                <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                  {medicalRecordsResult?.chuyen_mon?.chan_doan_xac_dinh}
                </p>
              </div>
              {/* Modal footer */}
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={mintNFT}
                  data-modal-hide="staticModal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Tạo NFT bệnh án
                </button>
                <button
                  //   onClick={toggleModal}
                  data-modal-hide="staticModal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add your page content here */}
    </div>
  );
};

export default MedicalRecord;
