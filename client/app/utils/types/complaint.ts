export enum Status {
  Open = "Open",
  Taken = "Taken",
  Closed = "Closed",
}

export interface Complaint {
  id: number;
  title: string;
  description?: string;
  status: Status;
  tags?: string;
}
