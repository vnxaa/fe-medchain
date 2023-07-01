import axios from "axios";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navigation from "../../Common/Navigation";
const MedicalRecord = () => {
  const router = useRouter();
  const [patientInfo, setPatientInfo] = useState(null);
  //1. Lý do vào viện
  const [lydo, setLydo] = useState("");
  //2. Bệnh sử
  const [benhsu, setBenhsu] = useState("");
  //3. Tiền sử
  const [tiensusankhoa, setTiensusankhoa] = useState("");
  const [tiensubenhtat, setTiensubenhtat] = useState("");
  const [tiensungoaikhoa, setTiensungoaikhoa] = useState("");
  const [tiensudiung, setTiensudiung] = useState("");
  const [dinhduong, setDinhduong] = useState("");
  const [phatrientamthanvandong, setPhatrientamthanvandong] = useState("");
  const [tiemchung, setTiemchung] = useState("");
  //4. Khám toàn thân
  const [mach, setMach] = useState("");
  const [huyetap, setHuyetap] = useState("");
  const [nhietdo, setNhietdo] = useState("");
  const [nhiptho, setNhiptho] = useState("");
  const [cannang, setCannang] = useState("");
  const [chieucao, setChieucao] = useState("");
  // /5. Khám cơ quan
  const [timmach, setTimmach] = useState("");
  const [hohap, setHohap] = useState("");
  const [tieuhoa, setTieuhoa] = useState("");
  //6. Tóm tắt bệnh án
  const [tomtatbenhan, setTomtatbenhan] = useState("");
  //7. Chẩn đoán sơ bộ
  const [chandoansobo, setChandoansobo] = useState("");
  //8. Chẩn đoán xác định
  const [chandoanxacdinh, setChandoanxacdinh] = useState("");

  const { id } = router.query;
  const [doctorId, SetDoctorId] = useState("");
  const [activeTab, setActiveTab] = useState("lydo");
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const fetchPatientInfo = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.service}/api/patient/${id}`
      );
      setPatientInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch patient information:", error);
    }
  };
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);
        console.log(decoded.doctor._id);

        // Check if the user is a doctor
        if (decoded.doctor) {
          SetDoctorId(decoded.doctor._id);
          // User is a doctor, allow access to the doctor page
          console.log("Access granted to doctor page");
        } else {
          // User is not a doctor, redirect to another page or show an error message
          console.log("Access denied. User is not a doctor");
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
    if (id) {
      fetchPatientInfo(id);
    }
  }, [id, router]);
  if (!patientInfo) {
    return <div>Loading...</div>; // Display a loading state while fetching data
  }
  //1. Lý do vào viện
  const handleLydoChange = (e) => {
    setLydo(e.target.value);
  };
  //2. Bệnh sử
  const handleBenhsuChange = (e) => {
    setBenhsu(e.target.value);
  };
  //3. Tiền sử
  const handleTiensusankhoaChange = (e) => {
    setTiensusankhoa(e.target.value);
  };

  const handleTiensubenhtatChange = (e) => {
    setTiensubenhtat(e.target.value);
  };

  const handleTiensungoaikhoaChange = (e) => {
    setTiensungoaikhoa(e.target.value);
  };

  const handleTiensudiungChange = (e) => {
    setTiensudiung(e.target.value);
  };

  const handleDinhduongChange = (e) => {
    setDinhduong(e.target.value);
  };

  const handlePhatrientamthanvandongChange = (e) => {
    setPhatrientamthanvandong(e.target.value);
  };

  const handleTiemchungChange = (e) => {
    setTiemchung(e.target.value);
  };
  //4. Khám toàn thân
  const handleMachChange = (e) => {
    setMach(e.target.value);
  };

  const handleHuyetapChange = (e) => {
    setHuyetap(e.target.value);
  };

  const handleNhietdoChange = (e) => {
    setNhietdo(e.target.value);
  };

  const handleNhipthoChange = (e) => {
    setNhiptho(e.target.value);
  };

  const handleCannangChange = (e) => {
    setCannang(e.target.value);
  };

  const handleChieucaoChange = (e) => {
    setChieucao(e.target.value);
  };
  // /5. Khám cơ quan
  const handleTimmachChange = (e) => {
    setTimmach(e.target.value);
  };

  const handleHohapChange = (e) => {
    setHohap(e.target.value);
  };

  const handleTieuhoaChange = (e) => {
    setTieuhoa(e.target.value);
  };
  //6. Tóm tắt bệnh án
  const handleTomtatbenhanChange = (e) => {
    setTomtatbenhan(e.target.value);
  };
  //7. Chẩn đoán sơ bộ
  const handleChandoansoboChange = (e) => {
    setChandoansobo(e.target.value);
  };
  //8. Chẩn đoán xác định
  const handleChandoanxacdinhChange = (e) => {
    setChandoanxacdinh(e.target.value);
  };
  const sendToHospital = async (event) => {
    event.preventDefault();
    const formData = {
      hanh_chinh: {
        ho_va_ten: patientInfo.name,
        gioi_tinh: patientInfo.gender,
        sinh_ngay: patientInfo.birthday,
        dia_chi: patientInfo.address,
        thong_tin_lien_lac: {
          bo: patientInfo.fatherName
            ? `Bố - ${patientInfo.fatherName} - ${patientInfo.fatherContact}`
            : "",
          me: patientInfo.motherName
            ? `Mẹ - ${patientInfo.motherName} - ${patientInfo.motherContact}`
            : "",
        },
      },
      chuyen_mon: {
        ly_do_vao_vien: lydo,
        benh_su: benhsu,
        tien_su: {
          tien_su_san_khoa: tiensusankhoa,
          tien_su_benh_tat: tiensubenhtat,
          tien_su_ngoai_khoa: tiensungoaikhoa,
          tien_su_di_ung: tiensudiung,
          dinh_duong: dinhduong,
          phat_trien_tam_than_van_dong: phatrientamthanvandong,
          tiem_chung: tiemchung,
        },
        kham_toan_than: {
          dau_hieu_sinh_ton: `Mạch: ${mach || "?"} (lần/phút), Huyết áp: ${
            huyetap || "?"
          } (mmHg), Nhiệt độ: ${nhietdo || "?"}°C, Nhịp thở: ${
            nhiptho || "?"
          } (lần/phút), Cân nặng: ${cannang || "?"}kg, Chiều cao: ${
            chieucao || "?"
          }cm`,
        },
        kham_co_quan: {
          tim_mach: timmach,
          ho_hap: hohap,
          tieu_hoa: tieuhoa,
        },
        tom_tat_benh_an: tomtatbenhan,
        chan_doan_so_bo: chandoansobo,
        chan_doan_xac_dinh: chandoanxacdinh,
      },
    };

    // const jsonData = JSON.stringify(formData);
    // console.log(jsonData);
    try {
      const jsonData = JSON.stringify(formData);

      const response = await axios.post(
        `${process.env.service}/api/medicalRecord/create`,
        {
          patientId: id,
          doctorId: doctorId,
          diagnosis: jsonData,
        }
      );

      console.log("Medical record created:", response.data);
    } catch (error) {
      console.error("Failed to create medical record:", error.response.data);
    }
  };
  return (
    <div>
      <Navigation />

      <div className="sm:container center sm:mx-auto">
        <nav
          style={{ marginBottom: "50px" }}
          className="flex px-5 py-3  text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center"></li>
            <li>
              <div className="flex items-center">
                <Link
                  href="/Doctor/Patient"
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  Danh sách bệnh nhân
                </Link>
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
                <Link
                  href={`/Doctor/PatientProfile/${id}`}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {patientInfo.name}
                </Link>
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
                  Tạo bệnh án
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/* benh an form */}
        <div
          className="mx-auto overflow-hidden bg-white shadow sm:rounded-lg"
          style={{ marginTop: "10px" }}
        >
          <div className="flex">
            <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
              <li className={`w-full ${activeTab === "lydo" && "bg-gray-100"}`}>
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={activeTab === "lydo" ? "lydo" : undefined}
                  onClick={() => handleTabClick("lydo")}
                >
                  1. Lý do vào viện
                </p>
              </li>
              <li
                className={`w-full ${activeTab === "benhsu" && "bg-gray-100"}`}
              >
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900  rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={activeTab === "benhsu" ? "benhsu" : undefined}
                  onClick={() => handleTabClick("benhsu")}
                >
                  2. Bệnh sử
                </p>
              </li>
              <li
                className={`w-full ${activeTab === "tiensu" && "bg-gray-100"}`}
              >
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900  rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={activeTab === "tiensu" ? "tiensu" : undefined}
                  onClick={() => handleTabClick("tiensu")}
                >
                  3. Tiền sử
                </p>
              </li>
              <li
                className={`w-full ${
                  activeTab === "khamtoanthan" && "bg-gray-100"
                }`}
              >
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={
                    activeTab === "khamtoanthan" ? "khamtoanthan" : undefined
                  }
                  onClick={() => handleTabClick("khamtoanthan")}
                >
                  4. Khám toàn thân
                </p>
              </li>
              <li
                className={`w-full ${
                  activeTab === "khamcoquan" && "bg-gray-100"
                }`}
              >
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={
                    activeTab === "khamcoquan" ? "khamcoquan" : undefined
                  }
                  onClick={() => handleTabClick("khamcoquan")}
                >
                  5. Khám cơ quan
                </p>
              </li>
              <li
                className={`w-full ${
                  activeTab === "tomtatbenhan" && "bg-gray-100"
                }`}
              >
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={
                    activeTab === "tomtatbenhan" ? "tomtatbenhan" : undefined
                  }
                  onClick={() => handleTabClick("tomtatbenhan")}
                >
                  6. Tóm tắt bệnh án
                </p>
              </li>
              <li
                className={`w-full ${
                  activeTab === "chandoansobo" && "bg-gray-100"
                }`}
              >
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={
                    activeTab === "chandoansobo" ? "chandoansobo" : undefined
                  }
                  onClick={() => handleTabClick("chandoansobo")}
                >
                  7. Chẩn đoán sơ bộ
                </p>
              </li>
              <li
                className={`w-full ${
                  activeTab === "chandoanxacdinh" && "bg-gray-100"
                }`}
              >
                <p
                  href="#"
                  className="inline-block w-full p-3 text-gray-900  rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current={
                    activeTab === "chandoanxacdinh"
                      ? "chandoanxacdinh"
                      : undefined
                  }
                  onClick={() => handleTabClick("chandoanxacdinh")}
                >
                  8. Chẩn đoán xác định
                </p>
              </li>
            </ul>
            <button
              onClick={toggleModal}
              style={{ marginLeft: "20px" }}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Xem trước
            </button>
          </div>

          {activeTab === "lydo" && (
            <div className="relative overflow-x-auto">
              <div>
                <label
                  htmlFor="lydo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  1. Lý do vào viện
                </label>
                <textarea
                  id="lydo"
                  onChange={handleLydoChange}
                  defaultValue={lydo || ""}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                />
              </div>
            </div>
          )}
          {activeTab === "benhsu" && (
            <div className="relative overflow-x-auto">
              <div>
                <label
                  htmlFor="benhsu"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  2. Bệnh sử
                </label>
                <textarea
                  id="benhsu"
                  onChange={handleBenhsuChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={benhsu || ""}
                />
              </div>
            </div>
          )}
          {activeTab === "tiensu" && (
            <div className="relative overflow-x-auto">
              {/* tien su san khoa */}
              <div>
                <label
                  htmlFor="tiensusankhoa"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  3.1 Tiền sử sản khoa
                </label>
                <textarea
                  id="handleTiensusankhoaChange"
                  onChange={handleTiensusankhoaChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={tiensusankhoa || ""}
                />
              </div>
              {/* tien su benh tat */}
              <div>
                <label
                  htmlFor="tiensubenhtat"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  3.2 Tiền sử bệnh tật
                </label>
                <textarea
                  id="tiensubenhtat"
                  onChange={handleTiensubenhtatChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={tiensubenhtat || ""}
                />
              </div>
              {/* tienSuNgoaiKhoa */}
              <div>
                <label
                  htmlFor="tienSuNgoaiKhoa"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  3.3 Tiền sử ngoại khoa
                </label>
                <textarea
                  id="tienSuNgoaiKhoa"
                  onChange={handleTiensungoaikhoaChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={tiensungoaikhoa || ""}
                />
              </div>
              {/* tienSuDiUng */}
              <div>
                <label
                  htmlFor="tienSuDiUng"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  3.4 Tiền sử dị ứng
                </label>
                <textarea
                  id="tienSuDiUng"
                  onChange={handleTiensudiungChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={tiensudiung || ""}
                />
              </div>
              {/* dinhDuong */}
              <div>
                <label
                  htmlFor="dinhDuong"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  3.5 Dinh dưỡng
                </label>
                <textarea
                  id="dinhDuong"
                  onChange={handleDinhduongChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={dinhduong || ""}
                />
              </div>
              {/* phatTrienTamThanVanDong */}
              <div>
                <label
                  htmlFor="phatTrienTamThanVanDong"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  3.6 Phát triển tâm thần vận động
                </label>
                <textarea
                  id="phatTrienTamThanVanDong"
                  onChange={handlePhatrientamthanvandongChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={phatrientamthanvandong || ""}
                />
              </div>
              {/* tiemChung */}
              <div>
                <label
                  htmlFor="tiemChung"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  3.7 Tiêm chủng
                </label>
                <textarea
                  id="tiemChung"
                  onChange={handleTiemchungChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={tiemchung || ""}
                />
              </div>
            </div>
          )}
          {activeTab === "khamtoanthan" && (
            <div className="relative overflow-x-auto">
              <label
                htmlFor="dhst"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                4.1 Dấu hiệu sinh tồn
              </label>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="mach"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mạch (lần/phút)
                  </label>
                  <input
                    type="text"
                    id="mach"
                    onChange={handleMachChange}
                    defaultValue={mach || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    // placeholder="110"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="huyetap"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Huyết áp (mmHg)
                  </label>
                  <input
                    type="text"
                    id="huyetap"
                    onChange={handleHuyetapChange}
                    defaultValue={huyetap || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    // placeholder="Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="nhietdo"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nhiệt độ (°C)
                  </label>
                  <input
                    type="text"
                    id="nhietdo"
                    onChange={handleNhietdoChange}
                    defaultValue={nhietdo || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    // placeholder="Flowbite"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="nhiptho"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nhịp thở (lần/phút)
                  </label>
                  <input
                    type="text"
                    id="nhiptho"
                    onChange={handleNhipthoChange}
                    defaultValue={nhiptho || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    // placeholder="Flowbite"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="cannang"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Cân nặng (kg)
                  </label>
                  <input
                    type="text"
                    id="cannang"
                    onChange={handleCannangChange}
                    defaultValue={cannang || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="chieucao"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Chiều cao (cm)
                  </label>
                  <input
                    type="text"
                    id="chieucao"
                    onChange={handleChieucaoChange}
                    defaultValue={chieucao || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}
          {activeTab === "khamcoquan" && (
            <div className="relative overflow-x-auto">
              {/* tim mach */}
              <div>
                <label
                  htmlFor="timmach"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  5.1 Tim mạch
                </label>
                <textarea
                  id="timmach"
                  onChange={handleTimmachChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={timmach || ""}
                />
              </div>
              {/* hô hấp */}
              <div>
                <label
                  htmlFor="hohap"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  5.2 Hô hấp
                </label>
                <textarea
                  id="hohap"
                  onChange={handleHohapChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={hohap || ""}
                />
              </div>
              {/* tiêu hóa */}
              <div>
                <label
                  htmlFor="tieuhoa"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  5.3 Tiêu hóa
                </label>
                <textarea
                  id="tieuhoa"
                  onChange={handleTieuhoaChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={tieuhoa || ""}
                />
              </div>
            </div>
          )}
          {activeTab === "tomtatbenhan" && (
            <div className="relative overflow-x-auto">
              {/* tom tat benh an */}
              <div>
                <label
                  htmlFor="tomtatbenhan"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  6. Tóm tắt bệnh án
                </label>
                <textarea
                  id="tomtatbenhan"
                  onChange={handleTomtatbenhanChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={tomtatbenhan || ""}
                />
              </div>
            </div>
          )}
          {activeTab === "chandoansobo" && (
            <div className="relative overflow-x-auto">
              {/* chan doan so bo*/}
              <div>
                <label
                  htmlFor="chandoansobo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  7. Chẩn đoán sơ bộ
                </label>
                <textarea
                  id="chandoansobo"
                  onChange={handleChandoansoboChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={chandoansobo || ""}
                />
              </div>
            </div>
          )}
          {activeTab === "chandoanxacdinh" && (
            <div className="relative overflow-x-auto">
              {/* chan doan xac dinh*/}
              <div>
                <label
                  htmlFor="chandoanxacdinh"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  8. Chẩn đoán xác định
                </label>
                <textarea
                  id="chandoanxacdinh"
                  onChange={handleChandoanxacdinhChange}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  defaultValue={chandoanxacdinh || ""}
                />
              </div>
            </div>
          )}
        </div>
        {showModal && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Bệnh án tim của bệnh nhi {patientInfo.name}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="staticModal"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      onClick={toggleModal}
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
                <div className="p-6 max-h-[calc(100vh-24rem)] overflow-y-auto">
                  <p className="block  text-xl font-medium text-gray-900 dark:text-white">
                    A, Hành chính:
                  </p>

                  <div className="block">
                    <p className="inline text-base font-medium text-gray-900 dark:text-white">
                      1, Họ và tên:{" "}
                    </p>
                    <p className="inline text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                      {patientInfo.name}
                    </p>
                  </div>

                  <div className="block">
                    <p className="inline text-base font-medium text-gray-900 dark:text-white">
                      2, Giới tính:{" "}
                    </p>
                    <p className="inline text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                      {patientInfo.gender &&
                        `${
                          patientInfo.gender.charAt(0).toUpperCase() +
                          patientInfo.gender.slice(1)
                        }`}
                    </p>
                  </div>

                  <div className="block">
                    <p className="inline text-base font-medium text-gray-900 dark:text-white">
                      3, Sinh ngày:{" "}
                    </p>
                    <p className="inline text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                      {new Date(patientInfo.birthday).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                  </div>

                  <div className="block">
                    <p className="inline text-base font-medium text-gray-900 dark:text-white">
                      4, Địa chỉ:{" "}
                    </p>
                    <p className="inline text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                      {patientInfo.address}
                    </p>
                  </div>

                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    5, Thông tin liên lạc:
                  </p>
                  <div className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {patientInfo.fatherName && (
                      <div className="text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                        Bố - {patientInfo.fatherName} -{" "}
                        {patientInfo.fatherContact}
                      </div>
                    )}
                    {patientInfo.motherName && (
                      <div className="text-sm font-normal leading-relaxed text-gray-900 dark:text-white">
                        Mẹ - {patientInfo.motherName} -{" "}
                        {patientInfo.motherContact}
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
                    {lydo}
                  </p>
                  <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                    2, Bệnh sử:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {benhsu}
                  </p>
                  <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                    3, Tiền sử:
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    3.1, Tiền sử sản khoa:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {tiensusankhoa}
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    3.2, Tiền sử bệnh tật:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {tiensubenhtat}
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    3.3, Tiền sử ngoại khoa:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {tiensungoaikhoa}
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    3.4, Tiền sử dị ứng:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {tiensudiung}
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    3.5, Dinh dưỡng:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {dinhduong}
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    3.6, Phát triển tâm thần vận động:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {phatrientamthanvandong}
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    3.7, Tiêm chủng:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {tiemchung}
                  </p>
                  <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                    4, Khám toàn thân:
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    4.1, Dấu hiệu sinh tồn:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    Mạch: {mach || "?"} (lần/phút), Huyết áp: {huyetap || "?"}{" "}
                    (mmHg), Nhiệt độ: {nhietdo || "?"}°C, Nhịp thở:{" "}
                    {nhiptho || "?"} (lần/phút), Cân nặng: {cannang || "?"}kg,
                    Chiều cao: {chieucao || "?"}cm
                  </p>
                  <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                    5, Khám cơ quan:
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    5.1, Tim mạch:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {timmach}
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    5.2, Hô hấp:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {hohap}
                  </p>
                  <p className="block  text-base font-medium text-gray-900 dark:text-white">
                    5.3, Tiêu hóa:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {tieuhoa}
                  </p>
                  <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                    6, Tóm tắt bệnh án:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {tomtatbenhan}
                  </p>
                  <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                    7, Chẩn đoán sơ bộ:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {chandoansobo}
                  </p>
                  <p className="block  text-lg font-medium text-gray-900 dark:text-white">
                    8, Chẩn đoán xác định:
                  </p>
                  <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
                    {chandoanxacdinh}
                  </p>
                </div>
                {/* Modal footer */}
                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    onClick={sendToHospital}
                    data-modal-hide="staticModal"
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Gửi đến bệnh viện
                  </button>
                  <button
                    onClick={toggleModal}
                    data-modal-hide="staticModal"
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecord;
