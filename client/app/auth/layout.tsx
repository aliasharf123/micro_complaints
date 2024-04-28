import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background bg-radial ">
      <div className="flex items-center    h-screen justify-center">
        <div className="relative flex h-screen w-screen">
          <Link href={"/"}>
            <div className="absolute left-2 flex gap-2 items-center top-5 lg:left-5">
              <h1 className="font-bold text-foreground">Micro Complaints</h1>
            </div>
          </Link>
          {/* A client form component */}
          <div className="flex w-full items-center justify-center bg-background lg:w-1/2">
            {children}
          </div>
          <div
            style={{
              backgroundImage: `url("https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            className=" hidden w-1/2 flex-col-reverse rounded-l-medium p-10 shadow-small lg:flex"
          ></div>
        </div>
      </div>
    </div>
  );
}
