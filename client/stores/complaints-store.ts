import { ChartFilter, Complaint, Status } from "@/app/utils";
import { getCookie } from "cookies-next";
import { leitenList, leitenRequest } from "leiten-zustand";
import { create } from "zustand";
import { useAuthStore } from "./auth-store";

interface IState {
  complaints: Complaint[];
  filter: ChartFilter;
}

export const useComplaintStore = create<IState>((set) => ({
  complaints: [],
  filter: {},
  setComplaints: (complaints: Complaint[]) =>
    set(() => ({ complaints: complaints })),
}));

export const useGetController = leitenRequest(
  useComplaintStore,
  "complaints",
  async () => {
    const token = getCookie("token");
    // fetch complaints
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/complaints`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const complaints = await response.json();
    return complaints as Complaint[];
  }
);
export const useDeleteController = leitenRequest(
  useComplaintStore,
  "complaints",
  async (id: number) => {
    const token = getCookie("token");
    // fetch complaints
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/complaints/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newComplaints = useComplaintStore
      .getState()
      .complaints.filter((complaint) => complaint.id !== id);

    return newComplaints;
  }
);
export const useTakeController = leitenRequest(
  useComplaintStore,
  "complaints",
  async (id: number) => {
    const token = getCookie("token");
    // fetch complaints
    console.log("id", id);
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/complaints/claim/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const newComplaints = useComplaintStore
      .getState()
      .complaints.map((complaint) => {
        if (complaint.id === id) {
          return {
            ...complaint,
            status: Status.Taken,
            supporter_id: useAuthStore.getState().authUser?.id,
          };
        }
        return complaint;
      });

    return newComplaints;
  }
);
export const useCloseController = leitenRequest(
  useComplaintStore,
  "complaints",
  async ({ id, closeReason }: { id: number; closeReason: string }) => {
    const token = getCookie("token");
    // fetch complaints
    console.log("id", id);
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/complaints/close/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ close_reason: closeReason }),
      }
    );
    const newComplaints = useComplaintStore
      .getState()
      .complaints.map((complaint) => {
        if (complaint.id === id) {
          return {
            ...complaint,
            status: Status.Closed,
            time_closed: new Date(),
          };
        }
        return complaint;
      });

    return newComplaints;
  }
);
