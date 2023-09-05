"use client";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

export const QrCodeReader = () => {
  const [data, setData] = useState("No result");
  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        constraints={{ facingMode: "user" }}
        className="w-60"
      />
      <p>{data}</p>
    </>
  );
};
