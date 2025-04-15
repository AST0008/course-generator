import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
  if (!course) {
    return redirect("/create");
  }

//   return <pre>{JSON.stringify(course, null, 2)}</pre>;
return (
    <div className="flex flex-col items-start max-w-xl mx-auto my-16">
        <h5 className="text-sm uppercase text-secondary-foreground/60">
            Course Name
        </h5>
        <h1 className="text-5xl font-bold">
            {course.name}
        </h1>

    </div>
)
};

export default CreateChapter;
