"use client";
import { useGetController } from "@/stores/complaints-store";
import React, { useEffect } from "react";
import ComplaintsTable from "./components/complaints-table";
import ComplaintDetailModal from "./components/complaint-datail-modal";

export default function Page() {
  const status = useGetController((state) => state.status);

  useEffect(() => {
    useGetController.action("");

    return () => {
      useGetController.clear();
    };
  }, []);

  return (
    <div className="px-10 grid gap-10">
      {status !== "loading" ? <ComplaintsTable /> : <div>Loading...</div>}
      <ComplaintDetailModal />
    </div>
  );
}
