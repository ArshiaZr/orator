import { FaFileUpload } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { useData } from "@/contexts/DataContext";
import Feedbacks from "./Feedbacks";
import MultiStepLoader from "./MultiStepLoader";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);
  const { token, setLoadingModal, addAlert } = useData();
  const [feedbacks, setFeedbacks] = useState([]);
  const [feebacksShown, setFeebacksShown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [chatperNames, setChapterNames] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);

  async function handleVideoUpload(event) {
    const files = event.target.files;
    setFiles(files);
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      console.log(url);
      const data = new FormData();
      data.append("video", files[0]);
      console.log(files[0], token);
      setLoadingModal(true);
      let res_compress = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "compress-video",
        data,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            if (percentCompleted >= 99) {
              setUploadStatus(true);
              console.log("Upload complete");
            }
          },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      if (res_compress.data.message) {
        addAlert({ message: res_compress.data.message, type: "success" });
      } else {
        addAlert({
          type: "error",
          message: "Error uploading video. Try later",
        });
        setLoadingModal(false);
        return;
      }

      let res_transcript = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "transcript-video",
        {
          video_path: res_compress.data.output_path,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      );
      if (res_transcript.data.message) {
        addAlert({ message: res_transcript.data.message, type: "success" });
      } else {
        addAlert({
          type: "error",
          message: "Error uploading video. Try later",
        });
        setLoadingModal(false);
        return;
      }
      let res_feedback = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "feedback",
        {
          speech: res_transcript.data.speech,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res_feedback.data.message) {
        addAlert({ message: res_feedback.data.message, type: "success" });
        console.log(res_feedback.data.feedbacks);
        setFeedbacks(res_feedback.data.feedbacks);
        setFeebacksShown(true);
      } else {
        addAlert({
          type: "error",
          message: "Error uploading video. Try later",
        });
        setFeedbacks([]);
        setFeebacksShown(false);
        return;
      }
      setLoadingModal(false);
    }
  }

  const handleGenerateCourse = async () => {
    setLoadingModal(true);
    let res_course = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + "generate-course",
      {
        feedbacks: feedbacks,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (res_course.data.message) {
      addAlert({ message: res_course.data.message, type: "success" });
    } else {
      addAlert({
        type: "error",
        message: "Error generating course. Try later",
      });
      setLoadingModal(false);
      return;
    }
    setLoadingModal(false);

    getAllChaptersInfo(res_course.data.course_id);
  };

  const getCourseById = async (id) => {
    setLoading(true);
    let res_course = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + "course-by-id?course_id=" + id,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (res_course.data.message) {
      addAlert({ message: res_course.data.message, type: "success" });
    } else {
      addAlert({
        type: "error",
        message: "Error getting course. Try later",
      });
      return null;
    }
    return res_course.data.course;
  };

  const getChapterInfo = async (chapterId, courseId) => {
    let res_chapter = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + "generate-chapter",
      {
        course_id: courseId,
        chapter_id: chapterId,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (res_chapter.data.message) {
      addAlert({ message: res_chapter.data.message, type: "success" });
    } else {
      addAlert({
        type: "error",
        message: "Error generating chapter. Try later",
      });
      return false;
    }
    return true;
  };

  const getAllChaptersInfo = async (id) => {
    let course = await getCourseById(id);
    if (!course) {
      return;
    }
    if (course.chapters.length === 0) {
      addAlert({
        message: "No chapters found",
        type: "error",
      });
      return;
    }

    setFeebacksShown(false);

    setLoadedCount(0);
    setLoading(true);
    let names = [];
    // loop through all chapters and get info
    course.chapters.forEach(async (chapter) => {
      names.push({ text: chapter.chapter_title });
    });

    setChapterNames(names);

    let success = true;
    for (let i = 0; i < course.chapters.length; i++) {
      if (!(await getChapterInfo(i, id))) {
        setLoading(false);
        addAlert({
          message: "Failed to generate chapters",
          type: "error",
        });
        success = false;
        break;
      }
      setLoadedCount((prev) => prev + 1);
    }
    if (success) {
      addAlert({
        message: "Chapters generated successfully",
        type: "success",
      });
      window.location.replace("/course/" + id);
    }
  };

  useEffect(() => {
    if (loadedCount === chatperNames.length) {
      setLoading(false);
    }
  }, [loadedCount]);

  return (
    <div>
      {loading && (
        <MultiStepLoader
          loading={loading}
          setLoading={setLoading}
          loadingStates={chatperNames}
          currentState={loadedCount}
          setCurrentState={setLoadedCount}
        />
      )}
      <Feedbacks
        setFeedbacksShown={setFeebacksShown}
        feebacksShown={feebacksShown}
        feedbacks={feedbacks}
        handleGenerateCourse={handleGenerateCourse}
      />
      <div className="flex flex-wrap justify-center content-center ">
        <div className="w-full h-full p-8 ">
          <label
            htmlFor="dropzone-file"
            className="block font-medium text-red-900 cursor-pointer "
            style={{
              width: "23rem",
            }}
          >
            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-black px-6 py-8 ">
              <div className="text-center">
                <FaFileUpload className="mx-auto h-10 w-10 text-black mb-2 hover:border-solid hover:border-red-900" />
                <p className="mb-2 text-sm text-black mt-4">
                  <span className="relative cursor-pointer rounded-md font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-red-400 focus-within:ring-offset-2 hover:border-red-900">
                    Click to upload
                  </span>
                  &nbsp; or drag and drop
                </p>
                <p className="text-xs text-black">MP4 up to 200MB</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                // accept="video/mp4"
                onChange={(e) => handleVideoUpload(e)}
              />
            </div>
          </label>

          <div className="relative justify-start" style={{ marginTop: "2rem" }}>
            <h2
              style={{
                maxWidth: "23rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontWeight: "bold",
              }}
            >
              Uploading: {files && files.length > 0 ? `${files[0].name}` : ""}
            </h2>
            <div
              className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
              style={{
                marginTop: "0.5rem",
              }}
            >
              <div
                className={`bg-${
                  uploadStatus ? "green" : "blue"
                }-600 h-2.5 rounded-full`}
                style={{ width: `${uploadStatus ? 100 : uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
