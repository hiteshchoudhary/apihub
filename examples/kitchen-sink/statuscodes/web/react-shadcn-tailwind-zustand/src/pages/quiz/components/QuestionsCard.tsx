import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  description: string;
  options: string[];
  correctOption: string;
  questionIndex: number;
  totalQuestions: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
  onOptionClick: (event: React.MouseEvent<HTMLInputElement>) => void;
}
export default function QuestionsCard(props: QuizQuestion) {
  const {
    description,
    questionIndex,
    options,
    totalQuestions,
    setCurrentQuestionIndex,
    onSubmit,
    onOptionClick,
  } = props;
  return (
    <Card className="lg:w-[700px] lg:min-h-[350px] justify-between flex flex-col">
      <CardHeader>
        <p className="text-lg font-semibold">{`${questionIndex + 1}. ${description}`}</p>
      </CardHeader>
      <CardContent>
        <RadioGroup name={`question-${questionIndex}`} onClick={onOptionClick}>
          {options.map((option, optionIndex) => {
            return (
              <div key={optionIndex} className="flex items-center gap-2">
                <RadioGroupItem value={option} />
                <Label htmlFor="option" className="text-sm">
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          onClick={() => {
            setCurrentQuestionIndex((prev) => prev - 1);
          }}
          disabled={questionIndex === 0}
        >
          Prev
        </Button>
        {questionIndex + 1 === totalQuestions ? (
          <Button
            onClick={() => {
              onSubmit();
            }}
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={() => {
              setCurrentQuestionIndex((prev) => prev + 1);
            }}
          >
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
