export enum Role {
  Complainer = "complainer",
  Admin = "admin",
  Support = "support",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  photo?: string;
}
