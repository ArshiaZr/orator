import styles from "@/styles/Feedbacks.module.scss";
import { IoMdClose } from "react-icons/io";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FaMagic } from "react-icons/fa";

export default function Feedbacks({
  feedbacks = [],
  setFeedbacksShown,
  feebacksShown,
  handleGenerateCourse,
}) {
  return (
    <div className={`${styles.feedbacks} ${feebacksShown ? styles.show : ""}`}>
      <div className={styles.header}>
        <h2>Feedbacks</h2>
        <div className={styles.close}>
          <IoMdClose
            onClick={() => {
              setFeedbacksShown(false);
            }}
          />
        </div>
      </div>
      <div className={styles.wrapper}>
        {feedbacks.map((feedback, index) => (
          <div className={styles.feedback} key={index}>
            <TextGenerateEffect words={`${index + 1}. ${feedback}`} />
          </div>
        ))}
      </div>
      <div className={styles.genererateWrapper}>
        <button
          className={styles.generateButton}
          onClick={() => {
            handleGenerateCourse();
          }}
        >
          <FaMagic /> <span>Generate Course</span>
        </button>
      </div>
    </div>
  );
}
