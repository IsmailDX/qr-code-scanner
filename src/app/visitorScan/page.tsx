"use client";

import { QrCodeReader } from "../components";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [scannedData, setScannedData] = useState(""); // Scanned data
  const [visitorName, setVisitorName] = useState(""); // Visitor's name
  const [visitorCompany, setVisitorCompany] = useState(""); // Visitor's company name
  const [userExists, setUserExists] = useState<boolean | null>(null); // Track if user exists
  const [isLoading, setIsLoading] = useState(false); // Loading state

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

  const saveVisitorToFirebase = async (
    email: string,
    name: string,
    company: string,
    dateTime: string
  ) => {
    try {
      const scannedPeopleCollection = collection(db, "ScannedPeople");

      // Query the collection to check for existing records with the same email
      const q = query(scannedPeopleCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If no matching records found, add the new visitor
        await addDoc(scannedPeopleCollection, {
          email,
          name,
          company,
          dateAndTime: dateTime, // Save the current date and time
        });
        console.log("Visitor saved to Firebase successfully!");
      } else {
        console.log(
          "Duplicate entry detected. Visitor already exists in Firebase."
        );
      }
    } catch (error) {
      console.error("Error saving visitor to Firebase:", error);
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

      // Save the visitor to Firebase
      saveVisitorToFirebase(email, name, companyName, currentDateTime);

      // Check if the visitor exists in the Users collection
      checkUserInDatabase(email);
    }
  }, [scannedData]);

  return (
    <main className="w-screen flex min-h-screen flex-col items-center p-6 bg-gray-100 relative">
      <Head>
        <title>Visitor QR Scan</title>
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
      <Link href="/" className="w-full max-w-[400px] z-20">
        <p
          className="text-white mt-7 bg-[#186e5a] hover:bg-[#32947d] text-center max-sm:mb-3 border border-white 
        rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold z-20 max-w-[400px]"
        >
          Home
        </p>
      </Link>

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
              <p className="text-green-600 font-medium text-base z-20">
                ✅ User found! Access granted.
              </p>
            ) : (
              <p className="text-red-600 font-medium text-base z-20">
                ❌ User not found! Access denied.
              </p>
            )}
          </div>
        )
      )}
    </main>
  );
}
