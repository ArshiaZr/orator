"use client"
import Upload from "@/components/upload";
import { ExportNavbar } from "@/components/navbar";
import Link from "next/link";

export default function UploadPages() {
    return (
        <div className="w-screen h-screen">
            <div>
                <ExportNavbar/>
            </div>
            <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-2/5 justify-center">
                <div className="flex justify-center">
                    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                        Upload a MP4 file to Orator
                    </h2>
                    <p></p>
                </div>
                <Upload/>
                <div className="absolute mt-28 inset-1/2 transform -translate-x-1/2 translate-y-14 w-1/4 h-1/5 md:rounded-md xl:rounded-lg p-4">
                    <Link href="/upload/pastuploads" className="bg-gradient-to-br from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center">
                        Past Uploads &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};
