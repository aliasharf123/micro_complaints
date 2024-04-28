import ComplaintButton from "./components/complaint-button";
import Navbar from "./components/navrbar";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      {/* Main Text */}
      <div className="w-full h-[45vh] items-center text-center flex flex-col gap-5 mt-24">
        <div className="flex flex-col gap-1 text-5xl font-semibold">
          <h1>Feedback fuels action</h1>
          <h1>Start Now</h1>
        </div>
        <p className="font-normal">
          Don&apos;t Be Silent. Take Control. Submit a Complaint Here.
        </p>
        <ComplaintButton />
      </div>
    </div>
  );
}
