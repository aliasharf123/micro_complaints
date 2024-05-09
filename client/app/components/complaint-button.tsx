"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Complaint } from "../utils";

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
  })
  .required();

export default function ComplaintButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = getCookie("token");
  const router = useRouter();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleClick = () => {
    if (!token) router.push("/auth/signup");
    onOpen();
  };

  const submitForm = handleSubmit(async (data) => {
    setIsLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/complaints`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "Open",
        } as Complaint),
      }
    );
    if (!res.ok) {
      const error = await res.json();
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // remove error
    setError("");
    // end loading
    setIsLoading(false);
    data.description = "";
    data.title = "";
    onClose();
  });

  return (
    <>
      <Button color="primary" onClick={handleClick} variant="shadow">
        Make a Complaint
      </Button>
      <Modal backdrop="blur" size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex-col items-center gap-1 py-6 text-center">
                <h1>Feel free to complaint</h1>
                <p className="text-small font-normal text-default-500">
                  We value your feedback. If you have any ideas or suggestions
                  to improve our product, let us know.
                </p>
              </ModalHeader>
              <ModalBody>
                {Boolean(error) && (
                  <div className="text-danger text-small">{error}</div>
                )}
                <form
                  onSubmit={submitForm}
                  className="flex w-full flex-col gap-3"
                >
                  <Input
                    isRequired
                    labelPlacement="outside"
                    placeholder="Enter title"
                    label="Title"
                    {...register("title")}
                    isInvalid={Boolean(errors.title)}
                    errorMessage={errors.title?.message}
                    variant="faded"
                  />
                  <Textarea
                    labelPlacement="outside"
                    label="Description"
                    isRequired
                    {...register("description")}
                    minRows={6}
                    isInvalid={Boolean(errors.description)}
                    errorMessage={errors.description?.message}
                    size="lg"
                    variant="faded"
                    placeholder="Ideas or suggestions to improve our product"
                    className="w-full"
                  />
                  <Divider className="my-2" />
                  <div className="flex gap-2 justify-end">
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" isLoading={isLoading} type="submit">
                      Submit
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
