import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import CourseSideBar from "@/components/CourseSideBar";
import MainVideoSummary from "@/components/MainVideoSummary";

type Props = {
  params: {
    slug: string[];
  };
};

const CoursePage = async ({ params }: Props) => {
  const { slug } = params;
  const [courseId, UnitIndexParam, ChapterIndexParam] = slug;
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          Chapter: {
            include: {
              questions: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return redirect("/gallery");
  }
  let unitIndex = UnitIndexParam ? parseInt(UnitIndexParam) : 0;
  let chapterIndex = ChapterIndexParam ? parseInt(ChapterIndexParam) : 0;

  const unit = course.units[unitIndex];
  if (!unit) {
    return redirect("/gallery");
  }

  const chapter = unit.Chapter[chapterIndex];
  if (!chapter) {
    return redirect("/gallery");
  }
  return(
    <div>

        <CourseSideBar course={course} currentChapter = {chapter.id} />
    <div className="ml-[400px] px-8">
     <div className="flex">
        <MainVideoSummary chapterIndex={chapterIndex} unit={unit} chapter={chapter} unitIndex={unitIndex} />
        {/* <QuizCards chapter={chapter} /> */}
     </div>
    </div>
    </div>
  );
};

export default CoursePage;
