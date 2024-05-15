"use client";
import { useAuthStore } from "@/stores";
import {
  useCloseController,
  useComplaintStore,
  useTakeController,
} from "@/stores/complaints-store";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Textarea,
  User,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineDescription } from "react-icons/md";
import { useGetUser } from "@/app/utils/hooks/useGetUser";
import { calculateReadableDifference } from "@/app/utils";
import { statusColorMap } from "./complaints-table";
import { MdOutlineSupportAgent } from "react-icons/md";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { message, theme as antTheme, ConfigProvider } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "next-themes";

const itemClasses = {
  base: "py-0 2 w-full",
  title: "font-normal text-medium",
  trigger:
    "px-2 py-0 bg-content2 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
  indicator: "text-medium",
  content: "text-small w-full px-2 ",
};

const schema = yup
  .object({
    answer: yup.string().required(),
  })
  .required();

export default function ComplaintDetailModal() {
  const complaints = useComplaintStore((state) => state.complaints);
  const status = useTakeController((state) => state.status);
  const statusAnswer = useCloseController((state) => state.status);
  const user = useAuthStore((state) => state.authUser);
  const complaintId = Number(useSearchParams().get("complaintId"));
  const { theme } = useTheme();
  const { defaultAlgorithm, darkAlgorithm } = antTheme;

  const router = useRouter();
  const complaint = React.useMemo(
    () =>
      complaintId
        ? complaints.filter((complaint) => complaint.id == complaintId)[0]
        : null,
    [complaintId, status, statusAnswer]
  );

  const {
    error,
    isLoading,
    user: author,
  } = useGetUser(complaint?.author_id as any);
  const {
    error: errorSupporter,
    isLoading: isLoadingSupporter,
    user: supporter,
  } = useGetUser(complaint?.supporter_id as any);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Answer sent successfully!",
    });
  };

  const submitForm = handleSubmit(async (data) => {
    try {
      await useCloseController.action({
        id: complaint?.id as any,
        closeReason: data.answer,
      });
      success();
      data.answer = "";
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme == "dark" ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        {contextHolder}
      </ConfigProvider>
      <Modal
        backdrop="blur"
        size="lg"
        onClose={() => router.push("/dashboard")}
        isOpen={!complaint ? false : true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex  flex-col gap-1">
                Complaint Detail
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <Skeleton
                      isLoaded={!isLoading}
                      className="w-14 h-14 rounded-full"
                    >
                      <Avatar
                        src={author?.photo}
                        radius="full"
                        className="h-14 w-14"
                      />
                    </Skeleton>
                    <div className="flex flex-col items-start justify-center">
                      <Skeleton isLoaded={!isLoading}>
                        <h2 className="font-medium">{author.name}</h2>
                      </Skeleton>
                      <Skeleton isLoaded={!isLoading}>
                        <p className="text-small text-default-500">
                          {" "}
                          {calculateReadableDifference(
                            new Date(complaint?.time_created as any)
                          )}{" "}
                          ago
                        </p>
                      </Skeleton>
                    </div>
                  </div>
                  <Button
                    className={
                      complaint?.status !== "Open"
                        ? "bg-transparent text-foreground border-default-200"
                        : ""
                    }
                    color="primary"
                    radius="full"
                    size="sm"
                    isLoading={status === "loading"}
                    variant={
                      complaint?.status !== "Open" ? "bordered" : "solid"
                    }
                    onPress={() =>
                      useTakeController.action(complaint?.id as any)
                    }
                    isDisabled={complaint?.status !== "Open"}
                  >
                    {complaint?.status === "Open" ? "Claim" : complaint?.status}
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Chip variant="flat">UX/UI</Chip>
                  <Chip variant="flat">Hogwarts</Chip>
                  <Chip variant="flat">Snap</Chip>
                  <Chip
                    color={statusColorMap(complaint?.status as any).color}
                    variant="flat"
                  >
                    {complaint?.status}
                  </Chip>
                </div>
                <Accordion>
                  <AccordionItem
                    key="1"
                    startContent={
                      <MdOutlineDescription
                        size={24}
                        className="text-primary"
                      />
                    }
                    aria-label="Accordion 1"
                    title={complaint?.title}
                    subtitle="Click to view more details"
                    classNames={itemClasses}
                  >
                    <div className="text-balance w-full max-h-32 overflow-y-auto">
                      <p className="break-words">{complaint?.description}</p>
                    </div>
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    startContent={<MdOutlineSupportAgent size={24} />}
                    aria-label="Accordion 1"
                    title="Supporter"
                    subtitle="Supporter assigned to this complaint"
                    className=" mt-2 "
                    classNames={itemClasses}
                  >
                    {complaint?.supporter_id != 1 ? (
                      <div className="flex gap-4 py-2">
                        <Skeleton
                          isLoaded={!isLoadingSupporter}
                          className="w-12 h-12 rounded-full"
                        >
                          <Avatar
                            src={supporter?.photo}
                            radius="full"
                            className="h-12 w-12"
                          />
                        </Skeleton>
                        <div className="flex flex-col items-start justify-center">
                          <Skeleton isLoaded={!isLoadingSupporter}>
                            <h2 className="font-medium">{supporter.name}</h2>
                          </Skeleton>
                        </div>
                      </div>
                    ) : (
                      <p>Not assigned</p>
                    )}
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    startContent={
                      <RiQuestionAnswerLine
                        size={24}
                        className="text-success"
                      />
                    }
                    aria-label="Answer the complaint"
                    title="Answer the complaint"
                    className="mt-2"
                    classNames={itemClasses}
                  >
                    {complaint?.status !== "Closed" ? (
                      user?.id == complaint?.supporter_id ? (
                        <form
                          onSubmit={submitForm}
                          className="flex w-full flex-col gap-3"
                        >
                          <Textarea
                            isRequired
                            {...register("answer")}
                            minRows={4}
                            isInvalid={Boolean(errors.answer)}
                            errorMessage={errors.answer?.message}
                            size="lg"
                            placeholder="Write your answer here"
                            className="w-full"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              color="primary"
                              isLoading={statusAnswer === "loading"}
                              type="submit"
                            >
                              Send Answer
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <p>You are not allowed to answer</p>
                      )
                    ) : (
                      <p>Complaint is closed</p>
                    )}
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
