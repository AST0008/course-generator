"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import UserAvatar from "./UserAvatar";

type Props = {
  user: User;
};

const UserAccountNav = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user.name}</p>}
            {user?.email && (
              <p className="w-[200px] truncate text-sm text-secondary-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-700"
          onSelect={() => signOut()}
        >
          Sign Out
          <LogOut className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
