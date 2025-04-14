"use client";
import UserAccountNav from "./UserAccountNav";
import SignInButton from "./SignInButton";
import Link from "next/link";
import { Session } from "next-auth";
import { ModeToggle } from "./mode-toggle";

type Props = {
  session: Session | null;
};

const Navbar = ({ session }: Props) => {
  return (
    <nav className="w-full bg-zinc-500 text-white px-4 py-4 pointer-events-auto shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold border-b-4 border-white">
          Coursely
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/gallery">Gallery</Link>

          {session?.user && (
            <>
              <Link href="/create">Create</Link>
              <Link href="/settings">Settings</Link>
            </>
          )}
          <ModeToggle />
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
