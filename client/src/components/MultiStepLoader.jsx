"use client";
import React, { useState } from "react";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";
import { TbSquareRoundedX } from "react-icons/tb";

export default function MultiStepLoader({
  loadingStates,
  currentState,
  setCurrentState,
  loading,
  setLoading,
}) {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <Loader
        loadingStates={loadingStates}
        loading={loading}
        currentState={currentState}
        setCurrentState={setCurrentState}
      />
    </div>
  );
}
