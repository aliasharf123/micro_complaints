import { getCookie } from "cookies-next";
import useSWR from "swr";
import { User } from "../types";

export const useGetUser = (authorId: number) => {
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

  return { user, error, isLoading };
};
