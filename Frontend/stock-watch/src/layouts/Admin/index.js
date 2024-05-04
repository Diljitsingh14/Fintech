import React from "react";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }) {
  return (
    <>
      <div className="d-flex">
        <Sidebar></Sidebar>
        <div className="main">{children}</div>
      </div>
    </>
  );
}
