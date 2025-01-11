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
            // @ts-ignore
            setData(result?.text as string);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        constraints={{ facingMode: "environment" }}
        className="w-60"
      />
      <p>{data}</p>
    </>
  );
};
