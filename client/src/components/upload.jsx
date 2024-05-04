"use client"
import { FaFileUpload } from "react-icons/fa";
import { useState } from "react";

const Upload = () => {
    const [videoUrl, setVideoUrl] = useState(null);
    const [file, setFile] = useState(null);

    function handleVideoUpload(event) {
        setVideoUrl(null);
        const files = event.target.files;
        if (files && files.length > 0) {
            const url = URL.createObjectURL(files[0]);
            setVideoUrl(url);
            setFile(files[0]);
            console.log(url)
        }
    }

    return (
<div className="flex flex-wrap">
    <div className="w-full md:w-1/2 p-4">
        <label htmlFor="dropzone-file" className="block font-medium leading-6 text-purple-900 text-right">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-purple-900/25 px-6 py-10">
                <div className="text-center">
                    <FaFileUpload className="mx-auto h-12 w-12 text-purple-600 mb-2" />
                    <p className="mb-2 text-sm text-black">
                        <span className="relative cursor-pointer rounded-md font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
                            Click to upload
                        </span>{" "}
                        or drag and drop
                    </p>
                    <p className="text-xs text-purple-600">
                        MP4 up to xxMB
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="video/mp4"
                    onChange={(e) => handleVideoUpload(e)}
                />
            </div>
        </label>
    </div>
</div>
    );
};

export default Upload;
