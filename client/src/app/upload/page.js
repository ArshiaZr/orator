"use client"
import { FaFileUpload } from "react-icons/fa";
import { useState } from "react";
import Upload from "@/components/upload";
import { ExportNavbar } from "@/components/navbar";

export default function UploadPages() {
    return (
        <div className="justify-center content-center">
            <ExportNavbar/>
            <Upload/>
        </div>
    );
};
