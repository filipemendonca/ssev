import { ROLE } from "@/enum/role.enum";

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: ROLE;
}
