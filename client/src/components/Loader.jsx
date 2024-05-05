"use client";

import { useData } from "@/contexts/DataContext";

export default function Loader() {
  const { loadingModal } = useData();
  return (
    <>
      {loadingModal ? (
        <div
          className="fixed w-screen h-screen flex justify-center items-center bg-[#000000b3]"
          style={{ zIndex: 100000 }}
        >
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
