import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { getEnv } from "@/lib/utils";
import { UsersRound } from "lucide-react";
import CelpipTestSpeaking from "./celpip/CelpipTestSpeeking";
import Image from "./Images";
import Timer from "./Timer";
import { Alert, AlertDescription } from "./ui/alert";
import type { PromptsWithQuestionAndEvaluation } from "@/types/AssessmentTypes.type";
import { useEvaluation } from "@/context/assessmentV3/Evaluation.provider";

const TestInterface = ({
  assessment,
  type,
}: {
  assessment?: PromptsWithQuestionAndEvaluation | null;
  type: string;
}) => {
  // Modal and recording state

  const { isTimeRunning } = useEvaluation();

  if (!assessment) {
    return null;
  }

  return (
    <div className=" bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Prompt */}
          <Card className="!p-0 gap-0 overflow-hidden">
            <CardHeader className="border-b border-slate-200 border-solid py-4 flex items-center flex-wrap justify-between mb-0 !p-4">
              <div className="">
                <span className="font-bold mb-2 inline-block">
                  {assessment.namePrefix}
                  {": "}
                  {assessment.name}
                </span>

                <div>
                  <Badge variant="outline">
                    <UsersRound />
                    {(() => {
                      const now = new Date();
                      return Math.floor(
                        Number(now.getHours() + "" + now.getMinutes()) / +2
                      );
                    })()}{" "}
                    Submitted today
                  </Badge>
                </div>
              </div>
              <div>
                <Alert variant={"info"} className="!py-2 px-8">
                  <AlertDescription className="flex items-center gap-2">
                    <Timer
                      initialTime={assessment.responseTime}
                      isRunning={isTimeRunning}
                    />
                  </AlertDescription>
                </Alert>
              </div>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 ">
              <div className="text-center md:text-start px-4 md:px-8 py-10 border-b md:border-b-0 md:border-e border-solid border-slate-200">
                <h2 className="text-2xl font-semibold mb-6">Task Prompt</h2>
                <Badge className="mb-4">
                  Response time: {assessment.responseTime}
                </Badge>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {assessment?.question.name}
                </p>
                {assessment?.question?.imagePath && (
                  <Image
                    src={
                      getEnv("BASE_ASSETS", "") +
                      assessment?.question?.imagePath
                    }
                  ></Image>
                )}
              </div>
              {/** Recording */}
              <div>
                {(() => {
                  switch (type) {
                    case "speaking":
                      return <CelpipTestSpeaking assessment={assessment} />;
                    // case "writing":
                    //   return (
                    //     <CelpipWritingTest
                    //       assessmentPromptUUID={assessmentPromptUUID}
                    //     />
                    //   );
                    default:
                      return null;
                  }
                })()}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TestInterface;
