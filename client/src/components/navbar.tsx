"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./navbarmenu";
import { cn } from "@/lib/utils";
import { IoVideocam, IoPerson } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import Link from "next/link";


export function ExportNavbar() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-0" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn("fixed top-6 inset-x-0 w-screen mx-auto z-50", className)} >
      <Menu setActive={setActive}>

        {/* Upload */}
        <Link href="/upload" className="flex justify-front content-center space-x-2">
          <div className="flex justify-start relative top-1.5 ">
            <IoVideocam />
          </div>
          <div className="flex justify-end content-center border border-transparent">
            <MenuItem setActive={setActive} active={active} item="Upload">
              <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
                <HoveredLink href="/pastuploads">Past Uploads</HoveredLink>
              </h4>
            </MenuItem>
          </div>
        </Link>
        
        {/* Past Results */}
        <Link href="/pastresults" className="flex justify-front content-center space-x-2">
          <div className="flex justify-start relative top-1.5 ">
              <MdHistory />
          </div>
          <div className="flex justify-end content-center border border-transparent">
            <MenuItem setActive={setActive} active={active} item="Past Results">
              <div className="text-sm grid grid-cols-2 gap-10 p-4">
                <ProductItem
                  title="Data Visualization"
                  href="/visualize"
                  src=""
                  description="View your progress and results from previous uploads"
                />
                <ProductItem
                  title="Past Suggestions"
                  href="/suggestions"
                  src="./vertex.svg"
                  description="Take a look at the suggestions you've received in the past"
                />
                <ProductItem
                  title="placeholder feature"
                  href=""
                  src=""
                  description="lorem ipsum"
                />
                <ProductItem
                  title="placeholder feature"
                  href=""
                  src=""
                  description="lorem ipsum"
                />
              </div>
            </MenuItem>
          </div>
        </Link>

        {/* Sign In/Log In */}
        <Link href="/login" className="flex justify-front content-center space-x-2">
          <div className="flex justify-start relative top-1.5">
              <IoPerson />
          </div>
          <div className="flex justify-end content-center border border-transparent">
            <p>Login</p>
          </div>
        </Link>
      </Menu>
    </div>
    
  );
}
