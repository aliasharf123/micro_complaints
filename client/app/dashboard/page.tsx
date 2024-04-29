import React from "react";
import Navbar from "../components/navbar";
import Table from "../components/table";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { IoIosArrowDown } from "react-icons/io";
export default function Page() {
  return (
    <div>
      <Navbar />
      <div className="container  w-full px-2 md:px-10 flex gap-3 flex-col">
        <div className="flex max-md:flex-col gap-2 justify-between md:items-center">
          <div>
            <h1 className="font-medium">Hello Admin,</h1>
            <h1 className="text-4xl font-semibold">Good Morning </h1>
          </div>
          <div>
            <Button color="primary">Export Excel</Button>
          </div>
        </div>
        <header className="relative z-20 flex flex-col gap-2 rounded-medium bg-default-50 px-4 pb-3 pt-2 md:pt-3">
          <div className="flex items-center gap-1 md:hidden md:gap-2">
            <h2 className="text-large font-medium">Complaints</h2>
            <p className="text-small text-default-400">(1234)</p>
          </div>
          <div className="flex  items-center justify-between gap-2 ">
            <div className="flex flex-row gap-2">
              <div className="hidden items-center gap-1 md:flex">
                <h2 className="text-large font-medium">Complaints</h2>
                <p className="text-small text-default-400">(1234)</p>
              </div>
            </div>
            <div className="-ml-2 flex w-full flex-wrap items-center justify-start gap-2 md:ml-0 md:justify-end">
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button variant="ghost" endContent={<IoIosArrowDown />}>
                    Open Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Popover Content</div>
                    <div className="text-tiny">This is the popover content</div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button variant="ghost" endContent={<IoIosArrowDown />}>
                    Open Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Popover Content</div>
                    <div className="text-tiny">This is the popover content</div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>
        <Table />
      </div>
    </div>
  );
}
