export type Profile = {
  id: string;
  name: string;
  username: string;
  email: string;
  enableChangePassword: boolean;
  newPassword?: string;
  repeatNewPassword?: string;
  role: string;
};
