"use client";

import { QrCodeReader } from "../components";
import { useEffect, useState } from "react";
import { db } from "@/app/config/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [scannedData, setScannedData] = useState(""); // Scanned data
  const [visitorName, setVisitorName] = useState(""); // Visitor's name
  const [visitorCompany, setVisitorCompany] = useState(""); // Visitor's company name
  const [visitorType, setVisitorType] = useState(""); // Visitor type
  const [userExists, setUserExists] = useState<boolean | null>(null); // Track if user exists
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message

  const resetVisitorDetails = () => {
    setVisitorName("");
    setVisitorCompany("");
    setVisitorType("");
    setUserExists(null);
    setErrorMessage("");
  };

  const checkUserInDatabase = async (email: string) => {
    setIsLoading(true); // Start loading
    try {
      const usersCollection = collection(db, "Users");
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      setUserExists(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking user in database:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const saveVisitorToFirebase = async (
    email: string,
    name: string,
    company: string,
    dateTime: string
  ) => {
    try {
      const scannedPeopleCollection = collection(db, "ScannedPeople");
      const q = query(scannedPeopleCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(scannedPeopleCollection, {
          email,
          name,
          company,
          dateAndTime: dateTime,
        });
        console.log("Visitor saved successfully!");
      } else {
        console.log("Duplicate entry: Visitor already exists.");
      }
    } catch (error) {
      console.error("Error saving visitor to Firebase:", error);
    }
  };

  useEffect(() => {
    if (scannedData) {
      resetVisitorDetails(); // Reset previous details
      const lowerCaseData = scannedData.toLowerCase();
      const containsRestrictedWords =
        lowerCaseData.includes("visitor") ||
        lowerCaseData.includes("media user");

      if (containsRestrictedWords) {
        setErrorMessage(
          "Access not allowed. Scanned QR belongs to 'Visitor' or 'Media User'."
        );
        return;
      }

      const [email, name, type, company] = scannedData
        .split(",")
        .map((item) => item.trim());

      if (!email || !name || !type || !company) {
        setErrorMessage("Invalid QR code data. Please scan a valid QR code.");
        return;
      }

      setVisitorName(name);
      setVisitorCompany(company);
      setVisitorType(type);

      const currentDateTime = new Date().toLocaleString();
      saveVisitorToFirebase(email, name, company, currentDateTime);
      checkUserInDatabase(email);
    }
  }, [scannedData]);

  return (
    <main className="w-screen flex min-h-screen flex-col items-center p-6 bg-gray-100 relative">
      <Head>
        <title>Conference Hall QR Scan</title>
      </Head>

      {/* Overlay and Background */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="absolute inset-0 z-0 blur-sm">
        <Image src="/bg.jpg" alt="Background" fill objectFit="cover" priority />
      </div>

      {/* Logo */}
      <Image
        src="/mecoc-logo.png"
        alt="logo"
        width={200}
        height={200}
        objectFit="contain"
        priority
        className="z-20"
      />

      {/* Home Button */}
      <Link href="/" className="w-full max-w-[400px] z-20">
        <p
          className="text-white mt-7 bg-[#186e5a] hover:bg-[#32947d] text-center max-sm:mb-3 border border-white 
        rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold z-20 max-w-[400px]"
        >
          Home
        </p>
      </Link>

      {/* QR Code Reader */}
      <QrCodeReader onScan={(data: string) => setScannedData(data)} />

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 shadow-lg rounded text-center max-w-md w-full z-20">
          <p className="text-red-600 font-medium text-lg">❌ {errorMessage}</p>
          <div className="h-[1px] w-full bg-black my-3"/>
          <p className="text-gray-700">Data:  {scannedData}!</p>
        </div>
      )}

      {/* Visitor Details */}
      {visitorName && !errorMessage && (
        <div className="mt-4 px-4 py-2 bg-white shadow-lg rounded text-center max-w-md w-full z-20">
          <h2 className="text-lg font-semibold text-gray-800">Welcome</h2>
          <p className="text-gray-700 text-lg">Hello {visitorName}!</p>
        </div>
      )}

      {/* User Status */}
      {isLoading ? (
        <div className="mt-4 p-4 bg-blue-100 shadow-lg rounded text-center max-w-md w-full z-20">
          <p className="text-blue-600 font-medium">
            Verifying user, please wait...
          </p>
        </div>
      ) : (
        userExists !== null &&
        !errorMessage && (
          <div
            className={`mt-4 p-4 shadow-lg rounded text-center max-w-md w-full z-20 ${
              userExists ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {userExists ? (
              <p className="text-green-600 font-medium text-base">
                ✅ User found! Access granted.
                <div className="h-[1px] w-full bg-black my-3"/>
                <p className="text-gray-700">Data:  {scannedData}!</p>
              </p>
            ) : (
              <p className="text-red-600 font-medium text-base">
                ❌ User not found! Access denied.
                <div className="h-[1px] w-full bg-black my-3"/>
                <p className="text-gray-700">Data:  {scannedData}!</p>
              </p>
            )}
          </div>
        )
      )}
    </main>
  );
}