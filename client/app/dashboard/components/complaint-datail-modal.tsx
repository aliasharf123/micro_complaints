"use client";
import { useAuthStore } from "@/stores";
import { useComplaintStore } from "@/stores/complaints-store";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import React from "react";
import { FaPlus } from "react-icons/fa6";

export default function ComplaintDetailModal() {
  const complaints = useComplaintStore((state) => state.complaints);
  const complaintId = Number(useSearchParams().get("complaintId"));

  const complaint = React.useMemo(
    () =>
      complaintId
        ? complaints.filter((complaint) => complaint.id == complaintId)[0]
        : null,
    [complaintId]
  );

  return (
    <Modal isOpen={!complaint ? false : true}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody>
              <p>{complaint?.description}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
