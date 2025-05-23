"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Brain, Lightbulb, CheckCircle, XCircle } from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type QuizResult = {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
};

type QuizForm = {
  answers: { [key: string]: string };
};

interface AIGeneratedQuizProps {
  courseId: string;
  lessonId: string;
}

export default function AIGeneratedQuiz({
  courseId,
  lessonId,
}: AIGeneratedQuizProps) {
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<QuizForm>();
  const { toast } = useToast();
  const formData = watch(); // Watch form data in real-time

  const generateQuiz = async () => {
    setIsLoading(true);
    setIsSubmitted(false);
    setResults([]);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      setQuizId(data.quizId);
      setQuestions(data.questions);
      reset();
      toast({
        title: "Quiz Generated",
        description: "Your AI-generated quiz is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: QuizForm) => {
    if (!quizId) return;
    try {
      console.log("Form data before submit:", data.answers); // Debug form data
      console.log("Sending to backend:", {
        quizId,
        answers: data.answers,
        courseId,
      }); // Debug payload
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answers: data.answers, courseId }),
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const result = await res.json();
      console.log("Quiz results from backend:", result); // Debug full backend response
      setResults(result.results);
      setIsSubmitted(true);
      toast({
        title: "Quiz Submitted",
        description: `Your score: ${result.score}%${
          result.passed ? " (Passed)" : ""
        }`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz.",
        variant: "destructive",
      });
    }
  };

  const resetQuiz = () => {
    setQuizId(null);
    setQuestions([]);
    setResults([]);
    setIsSubmitted(false);
    reset();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI-Generated Quiz</h3>
        <Button onClick={generateQuiz} disabled={isLoading}>
          <Brain className="h-4 w-4 mr-2" />
          {isLoading ? "Generating..." : "Generate New Quiz"}
        </Button>
      </div>
      <div className="p-4 bg-primary/5 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <p className="text-sm">
            This quiz is generated by AI based on the content of this lesson.
          </p>
        </div>
      </div>
      {questions.length > 0 ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {questions.map((question, index) => {
            const result = results.find((r) => r.questionId === question.id);
            console.log(`Question ${question.id} options:`, question.options); // Debug options
            console.log(`Question ${question.id} result:`, result); // Debug result
            console.log(
              `Question ${question.id} form value:`,
              formData.answers?.[question.id]
            ); // Debug form value
            return (
              <Card key={question.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="font-medium">
                      {index + 1}. {question.text}
                    </p>
                    {isSubmitted && result && (
                      <span>
                        {result.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  <RadioGroup
                    className="space-y-2"
                    disabled={isSubmitted}
                    value={formData.answers?.[question.id] || ""}
                    onValueChange={(value) => {
                      // Manually set the selected value
                      // Use setValue from useForm
                      setValue(`answers.${question.id}`, value);
                    }}
                  >
                    {question.options.map((option, i) => {
                      const isSelected = isSubmitted
                        ? result?.selectedAnswer === option
                        : formData.answers?.[question.id] === option;
                      const isCorrect = result?.correctAnswer === option;
                      const optionStyle =
                        isSubmitted && result
                          ? isCorrect
                            ? "bg-green-100"
                            : isSelected && !isCorrect
                            ? "bg-red-100"
                            : ""
                          : "";

                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-2 p-2 rounded-md ${optionStyle}`}
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${i}`}
                          />
                          <Label htmlFor={`${question.id}-${i}`}>
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>

                  {isSubmitted && result && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-md">
                      <p className="text-sm font-medium">Explanation:</p>
                      <p className="text-sm">{result.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {isSubmitted ? (
            <Button type="button" onClick={resetQuiz} className="w-full">
              Try Another Quiz
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Submit Answers
            </Button>
          )}
        </form>
      ) : (
        <p className="text-muted-foreground">
          Click "Generate New Quiz" to start.
        </p>
      )}
    </div>
  );
}
