import ConfirmChapters from "@/components/ConfirmChapters";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    courseId: string;
  };
};

const CreateChapter = async ({ params: { courseId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/gallery");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          Chapter: true,
        },
      },
    },
  });

  // Transform "Chapter" to "chapters"
  const transformedCourse = {
    ...course,
    units: course?.units.map((unit) => ({
      ...unit,
      chapters: unit.Chapter,
    })),
  };

  if (!course) {
    return redirect("/create");
  }

  //   return <pre>{JSON.stringify(course, null, 2)}</pre>;
  return (
    <div className="flex flex-col items-start max-w-xl mx-auto my-16">
      <h5 className="text-sm uppercase text-secondary-foreground/60">
        Course Name
      </h5>
      <h1 className="text-5xl font-bold">{course.name}</h1>

      <div className="flex p-4 mt-5 border-none bg-secondary">
        <Info className="w-12 h-12 mr-3 text-blue-400" />
        <div>
          We generated Chapters for each of your units. Look over them and click
          the Button to confirm and continue.
        </div>
      </div>
        <ConfirmChapters course={course} />
    </div>
  );
};

export default CreateChapter;
