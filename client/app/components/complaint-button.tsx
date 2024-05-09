"use client";
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
import React from "react";

export default function ComplaintButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = getCookie("token");
  const router = useRouter();

  const handleClick = () => {
    if (!token) router.push("/auth/signup");
    onOpen();
  };
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
                <Input
                  isRequired
                  labelPlacement="outside"
                  placeholder="Enter title"
                  label="Title"
                  variant="faded"
                />
                <Textarea
                  labelPlacement="outside"
                  label="Description"
                  isRequired
                  minRows={6}
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
                  <Button color="primary" onPress={onClose}>
                    Submit
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
