import Upload from "@/components/upload";
import SignupForm from "@/components/signup";
import { DrawerModal } from "@/components/feedbackModal";
export default function Home() {

  const feedback = "dslkf;sldkf";
  return (
    <DrawerModal
    feedback={feedback}
    />
  );
}
