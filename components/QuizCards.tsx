"use client";

import { Chapter, Question } from "@prisma/client";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";
type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  const [answer, setAnswer] = useState<Record<string, string>>({});
  console.log("answer", answer);
  const [questionState, setQuestionState] = useState<
    Record<string, boolean | null>
  >({});

  const checkAnswers = React.useCallback(() => {
    const newQuestionState: Record<string, boolean | null> = {};
    chapter.questions.forEach((question) => {
      const userAnswer = answer[question.id];
      if (!userAnswer) {
        return;
      }
      if (userAnswer === question.answer) {
        newQuestionState[question.id] = true;
      } else {
        newQuestionState[question.id] = false;
      }
    });
    setQuestionState(newQuestionState);
  }, [answer, chapter.questions, questionState]);

  return (
    <div className="flex-[1] mt-10 ml-8  ">
      <h1 className="text-2xl font-bold">Quiz Cards</h1>
      <div className="mt-2">
        {chapter.questions.map((question) => {
          return (
            <div
              key={question.id}
              className={cn(
                "border-secondary rounded-lg p-3 mb-4",
                questionState[question.id] === true && "bg-green-700",
                questionState[question.id] === false && "bg-red-700",
                questionState[question.id] === null && "bg-secondary"
              )}
            >
              <h1 className="text-lg font-semibold">{question.question}</h1>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(value) =>
                    setAnswer((prev) => ({ ...prev, [question.id]: value }))
                  }
                >
                  {JSON.parse(question.options).map(
                    (option: string, index: number) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={question.id + index.toString()}
                        />
                        <Label htmlFor={question.id + index.toString()}>
                          {option}
                        </Label>
                      </div>
                    )
                  )}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <Button className="mt-2 m-4 w-full" size="lg" onClick={checkAnswers}>
        Check Answers
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default QuizCards;
