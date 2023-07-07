import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import Navigation from "../Common/Navigation";
const Settings = () => {
  const router = useRouter();
  const [patientInfo, setPatientInfo] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [picture, setPicture] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [motherContact, setMotherContact] = useState("");
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);
        setPatientInfo(decoded.patient);
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
  const handleFatherNameChange = (e) => {
    setFatherName(e.target.value);
  };

  const handleMotherNameChange = (e) => {
    setMotherName(e.target.value);
  };

  const handleFatherContactChange = (e) => {
    setFatherContact(e.target.value);
  };

  const handleMotherContactChange = (e) => {
    setMotherContact(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setPicture(file); // Update the picture state with the file
  };

  const handleBirthdayChange = (e) => {
    setBirthday(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleContactNumberChange = (e) => {
    setContactNumber(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!picture) {
      console.error("No file selected.");
      return;
    }

    const filename = `${v4()}_${picture.name}`;
    const storageRef = ref(storage, `image/patient/${filename}`);
    const metadata = {
      contentType: "image/png",
    };
    await uploadBytes(storageRef, picture, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    const token = localStorage.getItem("token");
    const patientId = jwt_decode(token)?.patient?._id;

    // Make a PUT request to update the patient's data
    axios
      .put(`${process.env.service}/api/patient/update/${patientId}`, {
        name,
        gender,
        picture: downloadURL,
        birthday,
        address,
        fatherName,
        motherName,
        fatherContact,
        motherContact,
      })
      .then((response) => {
        console.log("Patient data updated successfully");
        // Optionally, you can redirect the user to another page or show a success message
        router.push("./Profile");
      })
      .catch((error) => {
        console.error("Failed to update patient data:", error);
        // Handle error, show an error message to the user, etc.
      });
  };

  return (
    <div>
      <Navigation />
      <form
        className="sm:container  center sm:mx-auto"
        style={{ maxWidth: "650px" }}
        onSubmit={handleSubmit}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Họ và tên bệnh nhân
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      required
                      type="text"
                      name="name"
                      id="name"
                      onChange={handleNameChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="faname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Họ và tên bố
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      required
                      type="text"
                      name="faname"
                      id="faname"
                      onChange={handleFatherNameChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="moname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Họ và tên mẹ
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      required
                      type="text"
                      name="moname"
                      id="moname"
                      onChange={handleMotherNameChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Giới tính
                </label>
                <div className="mt-2">
                  <select
                    required
                    id="gender"
                    name="gender"
                    defaultValue={"DEFAULT"}
                    onChange={handleGenderChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="DEFAULT" disabled>
                      Chọn giới tính
                    </option>
                    <option value={"nam"}>Nam</option>
                    <option value={"nữ"}>Nữ</option>
                  </select>
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
                  htmlFor="faphoneNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Số điện thoại bố
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      required
                      type="text"
                      name="faphoneNumber"
                      id="faphoneNumber"
                      onChange={handleFatherContactChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="mophoneNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Số điện thoại mẹ
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      required
                      type="text"
                      name="mophoneNumber"
                      id="mophoneNumber"
                      onChange={handleMotherContactChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="birthday:"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Ngày sinh
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      required
                      type="date"
                      name="birthday:"
                      id="birthday:"
                      onChange={handleBirthdayChange}
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
                      required
                      type="text"
                      name="address"
                      id="address"
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
      </form>
    </div>
  );
};

export default Settings;
