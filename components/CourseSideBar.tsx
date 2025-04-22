import { Course, Unit, Chapter } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

type Props = {
  course: Course & { 
    units: (Unit & {
      Chapter: Chapter[];
    })[];
  };
  currentChapter: string;
};

const CourseSideBar = async (props: Props) => {
  const { course, currentChapter } = props;
  return (
    <div className="w-[400px] absolute top-1/2 p-8 rounded-r-3xl   bg-secondary/80 -translate-y-1/2">
      <h1 className="text-4xl font-bold">{course.name}</h1>
      {course.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="mt-4">
            <h2 className="text-sm uppercase  text-secondary-foreground">
              Unit {unitIndex + 1}
            </h2>
            <h3 className="text-2xl font-bold">{unit.name}</h3>

            {unit.Chapter.map((chapter, chapterIndex) => {
              return (
                <div key={chapter.id} className="mt-2">
                  <Link
                    href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                    className={cn(
                      "text-secondary-foreground hover:text-primary transition-all duration-300", 
                    {  'text-green-500 font-bold': chapter.id === currentChapter}
                    )}
                  >
                    {chapter.name}
                  </Link>
                  <Separator className="my-2" />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CourseSideBar;
