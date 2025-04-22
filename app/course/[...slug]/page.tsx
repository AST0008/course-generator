import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import CourseSideBar from "@/components/CourseSideBar";
import MainVideoSummary from "@/components/MainVideoSummary";
import QuizCards from "@/components/QuizCards";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
type Props = {
  params: {
    slug: string[];
  };
};

const CoursePage = async ({ params }: Props) => {
  const { slug } = await params;
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
  const nextChapter = unit.Chapter[chapterIndex + 1];
  const previousChapter = unit.Chapter[chapterIndex - 1];
  return (
    <div>
      <CourseSideBar course={course} currentChapter={chapter.id} />
      <div className="ml-[400px] px-8">
        <div className="flex">
          <MainVideoSummary
            chapterIndex={chapterIndex}
            unit={unit}
            chapter={chapter}
            unitIndex={unitIndex}
          />
          <QuizCards chapter={chapter} />
        </div>
        <div className="flex-1 h-[1px] text-gray-500 bg-gray-500"></div>
        <div className="flex pb-8">
          {previousChapter && (
            <Link
              href={`/course/${courseId}/${unitIndex}/${chapterIndex - 1}`}
              className="flex mt-4 mr-auto w-fit hover:opacity-75"
            >
              <div className="flex items-center">
                <ChevronLeft className="w-4 h-4" />
                <div className="flex flex-col items-start ml-2">
                  <span className="text-sm text-secondary-foreground/80">
                    Previous
                  </span>
                  <span className="text-xl font-bold">
                    {previousChapter.name}
                  </span>
                </div>
              </div>
            </Link>
          )}
          {nextChapter && (
            <Link
              href={`/course/${courseId}/${unitIndex}/${chapterIndex + 1}`}
              className="flex mt-4 ml-auto w-fit hover:opacity-75"
            >
              <div className="flex items-center">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm text-secondary-foreground/80">
                    Next
                  </span>
                  <span className="text-xl font-bold">{nextChapter.name}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
