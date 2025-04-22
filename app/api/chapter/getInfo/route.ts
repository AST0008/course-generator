//api/chapter/getInfo

import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sleep = async () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

const bodyParser = z.object({
  chapterId: z.string(),
});

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          message: "Chapter not found",
        },
        { status: 404 }
      );
    }

    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "YouTube API Error: Forbidden. Please ensure: 1) Your API key is valid and in the .env file, 2) The YouTube Data API v3 is enabled in your Google Cloud Console project, 3) Your API key has the correct restrictions set up.",
        },
        { status: 404 }
      );
    }

    let transcript = await getTranscript(videoId);
    if (!transcript) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not get transcript",
        },
        { status: 404 }
      );
    }

    let maxLength = 300;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const { summary }: { summary: string } = await strict_output(
      "You are a helpful assistant that can summarize a transcript. The transcript is provided below. Please summarize the transcript in 250 words or less, also dont include any sponsors or unrelevant information.",
      transcript,
      { summary: "string" }
    );

    const questions = await getQuestionsFromTranscript(
      transcript,
      chapter.name
    );

    // Validate questions before creating them
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate questions",
        },
        { status: 500 }
      );
    }

    // Ensure all required fields are present
    const validQuestions = questions.filter(
      (q) => q.question && q.answer && q.option1 && q.option2 && q.option3
    );

    if (validQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid questions generated",
        },
        { status: 500 }
      );
    }

    await prisma.question.createMany({
      data: validQuestions.map((question) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await prisma.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Chapter updated successfully",
    });
  } catch (error) {
    console.error("Error in getInfo:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          error: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
