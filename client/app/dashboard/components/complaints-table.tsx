"use client";
import { Complaint, Status } from "@/app/utils";
import {
  useCloseController,
  useComplaintStore,
  useDeleteController,
  useTakeController,
} from "@/stores/complaints-store";
import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import UserColumn from "./user-column";
import { RiProgress1Line } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import { EditIcon } from "@/app/icons/EditIcon";
import { DeleteIcon } from "@/app/icons/DeleteIcon";
import { EyeIcon } from "@/app/icons/EyeIcon";
import { useParams, usePathname, useRouter } from "next/navigation";
export const statusColorMap = (
  status: string
): {
  color:
    | "primary"
    | "default"
    | "success"
    | "secondary"
    | "warning"
    | "danger"
    | undefined;
  icon: JSX.Element | null | undefined;
} => {
  switch (status) {
    case "Open":
      return {
        color: "default",
        icon: <MdOutlineDoNotDisturbOn size={14} />,
      };
    case "Closed":
      return { color: "success", icon: <FaRegCircleCheck size={14} /> };
    default:
      return { color: "primary", icon: <RiProgress1Line size={14} /> };
  }
};

const columns = [
  { uid: "title", name: "Title" },
  { uid: "author_id", name: "Author" },
  { uid: "status", name: "Status" },
  { uid: "time_created", name: "Time Created" },
  //   { uid: "description", name: "Description" },
  //   { uid: "tags", name: "Tags" },
  { uid: "time_closed", name: "Time Closed" },
  //   { uid: "supporter_id", name: "Supporter" },
  { uid: "actions", name: "Actions" },
];

export default function ComplaintsTable() {
  const complaints = useComplaintStore((state) => state.complaints);
  const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const router = useRouter();
  const pathname = usePathname();

  const openDetail = React.useCallback((complaintId: Complaint["id"]) => {
    router.push(`${pathname}?complaintId=${complaintId}`);
  }, []);

  const renderCell = React.useCallback(
    (complaint: Complaint, columnKey: keyof Complaint) => {
      const cellValue = complaint[columnKey];

      switch (columnKey) {
        case "title":
          return <span>{cellValue as string}</span>;

        case "author_id": {
          return <UserColumn authorId={cellValue as number} />;
        }
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap(cellValue as string).color}
              size="sm"
              variant="flat"
              startContent={statusColorMap(cellValue as string).icon}
            >
              {cellValue as any}
            </Chip>
          );
        case "time_created":
          const date = new Date(cellValue as string);
          return (
            <span>
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          );
        case "description":
          return (
            <div className="max-w-32 truncate overflow-hidden">
              <p className="truncate">{cellValue as string}</p>
            </div>
          );
        case "actions" as any:
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span
                  onClick={() => openDetail(complaint.id)}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete compliant">
                <span
                  onClick={() => useDeleteController.action(complaint.id)}
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        case "time_closed":
          const dateClosed = complaint.time_closed
            ? new Date(complaint.time_closed)
            : new Date();
          return (
            <span>
              {dateClosed.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          );
        default:
          return <span>None</span>;
      }
    },
    []
  );
  const pages = useMemo(() => {
    return complaints?.length ? Math.ceil(complaints?.length / rowsPerPage) : 0;
  }, [complaints?.length, rowsPerPage]);

  return (
    <Table
      aria-label="Rows actions table example with dynamic content"
      selectionMode="multiple"
      selectionBehavior={selectionBehavior as any}
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={complaints}>
        {(complaint) => (
          <TableRow key={complaint.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(complaint, columnKey as keyof Complaint)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
