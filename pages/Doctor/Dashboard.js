import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navigation from "../Common/Navigation";
const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwt_decode(token);
        console.log(decoded);

        // Check if the user is a doctor
        if (decoded.doctor) {
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
  }, []);

  return (
    <div>
      <Navigation />
      <h1>Doctor Page</h1>
      {/* Add your page content here */}
    </div>
  );
};

export default Dashboard;
