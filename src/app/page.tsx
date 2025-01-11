"use client";

import { QrCodeReader } from "./components";
import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Home() {
  const [scannedData, setScannedData] = useState(""); // Scanned data
  const [userExists, setUserExists] = useState<boolean | null>(null); // Track if user exists

  const checkUserInDatabase = async (email: string) => {
    try {
      const usersCollection = collection(db, "users"); // Replace "users" with your collection name
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
    <main className="w-screen flex min-h-screen flex-col items-center p-4">
      <QrCodeReader onScan={(data: string) => setScannedData(data)} />

      {scannedData && (
        <div className="mt-4 p-4 bg-white shadow rounded text-center">
          <p className="text-lg font-semibold">Scanned Data:</p>
          <p className="text-gray-700">{scannedData}</p>
        </div>
      )}

      {userExists !== null && (
        <div className="mt-4 p-4 bg-white shadow rounded text-center">
          {userExists ? (
            <p className="text-green-600">User found in the database!</p>
          ) : (
            <p className="text-red-600">User not found in the database.</p>
          )}
        </div>
      )}
    </main>
  );
}
