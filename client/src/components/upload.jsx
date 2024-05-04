import { FaFileUpload } from "react-icons/fa";
import { useState } from "react";
import axios from 'axios';

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

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
                }
            });
        }
    }

    return (
        <div>
            <div className="flex flex-wrap justify-center content-center">
                <div className="w-full h-full md:w-1/2 p-8 border border-blue-100">
                    <label htmlFor="dropzone-file" className="block font-medium leading-6 text-purple-900 text-right">
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-purple-900/25 px-6 py-10">
                            <div className="text-center">
                                <FaFileUpload className="mx-auto h-10 w-10 text-purple-600 mb-2 hover:border-solid hover:border-purple-900" />
                                <p className="mb-2 text-sm text-black">
                                    <span className="relative cursor-pointer rounded-md font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-purple-600">
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
                </div>
                {files && files.length > 0 && (
                    <div className="flex justify-start space-y-1">
                        <h2>Uploading: {files[0].name}</h2>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className={`bg-${uploadProgress === 100 ? 'green' : 'blue'}-600 h-2.5 rounded-full`} style={{width: `${uploadProgress}%`}}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
