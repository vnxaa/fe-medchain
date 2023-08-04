import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Datepicker from "tailwind-datepicker-react";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import Navigation from "../Common/Navigation";
const Settings = () => {
  const router = useRouter();
  const [staffId, setStaffId] = useState("");
  const [staffInfo, setStaffInfo] = useState({});
  const [options, setOptions] = useState({});
  const [activeTab, setActiveTab] = useState("password");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState(false);
  const [successPic, setSuccessPic] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  const handleClose = () => {
    setShow(!show);
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    // Validate the new password and repeat password match
    if (newPassword !== repeatNewPassword) {
      alert("Mật khẩu mới phải khớp với nhau, vui lòng nhập lại");
      return;
    }
    try {
      // Your form data to be sent in the request body
      setLoading(true);
      const formData = {
        currentPassword: oldPassword,
        newPassword,
      };
      // Make the API call using Axios
      const response = await axios.put(
        `${process.env.service}/api/staff/update-password/${staffId}`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      setSuccess(true);
      // Handle the response from the API
      console.log("Password updated successfully:", response.data);
      setTimeout(() => {
        router.push("/Staff/LoginPage");
      }, 2000);
      // You can also show a success message to the user or redirect them to another page
    } catch (err) {
      console.error("Error updating password:", err);
      setError(err.response.data);
      setSuccess(false);
      // Handle any errors that occurred during the API call
      // Show an error message to the user or handle the error as needed
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Your form data to be sent in the request body
      setLoading(true);
      const formData = {
        name: fullName,
        address,
        gender,
        contactNumber: phoneNumber,
        citizenId,
        email,
        birthday: selectedDate,
      };
      console.log(formData);
      // Make the API call using Axios
      const response = await axios.put(
        `${process.env.service}/api/staff/${staffId}`,
        formData
      );

      // Update token in localStorage
      localStorage.setItem("token", response.data.token);
      setSuccess(true);
      // Handle the response from the API
      console.log("Updated staff information:", response.data);
      setTimeout(() => {
        router.push("/Staff/LoginPage");
      }, 2000);
      // You can also show a success message to the user or redirect them to another page
    } catch (err) {
      console.error("Error updating staff information:", err);
      // Handle any errors that occurred during the API call
      // Show an error message to the user or handle the error as needed
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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

          setStaffInfo(decoded?.user);
          setStaffId(decoded?.user?._id);
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
    setFullName(staffInfo?.name || "");
    setAddress(staffInfo?.address || "");
    setGender(staffInfo?.gender || "");
    setPhoneNumber(staffInfo?.contactNumber || "");
    setCitizenId(staffInfo?.citizenId || "");
    setEmail(staffInfo?.email || "");
    setSelectedDate(staffInfo?.birthday || "");
  }, [staffInfo]);
  const handleUpdateStaffPicture = async (event) => {
    // Your logic to handle the file upload goes here
    const picture = event.target.files[0];
    if (!picture) {
      console.error("No file selected.");
      return;
    }
    const filename = `${v4()}_${picture.name}`;
    const storageRef = ref(storage, `image/staff/${filename}`);
    const metadata = {
      contentType: "image/png",
    };
    await uploadBytes(storageRef, picture, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    axios
      .put(`${process.env.service}/api/staff/update-picture/${staffId}`, {
        picture: downloadURL,
      })
      .then((response) => {
        console.log("Picture update success:", response.data);
        localStorage.setItem("token", response.data.token);
        setSuccessPic(true);
        setTimeout(() => {
          router.push("/Staff/LoginPage");
        }, 2000);
        // Perform any additional actions or updates after successful picture update
      })
      .catch((error) => {
        console.error("Picture update error:", error);
        // Handle error scenario, show error messages, etc.
      });
  };

  useEffect(() => {
    // Set the options with a timeout of 2 seconds

    if (staffInfo?.birthday !== undefined) {
      setOptions({
        maxDate: new Date("2030-01-01"),
        minDate: new Date("1950-01-01"),
        language: "vi",
        title: "Chọn ngày sinh",
        defaultDate: new Date(staffInfo?.birthday),
      });
    }
  }, [staffInfo?.birthday]);

  return (
    <div>
      <Navigation />

      <div className="sm:container sm:mx-auto">
        <div className="flex flex-wrap justify-center ">
          <div className="">
            <div className="sm:container mb-2 sm:mx-auto flex flex-col items-center">
              <div className="w-40 h-62 mb-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="relative inline-block">
                  {staffInfo.picture ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="fileInput"
                        onChange={handleUpdateStaffPicture}
                      />
                      <img
                        src={staffInfo.picture}
                        alt="staff"
                        className="rounded-full object-cover w-36 h-auto"
                      />
                      <div
                        onClick={() => {
                          const fileInput =
                            document.getElementById("fileInput");
                          fileInput.click();
                        }}
                        style={{ cursor: "pointer" }}
                        className="absolute hover:bg-white hover:bg-opacity-5 top-0 h-full w-full bg-black rounded-full bg-opacity-25 flex items-center justify-center"
                      >
                        <svg
                          className="w-6 h-6 text-white dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 18"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                          />
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 3h-2l-.447-.894A2 2 0 0 0 12.764 1H7.236a2 2 0 0 0-1.789 1.106L5 3H3a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2Z"
                          />
                        </svg>
                      </div>
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
                  )}
                </div>
                <p className="font-medium text-center ">{staffInfo?.name}</p>

                <p
                  style={{ wordWrap: "break-word" }}
                  className="text-center mb-2 font-light italic"
                >
                  @{staffInfo?.username}
                </p>
                <div className="flex items-center justify-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    Nhân viên
                  </span>
                </div>
              </div>
              {successPic && (
                <>
                  <div
                    className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                    role="alert"
                  >
                    <svg
                      className="flex-shrink-0 inline w-4 h-4 mr-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                      <span className="font-medium">
                        Cập nhật ảnh thành công, vui lòng đăng nhập lại
                      </span>
                    </div>
                  </div>
                </>
              )}
              <ul className="flex flex-wrap text-sm font-medium text-center border border-gray-200 rounded-lg  shadow text-gray-500 dark:text-gray-400">
                <li className="">
                  <a
                    href="#"
                    className={`inline-block px-4 py-3 rounded-lg ${
                      activeTab === "profile"
                        ? "text-white bg-blue-600"
                        : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                    onClick={() => handleTabClick("profile")}
                  >
                    Hồ sơ
                  </a>
                </li>
                <li className="">
                  <a
                    onClick={() => handleTabClick("password")}
                    href="#"
                    className={`inline-block px-4 py-3 rounded-lg ${
                      activeTab === "password"
                        ? "text-white bg-blue-600"
                        : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    Mật khẩu
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full sm:w-1/2 sm:pl-2">
            {activeTab === "profile" && (
              <>
                <div className="max-w-full   p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <p className="font-medium mb-2 text-lg">Hồ sơ cá nhân</p>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="flex flex-wrap mb-2">
                      <div className="flex flex-col p-2  w-full sm:w-1/2">
                        <label
                          htmlFor="fullname"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled
                        />
                      </div>
                      <div className="flex flex-col p-2  w-full sm:w-1/2">
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          id="address"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex flex-col p-2  w-full sm:w-1/2">
                        <label
                          htmlFor="gender"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Giới tính
                        </label>
                        <select
                          id="gender"
                          value={gender}
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          onChange={(e) => setGender(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Chọn giới tính
                          </option>
                          <option
                            value="nam"
                            defaultValue={staffInfo?.gender === "nam"}
                          >
                            Nam
                          </option>
                          <option
                            value="nữ"
                            defaultValue={staffInfo?.gender === "nữ"}
                          >
                            Nữ
                          </option>
                        </select>
                      </div>
                      <div className="flex flex-col p-2  w-full sm:w-1/2">
                        <label
                          htmlFor="phoneNumber"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          id="phoneNumber"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col p-2  w-full sm:w-1/2">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex flex-col p-2  w-full sm:w-1/2">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Ngày sinh
                        </label>
                        <Datepicker
                          options={options}
                          show={show}
                          setShow={handleClose}
                          onChange={handleDateSelect}
                        />
                      </div>

                      <div className="flex flex-col p-2  w-full sm:w-1/2">
                        <label
                          htmlFor="citizenId"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Căn cước công dân
                        </label>
                        <input
                          type="text"
                          id="citizenId"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          value={citizenId}
                          onChange={(e) => setCitizenId(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {loading ? (
                      <>
                        {" "}
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
                      <button
                        type="submit"
                        className="text-white mb-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Cập nhật
                      </button>
                    )}
                    {error && (
                      <>
                        <div
                          className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                          role="alert"
                        >
                          <svg
                            className="flex-shrink-0 inline w-4 h-4 mr-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>Có lỗi xảy ra, vui lòng thử lại</div>
                        </div>
                      </>
                    )}
                    {success && (
                      <>
                        <div
                          className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                          role="alert"
                        >
                          <svg
                            className="flex-shrink-0 inline w-4 h-4 mr-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">
                              Cập nhật thông tin thành công
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              </>
            )}
            {activeTab === "password" && (
              <>
                <div className="flex ">
                  <div className="w-96 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <p className="font-medium mb-2 text-lg">Đổi mật khẩu</p>
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-6">
                        <label
                          htmlFor="oldpassword"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Mật khẩu cũ
                        </label>
                        <input
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          type="password"
                          id="oldpassword"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          required
                        />
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="newpassword"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Mật khẩu mới
                        </label>
                        <input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          type="password"
                          id="newpassword"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          required
                        />
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="repeat-newpassword"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Nhập lại mật khẩu mới
                        </label>
                        <input
                          value={repeatNewPassword}
                          onChange={(e) => setRepeatNewPassword(e.target.value)}
                          type="password"
                          id="repeat-newpassword"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          required
                        />
                      </div>
                      {loading ? (
                        <>
                          {" "}
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
                            type="submit"
                            className="text-white mb-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Đổi mật khẩu
                          </button>
                        </>
                      )}
                      {error && (
                        <>
                          <div
                            className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                            role="alert"
                          >
                            <svg
                              className="flex-shrink-0 inline w-4 h-4 mr-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>Mật khẩu không chính xác</div>
                          </div>
                        </>
                      )}
                      {success && (
                        <>
                          <div
                            className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                            role="alert"
                          >
                            <svg
                              className="flex-shrink-0 inline w-4 h-4 mr-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium">
                                Đổi mật khẩu thành công
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
