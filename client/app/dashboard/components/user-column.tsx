"use client";
import { User } from "@/app/utils";
import { User as UserComponent } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import React from "react";
import useSWR from "swr";
import { Skeleton } from "@nextui-org/react";
import { useGetUser } from "@/app/utils/hooks/useGetUser";

export default function UserColumn({ authorId }: { authorId: number }) {
  const { error, isLoading, user } = useGetUser(authorId);
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
