"use client";
import { User } from "@/app/utils";
import { User as UserComponent } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import React from "react";
import useSWR from "swr";
import { Skeleton } from "@nextui-org/react";

export default function UserColumn({ authorId }: { authorId: number }) {
  const token = getCookie("token");

  const fetcher = (...args) =>
    fetch(...args, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${authorId}`,
    fetcher
  ) as {
    data: User;
    error: any;
    isLoading: boolean;
  };
  if (error) {
    return <div>Error</div>;
  }

  return (
    <Skeleton isLoaded={!isLoading} className="">
      <UserComponent
        avatarProps={{ radius: "full", src: user?.photo }}
        name={user?.name}
      >
        {user?.email}
      </UserComponent>
    </Skeleton>
  );
}
