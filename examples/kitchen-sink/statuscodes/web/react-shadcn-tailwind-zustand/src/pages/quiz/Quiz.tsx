import { PageContainer } from "@/layout";
import { StatusListType } from "@/services/types";
import { useAppStore } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { QuestionsCard } from "./components";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  description: string;
  options: string[];
  correctOption: string;
}
function generateQuizFromStatusCodesList(HTTPStatusCodesList: StatusListType) {
  const descriptions: string[] = [];
  const descriptionsToStatus: Record<string, string> = {};

  // Collect descriptions and their corresponding correct status codes
  Object.values(HTTPStatusCodesList).forEach((category) => {
    category.statusCodes.forEach((status) => {
      descriptions.push(status.description);
      descriptionsToStatus[status.description] = status.code;
    });
  });

  // Shuffle descriptions
  descriptions.sort(() => Math.random() - 0.5);

  const askedDescriptions: Set<string> = new Set();

  // Function to get random incorrect status codes
  function getRandomIncorrectStatusCodes(correctCode: string): string[] {
    const allStatusCodes: string[] = [];
    Object.values(HTTPStatusCodesList).forEach((category) => {
      category.statusCodes.forEach((status) => {
        allStatusCodes.push(status.code);
      });
    });
    const incorrectCodes = allStatusCodes.filter(
      (code) => code !== correctCode
    );
    return incorrectCodes.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  const questions: QuizQuestion[] = [];
  // Generate quiz questions
  function generateQuestion(): void {
    if (descriptions.length === 0) {
      return;
    }

    const description = descriptions.pop();
    if (!description) return;

    askedDescriptions.add(description);

    const correctCode = descriptionsToStatus[description];
    const incorrectCodes = getRandomIncorrectStatusCodes(correctCode);
    const options: string[] = [correctCode, ...incorrectCodes];

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    questions.push({
      description,
      options,
      correctOption: correctCode,
    });

    // Call generateQuestion recursively
    generateQuestion();
  }

  // Start generating questions
  generateQuestion();
  return questions;
}

export default function Quiz() {
  const { HTTPStatusCodesList, quizScore, setQuizScore } = useAppStore();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [score, setScore] = useState<number | null>(null);

  const setQuiz = useCallback(() => {
    const questions = generateQuizFromStatusCodesList(HTTPStatusCodesList);
    if (questions.length > 0) {
      setQuizQuestions(questions);
    }
  }, [HTTPStatusCodesList]);

  useEffect(() => {
    setQuiz();
  }, [setQuiz]);

  function onSubmit() {
    let score = 0;
    Object.entries(userAnswers).forEach(([questionIndex, answer]) => {
      if (
        `${quizQuestions[parseInt(questionIndex)].correctOption}` ===
        `${answer}`
      ) {
        score += 1;
      }
    });
    setScore(score);
    setQuizScore(score);
  }
  const isFreshQuiz =
    score === null &&
    Object.keys(userAnswers).length === 0 &&
    currentQuestionIndex === 0;
  return (
    <PageContainer>
      <div className="flex flex-col items-center w-full h-full gap-8">
        <div className="flex flex-col items-center w-full h-full gap-8 lg:w-[700px]">
          <div className="flex items-center justify-between w-full gap-4">
            <h1 className="text-4xl">Quiz</h1>
            <span className="text-sm">
              Attempted: {Object.keys(userAnswers).length} /{" "}
              {quizQuestions.length}
            </span>
          </div>
          <div className="flex flex-col items-center h-full gap-8">
            {score === null && quizQuestions[currentQuestionIndex] && (
              <QuestionsCard
                {...quizQuestions[currentQuestionIndex]}
                questionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                totalQuestions={quizQuestions.length}
                onSubmit={onSubmit}
                value={userAnswers[currentQuestionIndex]}
                onOptionClick={(option) => {
                  setUserAnswers((prev) => {
                    const _prev = { ...prev };
                    if (_prev[currentQuestionIndex] === option) {
                      delete _prev[currentQuestionIndex];
                      return _prev;
                    }
                    return {
                      ...prev,
                      [currentQuestionIndex]: option,
                    };
                  });
                }}
              />
            )}
          </div>
          {score !== null && (
            <div className="flex flex-col items-center gap-4">
              <p>Your score: {score}</p>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-md"
                onClick={() => {
                  setScore(null);
                  setCurrentQuestionIndex(0);
                  setUserAnswers({});
                  setQuiz();
                }}
              >
                Restart
              </button>
            </div>
          )}
          {quizQuestions.length === 0 && <p>No quiz questions available.</p>}
          {/* End Quiz */}

          {score === null ? (
            <div className="flex items-center justify-between w-full h-full gap-8">
              <div className="flex items-center justify-end w-full">
                <Button
                  onClick={() => {
                    onSubmit();
                  }}
                  className="text-white bg-red-500 hover:bg-red-600"
                >
                  End Quiz
                </Button>
              </div>

              {!isFreshQuiz ? (
                <Button
                  onClick={() => {
                    setScore(null);
                    setCurrentQuestionIndex(0);
                    setUserAnswers({});
                    setQuiz();
                  }}
                  className="text-white bg-green-600 hover:bg-green-700"
                >
                  Restart Quiz
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="flex w-full gap-4">
            {<p> Last Score: {quizScore.lastScore}</p>}|
            {<p> Highest Score: {quizScore.highScore}</p>}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
