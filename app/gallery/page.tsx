import Navbar from "@/components/Navbar";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import GalleryCourseCard from "@/components/GalleryCourseCard";
const GalleryPage = async () => {
  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: {
          Chapter: true,
        },
      },
    },
  });
  const session = await getAuthSession();
  if (!session) {
    return redirect("/");
  }
  return (
    <>
      <Navbar session={session} />
      <div className="py-8 mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">Gallery</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
            {courses.map((course)=>(
                <GalleryCourseCard key={course.id} course={course}/>
            ))}
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
