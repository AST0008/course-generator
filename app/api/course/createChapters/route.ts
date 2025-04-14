import { strict_output } from "@/lib/gpt";
import { createCourseSchema } from "@/validators/course";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
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

    console.log("Output units", output_units);
    return NextResponse.json(output_units);
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    console.error("Unexpected error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
