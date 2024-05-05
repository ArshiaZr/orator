"use client";
import Upload from "@/components/upload";
import { ExportNavbar } from "@/components/navbar";
import Link from "next/link";

export default function UploadPages() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <img
          src="/images/01.jpeg"
          style={{ objectFit: "cover", opacity: 0.5 }}
        />
        <div
          style={{
            position: "absolute",
            top: "3.1rem",
            left: "0",
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, #0000001b 0%, #0000009a 100%)",
          }}
        ></div>
      </div>
      <div>
        <ExportNavbar />
      </div>
      <div
        className="justify-center relative bg-white"
        style={{
          padding: "2rem",
          borderRadius: "1rem",
          background: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <div
          className="flex justify-center align-center flex-col gap-3"
          style={{ alignItems: "center" }}
        >
          <h2
            className="font-bold text-neutral-800 dark:text-neutral-200"
            style={{
              fontSize: "1.75rem",
            }}
          >
            Upload a MP4 file to Orator
          </h2>
          <p>
            Load a video of you presentiation and obtain
            <br /> feedback based on expertly-researched criteria
          </p>
        </div>
        <Upload />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            >
            <Link
                href="/upload/pastuploads"
                style={{
                width: "fit-content",
                padding: "0.5rem 1rem",
                textAlign: "center",
                }}
                className="bg-gradient-to-br from-black to-neutral-600 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            >
                Past Uploads &rarr;
            </Link>
            </div>
        </div>
              </div>
              </div>
  );
}
