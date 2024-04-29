import { ScrollShadow } from "@nextui-org/react";
import ComplaintButton from "./components/complaint-button";
import Navbar from "./components/navrbar";
import Marquee from "react-fast-marquee";
import Card from "./components/card";
import { users } from "./utils/mock-data";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col gap-8">
        {/* Main Text */}
        <div className="w-full h-[45vh] z-40  px-3 items-center text-center flex flex-col gap-5 justify-end">
          <div className="flex flex-col gap-1 text-4xl md:text-5xl font-semibold">
            <h1>
              Fell free to Tell us your <br className="max-sm:hidden" />
              <span className="text-primary">Complaint</span>{" "}
            </h1>
          </div>
          <p className="font-normal max-md:text-small max-w-lg">
            We want to hear all the details. The more information you provide,
            the stronger your case will be. Describe the situation clearly
          </p>
          <ComplaintButton />
        </div>
        <ScrollShadow
          hideScrollBar
          visibility="both"
          isEnabled
          style={{
            transitionDuration: "40s",
            gap: "40px",
          }}
          orientation="horizontal"
          className="flex w-full "
        >
          <Marquee gradientColor="" className="flex py-7  gap-5 bg-background">
            <div className="flex gap-5">
              {users.map((user) => (
                <Card key={user.id} user={user} />
              ))}
            </div>
          </Marquee>
        </ScrollShadow>
      </div>
    </div>
  );
}
