export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "TECHNICIAN";
}

export interface ILoginPayload {
  email: string;
  password: string;
}