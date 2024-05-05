import styles from "@/styles/Feedbacks.module.scss";
import { IoMdClose } from "react-icons/io";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FaMagic } from "react-icons/fa";

export default function Feedbacks({
  feedbacks = [
    "The speaker's voice is clear enough, but could be slightly louder to ensure everyone in the audience can hear.",
    'The occasional repetition of "like" can be distracting and detract from the message.',
    "The speech starts well with a personal anecdote, but then lacks a clear structure.",
    "Consider using a clear introduction, body, and conclusion to organize the main points.",
    "The speaker could benefit from incorporating more engaging elements like personal stories, anecdotes, or humor.",
    "Asking questions to the audience could also increase engagement.",
    "The language is appropriate for the audience, but some sentences could be rephrased for better clarity and flow.",
    'Replacing repeated words like "really" with more descriptive alternatives would enhance the speech.',
    "The speaker's pacing is good, but some sentences could be delivered with more emphasis and variation to avoid monotony.",
    "The speaker appears somewhat nervous, which is understandable for a beginner.",
    "Practicing the speech beforehand and focusing on clear articulation can boost confidence.",
    "No visual aids were used in this speech. Consider incorporating visuals to enhance the message and engage the audience.",
    "There is minimal audience interaction.",
    "Incorporating questions, polls, or even brief moments of silence to encourage audience participation can boost engagement.",
    "The main message about the benefits of living on campus is conveyed, but could be strengthened with more specific examples and details.",
    "The speaker's personal anecdote about their experience is a good start.",
    "Consider adding more personal touches throughout the speech to connect with the audience on a deeper level.",
  ],
  setFeedbacksShown,
  feebacksShown,
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
        <button className={styles.generateButton} onClick={() => {}}>
          <FaMagic /> <span>Generate Course</span>
        </button>
      </div>
    </div>
  );
}
