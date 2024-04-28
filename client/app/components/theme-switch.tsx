"use client";

import { Chip } from "@nextui-org/react";
import React from "react";
import { PiSunDimFill } from "react-icons/pi";
import { BsMoonFill } from "react-icons/bs";
import { useTheme } from "next-themes";

export default function ThemeSwitch(props: any) {
  const { theme, setTheme } = useTheme();

  return (
    <Chip color="default" className="cursor-pointer" variant="light">
      {theme === "dark" ? (
        <BsMoonFill size={20} onClick={() => setTheme("light")} />
      ) : (
        <PiSunDimFill size={25} onClick={() => setTheme("dark")} />
      )}
    </Chip>
  );
}
