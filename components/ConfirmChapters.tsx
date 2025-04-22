"use client";
import { Chapter, Course, Unit } from "@prisma/client";
import React from "react";
import ChapterCard, { ChapterCardHandler } from "./ChapterCard";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  course: Course & {
    units: (Unit & {
      Chapter: Chapter[];
    })[];
  };
};

const ConfirmChapters = ({ course }: Props) => {
  const [loading, setLoading] = React.useState(false);

  const chapterRefs = React.useMemo(() => {
    const refs: Record<string, React.RefObject<ChapterCardHandler | null>> = {};
    course.units.forEach((unit) => {
      unit.Chapter?.forEach((chapter) => {
        refs[chapter.id] = React.createRef<ChapterCardHandler | null>();
      });
    });
    return refs;
  }, [course.units]);

  const [completedChapters, setCompletedChapters] = React.useState<Set<string>>(
    new Set()
  );

  const totalChaptersCount = React.useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + (unit.Chapter?.length || 0);
    }, 0);
  }, [course.units]);

  return (
    <div className="w-full mt-4">
      {course.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="mt-5">
            <h2 className="text-sm uppercase text-secondary-foreground/60">
              Unit {unitIndex + 1}
            </h2>
            <h3 className="text-2xl font-bold">{unit.name}</h3>
            <div className="mt-3">
              {unit.Chapter?.map((chapter, chapterIndex) => {
                return (
                  <ChapterCard
                    completedChapters={completedChapters}
                    setCompletedChapters={setCompletedChapters}
                    ref={chapterRefs[chapter.id]}
                    key={chapter.id}
                    chapter={chapter}
                    chapterIndex={chapterIndex}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-center mt-4">
        <Separator className="flex-[1]" />
        <div className="flex items-center mx-4">
          <Link
            href="/create"
            className={buttonVariants({
              variant: "secondary",
            })}
          >
            <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={4} />
            Back
          </Link>
          {totalChaptersCount === completedChapters.size ? (
            <Link
              className={buttonVariants({
                className: "ml-4 font-semibold",
              })}
              href={`/course/${course.id}/0/0`}
            >
              Save & Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <Button
              type="button"
              className="ml-4 font-semibold"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                (async () => {
                  for (const ref of Object.values(chapterRefs)) {
                    if (ref.current) {
                      await ref.current.triggerLoad();
                      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5s to avoid hitting the rate limit
                    }
                  }
                  setLoading(false);
                })();
              }}
            >
              Generate
              <ChevronRight className="w-4 h-4 ml-2" strokeWidth={4} />
            </Button>
          )}
        </div>
        <Separator className="flex-[1]" />
      </div>
    </div>
  );
};

export default ConfirmChapters;
