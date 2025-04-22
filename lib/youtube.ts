import axios from "axios";
import { YoutubeTranscript } from "youtube-transcript";
import { strict_output } from "./gpt";
export async function searchYoutube(query: string) {
  try {
    query = encodeURIComponent(query);
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      console.error("YouTube API key is not set in environment variables");
      return null;
    }

    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&maxResults=1`
    );

    if (!data) {
      console.error("No data received from YouTube API");
      return null;
    }

    if (!data.items || data.items.length === 0) {
      console.error("No videos found for query:", query);
      return null;
    }

    return data.items[0].id.videoId;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        console.error(
          "YouTube API Error: Forbidden. Please check your API key and quota."
        );
      } else if (error.response?.status === 400) {
        console.error(
          "YouTube API Error: Bad Request. Please check your query parameters."
        );
      } else {
        console.error("YouTube API Error:", error.message);
      }
    } else {
      console.error("Error searching YouTube:", error);
    }
    return null;
  }
}

export async function getTranscript(videoId: string) {
  try {
    let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });
    let transcript = "";
    for (let t of transcript_arr) {
      transcript += `${t.text}\n`;
    }
    return transcript;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getQuestionsFromTranscript(
  transcript: string,
  course_title: string
) {
  type Question = {
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
  };
  const questions = await strict_output(
    "You are a helpful assistant that can generate questions and answers from a transcript, the length of each answer should be 15 words or less. The transcript is provided below. ",
    new Array(5).fill(
      `You are to generate a random hard mcq question about ${course_title} with context from the transcript:${transcript}.`
    ),
    {
      question: "a clear and concise question about the topic",
      answer: "the correct answer with max length 15 words",
      option1: "first incorrect option with max length 15 words",
      option2: "second incorrect option with max length 15 words",
      option3: "third incorrect option with max length 15 words",
    }
  );
  return questions;
}
