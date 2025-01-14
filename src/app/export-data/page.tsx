"use client";
import Image from "next/image";
import Head from "next/head";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // Adjust the path to your Firebase config
import ExcelJS from "exceljs";

export default function Export() {
  const collections = {
    visitors: collection(db, "ScannedPeople"),
    corrosion: collection(db, "CorrosionScannedPeople"),
    futureSteel: collection(db, "FutureSteelScannedPeople"),
    nonMetallic: collection(db, "NonMetallicScannedPeople"),
    lunchArea: collection(db, "LunchScannedPeople"),
  };

  //@ts-ignore
  const generateExcel = async (collectionRef, title) => {
    try {
      // Fetch data from Firestore
      const querySnapshot = await getDocs(collectionRef);

      // Initialize Excel workbook and sheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(title);

      // Add header row
      worksheet.addRow(["Company", "Date and Time", "Email", "Name"]);

      // Add rows from Firestore data
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        worksheet.addRow([
             //@ts-ignore
          data.company,
           //@ts-ignore
          data.dateAndTime,
           //@ts-ignore
          data.email,
           //@ts-ignore
          data.name,
        ]);
      });

      // Style the header row
      worksheet.getRow(1).font = { bold: true };

      // Generate Excel file as a Blob
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      // Trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.xlsx`;
      link.click();
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  return (
    <main className="w-screen flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 relative">
      <Head>
        <title>Export Mecoc Data</title>
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
      <p className="text-white mt-4 border-white text-lg capitalize z-10 font-bold">
        Export Mecoc Data
      </p>
      <div className="w-full z-10 max-w-[500px]">
        <p
          onClick={() => generateExcel(collections.visitors, "Visitors Data")}
          className="text-white mt-4 bg-[#a85b31] hover:bg-[#c56c3c] text-center max-sm:mb-3 border border-white rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold capitalize"
        >
          Visitors Data
        </p>
        <div className="h-[1px] w-full my-3 bg-white" />
        <p
          onClick={() => generateExcel(collections.corrosion, "Corrosion Data")}
          className="text-white mt-4 bg-[#186e5a] hover:bg-[#32947d] text-center max-sm:mb-3 border border-white rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold capitalize"
        >
          Corrosion and Coatings Data
        </p>
        <p
          onClick={() =>
            generateExcel(collections.futureSteel, "Future Steel Data")
          }
          className="text-white mt-4 bg-[#186e5a] hover:bg-[#32947d] text-center max-sm:mb-3 border border-white rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold capitalize"
        >
          Future Steel Data
        </p>
        <p
          onClick={() =>
            generateExcel(collections.nonMetallic, "Non Metallic Data")
          }
          className="text-white mt-4 bg-[#186e5a] hover:bg-[#32947d] text-center max-sm:mb-3 border border-white rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold capitalize"
        >
          Non Metallic Data
        </p>
        <div className="h-[1px] my-3 w-full bg-white" />
        <p
          onClick={() =>
            generateExcel(collections.lunchArea, "Lunch Area Data")
          }
          className="text-white mt-4 bg-[#a85b31] hover:bg-[#c56c3c] text-center max-sm:mb-3 border border-white rounded-full px-4 py-2 w-full transition-all ease-in-out duration-200 cursor-pointer font-semibold capitalize"
        >
          Lunch Area Data
        </p>
      </div>
    </main>
  );
}
