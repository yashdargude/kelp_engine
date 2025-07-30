"use client";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-transparent via-indigo-900 to-transparent  p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Home
        </Link>
      </div>
    </nav>
  );
}
