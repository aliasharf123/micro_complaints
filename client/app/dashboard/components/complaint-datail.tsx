"use client";
import { useAuthStore } from "@/stores";
import { useComplaintStore } from "@/stores/complaints-store";
import { Avatar, Button } from "@nextui-org/react";
import React from "react";
import { FaPlus } from "react-icons/fa6";
export default function ComplaintDetail() {
  const complaints = useComplaintStore((state) => state.complaints);
  const user = useAuthStore((state) => state.authUser);

  return (
    <div className="mt-4 flex gap-12 items-center max-md:justify-center">
      <div className="flex items-center gap-3 ">
        <h1 className="text-3xl">DASHBOARD</h1>
        <Button radius="md" className="max-md:hidden" startContent={<FaPlus />}>
          New Complaint
        </Button>
      </div>
      {["Open", "Closed", "Taken"].map((value, index) => (
        <div key={index} className="flex gap-1 max-md:hidden items-end">
          <h1 className="text-3xl">34</h1>
          <p className="text-default-500">{value}</p>
        </div>
      ))}
    </div>
  );
}
