"use client";

import LoginForm from "@/components/login";
import LampContainer from "@/components/ui/lamp";
import { motion } from "framer-motion";

export default function Signup() {
  return (
    <div className="w-screen h-screen">
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 p-5 bg-white shadow-lg mx-auto w-full max-w-md"
        >
          <LoginForm />
        </motion.div>
      </LampContainer>
    </div>
  );
}
