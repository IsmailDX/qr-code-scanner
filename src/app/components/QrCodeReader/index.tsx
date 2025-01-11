"use client";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

export const QrCodeReader = ({
  onScan,
}: {
  onScan: (data: string) => void;
}) => {
  const [data, setData] = useState("No result");

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (result) {
            const scannedText = result.getText();
            setData(scannedText);
            onScan(scannedText); // Pass scanned text to parent component
          }

          if (error) {
            console.error("QR Reader Error:", error);
          }
        }}
        constraints={{ facingMode: "environment" }}
        className="w-full max-w-[400px] z-20"
      />
      {/* <p>{data}</p> */}
    </>
  );
};
