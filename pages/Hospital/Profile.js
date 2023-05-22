import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navigation from "../Common/Navigation";
const Profile = () => {
  const router = useRouter();
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
  }, []);

  return (
    <div>
      <Navigation />
      <h1>Profile Page</h1>
      {/* Add your page content here */}
    </div>
  );
};

export default Profile;
