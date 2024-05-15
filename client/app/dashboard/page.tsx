"use client";
import { useGetController } from "@/stores/complaints-store";
import React, { useEffect } from "react";
import ComplaintsTable from "./components/complaints-table";
import ComplaintDetailModal from "./components/complaint-datail-modal";
import ComplaintInfo from "./components/complaint-info";

export default function Page() {
  useEffect(() => {
    useGetController.action("");

    return () => {
      useGetController.clear();
    };
  }, []);

  return (
    <div className="max-md:px-10 px-[7rem] grid gap-5 mt-5">
      <ComplaintInfo />
      <ComplaintsTable />
      <ComplaintDetailModal />
    </div>
  );
}
