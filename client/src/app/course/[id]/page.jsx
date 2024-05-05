"use client";
import styles from "@/styles/course.module.scss";
import React, { use } from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useData } from "@/contexts/DataContext";
import { ExportNavbar } from "@/components/navbar";

const clampText = (text, limit) => {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

export default function page() {
  const { id } = useParams();
  const [course, setCourse] = useState({ title: "", chapters: [] });
  const [currentChapter, setCurrentChapter] = useState(0);
  const { addAlert, setLoadingModal, loadingModal, token } = useData();
  const [full, setFull] = useState(false);

  useEffect(() => {
    const getCourseById = async (id) => {
      setLoadingModal(true);
      let res_course = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "course-by-id?course_id=" + id,
        { headers: { Authorization: token } }
      );
      if (res_course.data.message) {
        addAlert({ message: res_course.data.message, type: "success" });
        setLoadingModal(false);
      } else {
        addAlert({
          type: "error",
          message: "Error getting course. Try later",
        });
        setLoadingModal(false);
        return null;
      }
      for (let i = 0; i < res_course.data.course.chapters.length; i++) {
        res_course.data.course.chapters[i].youtube_results =
          res_course.data.course.chapters[i].youtube_results.split("&pp")[0];
        res_course.data.course.chapters[i].youtube_results =
          res_course.data.course.chapters[i].youtube_results.replace(
            "https://www.youtube.com/watch?v=",
            "https://www.youtube.com/embed/"
          );
      }
      setCourse(res_course.data.course);
    };
    if (id && token) getCourseById(id);
  }, [id, token]);

  return (
    <main className={`${styles.course} ${full ? styles.full : ""}`}>
      <ExportNavbar />
      <div className={styles.chapterList}>
        {course.chapters.map((chapter, idx) => {
          return (
            <div
              key={idx}
              className={`${styles.chapter} ${
                idx == currentChapter ? styles.active : ""
              }`}
              onClick={() => {
                setCurrentChapter(idx);
              }}
            >
              {clampText(chapter.chapter_title, 30)}
            </div>
          );
        })}
      </div>
      <div className={styles.chapterContent}>
        <div className={styles.detailsWrapper}>
          <h1 className={styles.title}>
            {course.chapters[currentChapter]?.chapter_title}
          </h1>
          <p className={styles.description}>
            {course.chapters[currentChapter]?.chapter_description}
          </p>
        </div>
        <div className={styles.videoWrapper}>
          <iframe
            className={styles.video}
            src={course.chapters[currentChapter]?.youtube_results}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </main>
  );
}
