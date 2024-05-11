"use client";
import { useGetController } from "@/stores/complaints-store";
import { getCookies } from "cookies-next";
import React, { useEffect } from "react";
import SupporterInfo from "./components/complaint-datail";

export default function Page() {
  const status = useGetController((state) => state.status);

  useEffect(() => {
    useGetController.action("");

    return () => {
      useGetController.clear();
    };
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") return <div>Error</div>;

  return (
    <div className="px-10 grid gap-10">
      <SupporterInfo />
    </div>
  );
}
