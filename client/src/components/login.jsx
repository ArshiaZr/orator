"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../../utils/cn";
import useFetch from "@/hooks/useFetch";
import { useData } from "@/contexts/DataContext";

// Component to wrap label and input elements
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

// Component for displaying a dynamic gradient below the button
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default function LoginForm() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [canSend, setCanSend] = useState(false);
  const { data, loading, error } = useFetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "login",
    "POST",
    { email, password },
    canSend
  );
  const { addAlert, saveToken, token, setLoadingModal } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    setCanSend(true);
  };
  useEffect(() => {
    if (data) {
      addAlert({ message: data.message, type: "success" });
      saveToken(data.token);
      window.location.replace("/dashboard");
      setCanSend(false);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      addAlert({ message: error, type: "error" });
      setCanSend(false);
    }
  }, [error]);

  useEffect(() => {
    if (token && token !== null) {
      window.location.replace("/dashboard");
    }
  }, [token]);

  useEffect(() => {
    setLoadingModal(loading);
  }, [loading]);

  return (
    <div className="flex items-center justify-center">
      <div className=" w-[600px] rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Orator
        </h2>
        Login Below
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="Enter Your Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
  );
}