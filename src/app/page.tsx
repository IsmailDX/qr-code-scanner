"use client";

import { QrCodeReader } from "./components";
import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Head from "next/head";
import * as XLSX from "xlsx"; // Import xlsx for working with Excel files

export default function Home() {
  const [scannedData, setScannedData] = useState(""); // Scanned data
  const [visitorName, setVisitorName] = useState(""); // Visitor's name
  const [visitorCompany, setVisitorCompany] = useState(""); // Visitor's company name
  const [userExists, setUserExists] = useState<boolean | null>(null); // Track if user exists
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [scannedVisitors, setScannedVisitors] = useState<any[]>([]); // Store all scanned visitors
  const [showPasswordModal, setShowPasswordModal] = useState(false); // To show the password modal
  const [password, setPassword] = useState(""); // Password input state
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false); // To check if the password is correct

  const checkUserInDatabase = async (email: string) => {
    setIsLoading(true); // Start loading
    try {
      const usersCollection = collection(db, "Users");
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      // Check if any documents were returned
      if (!querySnapshot.empty) {
        setUserExists(true); // User exists in the database
      } else {
        setUserExists(false); // User does not exist in the database
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Process scanned data
  useEffect(() => {
    if (scannedData) {
      const [email, name, visitorType, companyName] = scannedData
        .split(",")
        .map((item) => item.trim()); // Extract email, name, visitor type, and company
      setVisitorName(name); // Set visitor name
      setVisitorCompany(companyName); // Set visitor company

      // Get the current date and time
      const currentDateTime = new Date().toLocaleString();

      // Check if visitor already exists in the scannedVisitors array by email
      setScannedVisitors((prev) => {
        // If the email doesn't exist in the array, add the new visitor with date and time
        if (!prev.some((visitor) => visitor.email === email)) {
          return [
            ...prev,
            {
              email,
              name,
              company: companyName,
              visitorType,
              dateTime: currentDateTime, // Add date and time
            },
          ]; // Add new scanned visitor to the list
        }
        return prev; // Return the existing list without duplicates
      });

      checkUserInDatabase(email);
    }
  }, [scannedData]);

  // Function to handle Excel file export
  const exportToExcel = () => {
    // Remove duplicates based on email
    const uniqueVisitors = Array.from(
      new Map(
        scannedVisitors.map((visitor) => [visitor.email, visitor])
      ).values()
    );

    const data = [
      ["Email", "Name", "Company", "Date and Time"], // Column headers
      ...uniqueVisitors.map((visitor) => [
        visitor.email,
        visitor.name,
        visitor.company,
        visitor.dateTime, // Include the date and time
      ]), // All scanned visitors data
    ];

    // Create a new workbook and add the data
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visitors");

    // Export the Excel file
    XLSX.writeFile(wb, "Scanned_Visitors.xlsx");
  };

  // Function to handle password validation
  const handlePasswordSubmit = () => {
    const correctPassword = "Aldrich@2796"; // Predefined correct password
    if (password === correctPassword) {
      setIsPasswordCorrect(true);
      setShowPasswordModal(false);
      exportToExcel();
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <main className="w-screen flex min-h-screen flex-col items-center p-6 bg-gray-100 relative">
      <Head>
        <title>Mecoc 2025 QR Scan</title>
      </Head>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="absolute inset-0 z-0 blur-sm">
        <Image
          src="/bg.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <Image
        src="/mecoc-logo.png"
        alt="logo"
        width={200}
        height={200}
        objectFit="contain"
        priority
        className="z-20"
      />
      <p className="text-white mt-4 z-10 text-center">
        Scan a visitor's barcode to verify their access.
      </p>

      <QrCodeReader onScan={(data: string) => setScannedData(data)} />

      {visitorName && (
        <div className="mt-4 px-4 py-2 bg-white shadow-lg rounded text-center max-w-md w-full z-20">
          <h2 className="text-lg font-semibold text-gray-800">Welcome</h2>
          <p className="text-gray-700 text-lg">Hello {visitorName}!</p>
        </div>
      )}

      {isLoading ? (
        <div className="mt-4 p-4 bg-blue-100 shadow-lg rounded text-center max-w-md w-full z-20">
          <p className="text-blue-600 font-medium">
            Verifying user, please wait...
          </p>
        </div>
      ) : (
        userExists !== null && (
          <div
            className={`mt-4 p-4 shadow-lg rounded text-center max-w-md w-full z-20 ${
              userExists ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {userExists ? (
              <p className="text-green-600 font-medium text-lg z-20">
                ✅ User found! Access granted.
              </p>
            ) : (
              <p className="text-red-600 font-medium text-lg z-20">
                ❌ User not found! Access denied.
              </p>
            )}
          </div>
        )
      )}

      <button
        onClick={() => setShowPasswordModal(true)} // Show the password modal
        className="mt-6 px-4 py-2 bg-[#aa532c] text-white rounded shadow-lg z-20"
      >
        People Scanned
      </button>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl mb-4">Enter Password</h3>
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={handlePasswordSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
