"use client";
import {
  Badge,
  NavbarItem,
  Avatar as AvatarContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from "@nextui-org/react";
import React from "react";
import { useAuthStore } from "@/stores";
import { deleteCookie } from "cookies-next";

export default function Avatar() {
  const authStore = useAuthStore();
  const user = authStore.authUser!;

  const logout = () => {
    deleteCookie("token");
    authStore.setAuthUser(null);
  };
  return (
    <NavbarItem>
      <Dropdown>
        <DropdownTrigger>
          <AvatarContent isBordered src={user.photo} size="md" />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key="settings">My Settings</DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem onClick={logout} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem>
  );
}
