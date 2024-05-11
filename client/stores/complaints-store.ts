import { ChartFilter, Complaint } from "@/app/utils";
import { getCookie } from "cookies-next";
import { leitenList, leitenRequest } from "leiten-zustand";
import { create } from "zustand";

interface IState {
  complaints: Complaint[];
  filter: ChartFilter;
}

export const useComplaintStore = create<IState>(() => ({
  complaints: [],
  filter: {},
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
