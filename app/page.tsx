import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";

export default async function Home() {
  const session = await getAuthSession();
  return (
    <>
      <Navbar session={session} />
      <div className="relative h-screen">Welcome to Coursely</div>
    </>
  );
}
