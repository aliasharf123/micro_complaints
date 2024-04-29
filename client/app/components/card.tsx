import React from "react";
import { users } from "../utils/mock-data";
import {
  Avatar,
  Button,
  Card as CardContainer,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
export default function Card({ user }: { user: (typeof users)[number] }) {
  return (
    <CardContainer className="max-w-[360px] ">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar radius="full" size="md" src={user.avatar} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{user.email.split("@")[0]}
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-500">
        <p>{user.complaint}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {user.age}
          </p>
          <p className=" text-default-400 text-small">Age</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {user.house}
          </p>
          <p className="text-default-400 text-small">House</p>
        </div>
      </CardFooter>
    </CardContainer>
  );
}
