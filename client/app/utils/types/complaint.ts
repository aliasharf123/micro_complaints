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
  author_id?: number;
  supporter_id?: number;
  time_created?: Date;
  time_closed?: Date;
}
