import { FaFileUpload } from "react-icons/fa";
import { useState } from "react";
import axios from 'axios';

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(false);

    function handleVideoUpload(event) {
        const files = event.target.files;
        setFiles(files);
        if (files && files.length > 0) {
            const url = URL.createObjectURL(files[0]);
            console.log(url);
            const data = new FormData();
            data.append('file', files[0]);
            axios.post('/upload', data, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                    if (percentCompleted >= 95) {
                        setUploadStatus(true);
                        console.log("Upload complete");
                    }
                }
            });
        }
    }

    return (
        <div>
            <div className="flex flex-wrap justify-center content-center">
                <div className="w-full h-full md:w-1/2 p-8">
                    <label htmlFor="dropzone-file" className="block font-medium leading-6 text-red-900 text-right">
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-purple-900/25 px-6 py-8">
                            <div className="text-center">
                                <FaFileUpload className="mx-auto h-10 w-10 text-black mb-2 hover:border-solid hover:border-red-900" />
                                <p className="mb-2 text-sm text-black">
                                    <span className="relative cursor-pointer rounded-md font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-red-400 focus-within:ring-offset-2 hover:border-red-900">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-black">
                                    MP4 up to 16MB
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
                    {files && files.length > 0 ? (
                        <div className="relative justify-start space-y-1 top-12">
                            <h2>Uploading: {files[0].name}</h2>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className={`bg-${uploadStatus ? 'green' : 'blue'}-600 h-2.5 rounded-full`} style={{width: `${uploadStatus ? 100 : uploadProgress}%`}}></div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative justify-start space-y-1 top-12">
                            <h2>Uploading: <i>samplevideo.mp4</i></h2>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className={`bg-${uploadStatus ? 'green' : 'blue'}-600 h-2.5 rounded-full`} style={{width: `${uploadStatus ? 100 : uploadProgress}%`}}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Upload;
