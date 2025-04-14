import CreateCourseForm from "@/components/CreateCourseForm";
import Navbar from "@/components/Navbar";
import { getAuthSession } from "@/lib/auth";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const session = await getAuthSession();
  if (!session) {
    return redirect("/gallery");
  }
  return (
    <>
      <Navbar session={session} />
      <div className="flex flex-col items-start max-w-xl px-8 mx-auto my-18 sm:px-0">
        <h1 className="text-3xl font-bold self-center sm:text-6xl">Coursely</h1>
        <div className="flex p-4 mt-5 border-none bg-secondary">
          <InfoIcon className="w-12 h-12 mr-3 text-blue-400" />
          <div>
            Enter a course title or the topic you wish to learn about, followed
            by a list of units detailing the specific subjects you want to
            cover. Coursely will then generate a comprehensive course for you.
          </div>
        </div>

        <CreateCourseForm />
      </div>
    </>
  );
};

export default page;
