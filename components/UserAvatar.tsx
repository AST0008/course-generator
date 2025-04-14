import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { User } from "next-auth";

type Props = {
  user: User;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <Avatar>
      {user.image ? (
        <div className="relative cursor-pointer aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback className="sr-only">
          <span>
            {user?.name?.charAt(0)}
            {user?.name?.charAt(1)}
          </span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
