import { UserDTO } from "@/dto/user.dto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserStoreProps = {
  user: UserDTO | null;
  setUser: (user: UserDTO) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStoreProps>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData: UserDTO) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "_e",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
