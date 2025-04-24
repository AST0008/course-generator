import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { createCourseSchema } from "@/validators/course";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (session.user.credits <= 0) {
      return new NextResponse("Insufficient credits", { status: 402 });
    }
    const body = await request.json();
    const { title, units } = createCourseSchema.parse(body);

    type outputUnits = {
      title: string;
      chapters: {
        youtube_search_query: string;
        chapter_title: string;
      }[];
    };

    const prompts = units.map(
      (unit) =>
        `It is your job to create a course about ${title}. The user has requested to create chapters specifically for the unit "${unit}". Provide 3–5 relevant chapters for this unit. Then, for each chapter, provide a *detailed* YouTube search query that can be used to find an informative educational video.`
    );

    console.log("Prompts sent to strict_output:", prompts);
    const output_units: outputUnits[] = await strict_output(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter",
      prompts,
      {
        title: "title of the unit",
        chapters:
          "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object",
      }
    );

    const imageSearchItem = await strict_output(
      "You are an AI capable of finding the most relevant image for a course",
      `Please provide a good image search term for a course about ${title}. This search term will be fed into unsplash API, so make sure its a good search term that will return a good result.`,
      {
        image_search_term: "a good search term for the course",
      }
    );

    const course_image = await getUnsplashImage(
      imageSearchItem.image_search_term
    );
    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
      },
    });

    for (const unit of output_units) {
      const title = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          course: {
            connect: {
              id: course.id,
            },
          },
        },
      });

      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            unitId: prismaUnit.id,
            youtubeSearchQuery: chapter.youtube_search_query,
          };
        }),
      });
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          credits: { decrement: 1 },
        },
      });
    }

    return NextResponse.json({ course_id: course.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    console.error("Unexpected error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
