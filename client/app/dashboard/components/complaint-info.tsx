"use client";
import { Complaint, Status } from "@/app/utils";
import { useComplaintStore } from "@/stores/complaints-store";
import { Divider } from "antd";
import React, { useMemo } from "react";

export default function ComplaintInfo() {
  const complaints = useComplaintStore((state) => state.complaints);

  const closedLength = useMemo(
    () =>
      complaints.filter((complaint) => complaint.status === Status.Closed)
        .length,
    [complaints]
  );
  const openLength = useMemo(
    () =>
      complaints.filter((complaint) => complaint.status === Status.Open).length,
    [complaints]
  );
  const takenLength = useMemo(
    () =>
      complaints.filter((complaint) => complaint.status === Status.Taken)
        .length,
    [complaints]
  );

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Complaints Dashboard</h1>
        <p className="text-small text-default-500">
          <span className="text-default-foreground font-semibold">
            {complaints.length} Total
          </span>
          , proceed to finish them
        </p>
      </div>
      <div>
        <div className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-default-foreground text-3xl font-semibold">
              {closedLength}
            </h1>
            <p className="text-sm text-default-500">Closed</p>
          </div>
          <Divider
            type="vertical"
            className="mx-6 border-[1px]  h-9 dark:border-content2"
          />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-default-foreground text-3xl font-semibold">
              {openLength}
            </h1>
            <p className="text-sm text-default-500">Open</p>
          </div>
        </div>
      </div>
    </div>
  );
}
