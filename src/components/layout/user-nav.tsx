"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-login";
import { Separator } from "../ui/separator";
import { UserAvatarProfile } from "../user-avatar-profile";
import { useUserStore } from "@/context/stores/user.store";
import { useRouter } from "next/navigation";
export function UserNav() {
  const router = useRouter();
  const { mutateAsync: handleLogout } = useLogout();
  const { user, clearUser } = useUserStore();

  const onLogout = async () => {
    await handleLogout();
    clearUser();
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <UserAvatarProfile user={user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">{user.name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <Separator className="mb-1" />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/dashboard/profile")}
          >
            <DropdownMenuItem>Perfíl</DropdownMenuItem>
          </DropdownMenuItem>
          <Separator className="mb-1 mt-1" />
          <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
