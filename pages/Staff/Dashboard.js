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

        // Check if the user is a patient
        if (decoded.user.role == "staff") {
          // User is a patient, allow access to the patient page
          console.log("Access granted to staff page");
        } else {
          router.push("/Staff/LoginPage");
          // User is not a patient, redirect to another page or show an error message
          console.log("Access denied. User is not a staff");
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

  return (
    <div>
      <Navigation />
      <div className="sm:container sm:mx-auto">
        <p>Dashboard page</p>
      </div>
    </div>
  );
};

export default Dashboard;
