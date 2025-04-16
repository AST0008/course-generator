import { Chapter, Course, Unit } from "@prisma/client";
import React from "react";
import ChapterCard from "./ChapterCard";
import { Separator } from "./ui/separator";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

type Props = {
  course: Course & {
    units: (Unit & {
      Chapter: Chapter[];
    })[];
  };
};

const ConfirmChapters = ({ course }: Props) => {
  console.log("Course", course.units);
  return (
    <div className="grid grid-cols-1 gap-6 mt-4">
      {course.units.map((unit, unitIndex) => (
        <div key={unit.id} className="space-y-3">
          <div className="flex items-center justify-center mx-auto border-b border-secondary-foreground/50 py-4">
            <h2 className="text-sm  uppercase text-secondary-foreground/60">
              Unit {unitIndex + 1}
            </h2>
            <h3 className="text-2xl mx-6 font-bold">{unit.name}</h3>
          </div>
          <div className="space-y-2">
            {unit.Chapter.map((chapter, chapterIndex) => {
              return (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  chapterIndex={chapterIndex}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center mt-4 ">
        <Separator className="flex-[1]" />
        <div className="flex items-center mx-4 ">
            <Link href="/create"  className={buttonVariants({ variant: "default" })}>
            
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmChapters;

