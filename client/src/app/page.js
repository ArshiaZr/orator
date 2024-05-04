import Upload from "@/components/upload";
import SignupForm from "@/components/signup";
import { DrawerModal } from "@/components/feedbackModal";
import { Divide } from "lucide-react";
export default function Home() {
  const feedback = "dslkf;sldkf";
  return (
    <div className="w-screen h-screen">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <SignupForm/>
      </div>
    </div>
  );
}
