"use client";
import { Complaint, Status, statusOptions } from "@/app/utils";
import {
  useComplaintStore,
  useDeleteController,
  useGetController,
} from "@/stores/complaints-store";
import {
  Chip,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
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
import { DeleteIcon } from "@/app/icons/DeleteIcon";
import { EyeIcon } from "@/app/icons/EyeIcon";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SearchIcon } from "@/app/icons/SearchIcon";
import { Button, Dropdown } from "@nextui-org/react";
import { ChevronDownIcon } from "@/app/icons/ChevronDownIcon";
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
  const statusDelete = useDeleteController((state) => state.status);
  const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");
  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [filterValue, setFilterValue] = React.useState("");
  const status = useGetController((state) => state.status);
  const rowsPerPage = 6;
  const router = useRouter();
  const pathname = usePathname();

  const hasSearchFilter = Boolean(filterValue);

  const openDetail = React.useCallback((complaintId: Complaint["id"]) => {
    router.push(`${pathname}?complaintId=${complaintId}`);
  }, []);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...complaints];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((complaint) =>
        complaint.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== 3) {
      console.log(statusFilter, "statusFilter");
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [complaints, filterValue, statusFilter]);

  const pages = useMemo(() => {
    return complaints?.length ? Math.ceil(complaints?.length / rowsPerPage) : 0;
  }, [complaints?.length, rowsPerPage]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

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
                  {statusDelete === "loading" ? (
                    <Spinner color="danger" size="sm" />
                  ) : (
                    <DeleteIcon />
                  )}
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
              {complaint.time_closed ? (
                dateClosed.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              ) : (
                <span className="text-default-500 text-small">
                  Not closed yet
                </span>
              )}
            </span>
          );
        default:
          return <span>None</span>;
      }
    },
    []
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  return (
    <div className="grid gap-3">
      <div className="flex justify-between">
        <Input
          aria-label="search"
          className="max-w-[300px] "
          classNames={{
            base: "px-1",
            inputWrapper:
              "bg-default-400/20 data-[hover=true]:bg-default-500/30 group-data-[focus=true]:bg-default-500/20",
            input:
              "placeholder:text-default-600 group-data-[has-value=true]:text-foreground",
          }}
          isClearable
          value={filterValue}
          labelPlacement="outside"
          placeholder="Search by title..."
          onClear={() => onClear()}
          onValueChange={onSearchChange}
          startContent={<SearchIcon />}
        />
        <div>
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="flat"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter as any}
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <Table
        aria-label="Rows actions table example with dynamic content"
        selectionMode="multiple"
        selectionBehavior={selectionBehavior as any}
        classNames={{
          table: status !== "loaded" ? "min-h-[400px]" : "",
        }}
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
        <TableBody
          isLoading={status === "loading"}
          emptyContent={"No rows to display."}
          items={items}
          loadingContent={<Spinner label="Loading..." />}
        >
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
    </div>
  );
}
