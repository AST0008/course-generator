import { Course, Unit } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

type Props = {
  course: Course & {
    units: (Unit & {
      Chapter: {
        id: string;
        unitId: string;
        name: string;
        youtubeSearchQuery: string;
        videoId: string | null;
        summary: string | null;
      }[];
    })[];
  };
};

const GalleryCourseCard = ({ course }: Props) => {
  return (
    <>
      <div className="border rounded-lg border-secondary/20 p-4">
        <div className="relative">
          <Link
            href={`/course/${course.id}/0/0`}
            className="relative block w-fit"
          >
            <Image
              src={course.image || ""}
              alt={course.name}
              width={300}
              height={300}
              className="object-cover w-full max-h-[300px] rounded-t-lg"
            />
            <span className="absolute bottom-2 right-2 left-2 w-fit  text-white px-2 py-1 rounded-md bg-black/50">
              {course.name}
            </span>
          </Link>
        </div>
        <div className="p-4">
          <h4 className="text-sm text-secondary/80 ">Units</h4>
          <div className="space-y-1">
            {course.units.map((unit, unitIndex) => (
              <Link
                href={`/course/${course.id}/${unitIndex}/0`}
                key={unit.id}
                className="block underline w-fit"
              >
            {unit.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryCourseCard;
