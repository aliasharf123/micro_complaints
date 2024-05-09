"use client";

import React, { useEffect, useState } from "react";
import { AcmeLogo } from "./AcmeLogo";

import {
  Navbar as NavbarContainer,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Skeleton,
} from "@nextui-org/react";
import ThemeSwitch from "./theme-switch";
import { usePathname } from "next/navigation";
import Avatar from "./avatar";
import { User, users } from "../utils";
import { useAuthStore } from "@/stores";
import { getCookie } from "cookies-next";
const menuItems = [
  "Profile",
  "Dashboard",
  "Activity",
  "Analytics",
  "System",
  "Deployments",
  "My Settings",
  "Team Settings",
  "Help & Feedback",
  "Log Out",
];
const values = ["dashboard", "customers", "integrations"];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const authStore = useAuthStore();
  const user = authStore.authUser;
  const token = getCookie("token");

  const fetchUser = async () => {
    try {
      if (user) return;
      if (!token) {
        return;
      }
      authStore.setRequestLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw await response.json();
      }

      const userJson = await response.json();
      authStore.setRequestLoading(false);

      authStore.setAuthUser(userJson);
    } catch (error: any) {
      authStore.setRequestLoading(false);
      if (error.error) {
        // error.error.forEach((err: any) => {
        //   toast.error(err.message, {
        //     position: "top-right",
        //   });
        // });
        return;
      }
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      // toast.error(resMessage, {
      //   position: "top-right",
      // });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  return (
    <NavbarContainer onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="text-foreground">
            <AcmeLogo />
            <p className="font-bold  text-inherit">ACME</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {values.map((value, index) => (
          <NavbarItem key={index}>
            <Link
              color={pathname === `/${value}` ? "primary" : "foreground"}
              href={`/${value}`}
            >
              {value[0].toUpperCase()}
              {value.slice(1)}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <ThemeSwitch />
        </NavbarItem>
        {!user && !authStore.requestLoading ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/auth/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/auth/signup"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) : authStore.requestLoading ? (
          <Skeleton className="flex rounded-full w-12 h-12" />
        ) : (
          <Avatar />
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NavbarContainer>
  );
}
