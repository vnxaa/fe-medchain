import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { v4 } from "uuid";
import { storage } from "../../firebase";
import Navigation from "../Common/Navigation";
const Settings = () => {
  const [hospitalInfo, setHospitalInfo] = useState("");
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [successPic, setSuccessPic] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState("profile");
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Your form data to be sent in the request body
      setLoading(true);
      const formData = {
        name,
        address,
        gender,
        contactNumber,
        citizenId,
        email,
        birthday,
      };
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
      setError(err.response.data);
      setSuccess(false);
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
        setHospitalInfo(decoded.hospital);
        console.log(decoded);

        // Check if the user is a hospital
        if (decoded.hospital) {
          // User is a hospital, allow access to the hospital page
          console.log("Access granted to hospital page");
        } else {
          // User is not a hospital, redirect to another page or show an error message
          console.log("Access denied. User is not a hospital");
          router.push("../Common/Permission");
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
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!picture) {
      console.error("No file selected.");
      return;
    }

    const filename = `${v4()}_${picture.name}`;
    const storageRef = ref(storage, `image/hospital/${filename}`);
    const metadata = {
      contentType: "image/png",
    };
    await uploadBytes(storageRef, picture, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    const token = localStorage.getItem("token");
    const hospitalId = jwt_decode(token).hospital._id;

    // Make a PUT request to update the hospital's data
    axios
      .put(`${process.env.service}/api/hospital/update/${hospitalId}`, {
        name,
        email,
        picture: downloadURL,
        address,
        contactNumber,
      })
      .then((response) => {
        console.log("Hospital data updated successfully");
        // Optionally, you can redirect the user to another page or show a success message
        router.push("./Profile");
      })
      .catch((error) => {
        console.error("Failed to update hospital data:", error);
        // Handle error, show an error message to the user, etc.
      });
  };
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
        // Perform any additional actions or updates after successful picture update
      })
      .catch((error) => {
        console.error("Picture update error:", error);
        // Handle error scenario, show error messages, etc.
      });
  };
  useEffect(() => {
    setFullName(hospitalInfo?.name || "");
    setAddress(hospitalInfo?.address || "");

    setPhoneNumber(hospitalInfo?.phoneNumber || "");

    setEmail(hospitalInfo?.email || "");
  }, [hospitalInfo]);
  return (
    <div>
      <Navigation />
      {/* <form
        className="sm:container center sm:mx-auto"
        style={{ maxWidth: "650px" }}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tên bệnh viện
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={hospitalInfo.name || ""}
                      onChange={handleNameChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Ảnh
                </label>
                {picture && (
                  <div
                    id="toast-default"
                    className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                    role="alert"
                  >
                    <div className="ml-3 text-sm font-normal">
                      {picture && <p>Uploaded Picture: {picture.name}</p>}
                    </div>
                  </div>
                )}

                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handlePictureChange}
                        />
                      </label>
                      <div></div>
                      <p className="pl-1">or drag and drop </p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      defaultValue={hospitalInfo.email || ""}
                      onChange={handleEmailChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Số điện thoại
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      defaultValue={hospitalInfo.phoneNumber || ""}
                      onChange={handleContactNumberChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Địa chỉ
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      defaultValue={hospitalInfo.address || ""}
                      onChange={handleAddressChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form> */}
      <div className="sm:container sm:mx-auto">
        <div className="flex flex-wrap justify-center ">
          <div className="">
            <div className="sm:container mb-2 sm:mx-auto flex flex-col items-center">
              <div className="w-40 h-62 mb-2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="relative inline-block">
                  {hospitalInfo.picture ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="fileInput"
                        onChange={handleUpdateStaffPicture}
                      />
                      <img
                        src={hospitalInfo.picture}
                        alt="staff"
                        className="rounded-full object-cover w-36 h-auto"
                      />
                      <div
                        // onClick={() => {
                        //   const fileInput =
                        //     document.getElementById("fileInput");
                        //   fileInput.click();
                        // }}
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
                <p className="font-medium text-center ">{hospitalInfo?.name}</p>

                <p className="text-center mb-2 font-light italic"></p>
                <div className="flex items-center justify-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    Bệnh viện
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
              </ul>
            </div>
          </div>
          <div className="w-full sm:w-1/2 sm:pl-2">
            {activeTab === "profile" && (
              <>
                <div className="max-w-full   p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <p className="font-medium mb-2 text-lg">
                    Thông tin bệnh viện
                  </p>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="flex flex-wrap mb-2">
                      <div className="flex flex-col p-2  w-full sm:w-1/2">
                        <label
                          htmlFor="fullname"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Tên bệnh viện
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
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
                        {/* <button
                          type="submit"
                          className="text-white mb-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Cập nhật
                        </button> */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
