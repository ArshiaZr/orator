"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./navbarmenu";
import { cn } from "@/lib/utils";
import { IoVideocam, IoPerson } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";

export function ExportNavbar() {
  return (
    <div
      className="fixed w-full flex items-center justify-center"
      style={{ zIndex: 10 }}
    >
      <Navbar className="top-0" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-6 inset-x-0 w-screen mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        {/* Upload */}
        <Link
          href="/upload"
          className="flex justify-front content-center space-x-2"
        >
          <div className="flex justify-start relative top-1.5 ">
            <IoVideocam />
          </div>
          <div className="flex justify-end content-center border border-transparent">
            <p>Upload</p>
          </div>
        </Link>

        {/* Past Results */}
        <Link
          href="/pastresults"
          className="flex justify-front content-center space-x-2"
        >
          <div className="flex justify-start relative top-1.5 ">
            <MdHistory />
          </div>
          <div className="flex justify-end content-center border border-transparent">
            <MenuItem setActive={setActive} active={active} item="Past Results">
              <div className="text-sm grid grid-cols-2 gap-10 p-4">
                <ProductItem
                  title="Data Visualization"
                  href="/visualize"
                  src="/images/navbar/01.jpg"
                  description="View your progress and results from previous uploads"
                />
                <ProductItem
                  title="Past Suggestions"
                  href="/suggestions"
                  src="/images/navbar/02.jpg"
                  description="Take a look at the suggestions you've received in the past"
                />
                <ProductItem
                  title="Past Lessons"
                  href=""
                  src="/images/navbar/03.jpg"
                  description="Take a look at past lessons you've created, modify them, or delete them"
                />
                {/* <ProductItem
                  title="placeholder feature"
                  href=""
                  src=""
                  description="lorem ipsum"
                /> */}
              </div>
            </MenuItem>
          </div>
        </Link>

        {/* Sign In/Log In */}
        <button
          onClick={() => {}}
          className="flex justify-front content-center space-x-2"
        >
          <div className="flex justify-start relative top-1.5">
            <IoPerson />
          </div>
          <div className="flex justify-end content-center border border-transparent">
            <p>Profile</p>
          </div>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.replace("/");
          }}
          className="flex justify-front content-center space-x-2"
        >
          <div className="flex justify-start relative top-1.5">
            <CiLogout />
          </div>
          <div className="flex justify-end content-center border border-transparent">
            <p>Logout</p>
          </div>
        </button>
      </Menu>
    </div>
  );
}
