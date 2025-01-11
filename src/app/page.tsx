"use client";

import { QrCodeReader } from "./components";
import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const [scannedData, setScannedData] = useState(""); // Scanned data
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

  // Process scanned data
  useEffect(() => {
    if (scannedData) {
      const email = scannedData.split(",")[0]?.trim(); // Extract email from scanned data
      checkUserInDatabase(email);
    }
  }, [scannedData]);

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
        width={300}
        height={300}
        objectFit="contain"
        priority
        className="z-20"
      />
      <p className="text-white mt-4 z-10">
        Scan a visitor's barcode to verify their access.
      </p>

      <QrCodeReader onScan={(data: string) => setScannedData(data)} />

      {scannedData && (
        <div className="mt-4 p-4 bg-white shadow-lg rounded text-center max-w-md w-full z-20">
          <h2 className="text-lg font-semibold text-gray-800">Scanned Data</h2>
          <p className="text-gray-700">{scannedData}</p>
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
    </main>
  );
}
