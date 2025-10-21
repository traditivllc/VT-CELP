import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { useAssessment } from "@/context/assessmentV2/useAssessment";
import { getEnv } from "@/lib/utils";
import type {
  AssessmentHistory,
  TAssessmentType,
} from "@/types/AssessmentTypes.types";
import { UsersRound } from "lucide-react";
import CelpipTestSpeaking from "./celpip/CelpipTestSpeeking";
import Image from "./Images";
import Timer from "./Timer";
import { Alert, AlertDescription } from "./ui/alert";

import { useEffect, useState } from "react";
import CelpipWritingTest from "./celpip/CelpipTestWriting";

const TestInterface = ({
  assessmentPromptUUID,
  type,
}: {
  assessmentPromptUUID: string;
  type: TAssessmentType;
}) => {
  const [currentAssessment, setCurrentAssessment] =
    useState<AssessmentHistory | null>(null);
  const { assignQuestionToPrompt, isLoading } = useAssessment();

  // Modal and recording state
  const { getPromptsByType, getAssessmentHistory, isTimeRunning } =
    useAssessment();

  useEffect(() => {
    assignQuestionToPrompt({
      promptUUID: assessmentPromptUUID,
      type: type,
      random: true,
    });
    const assessment = getAssessmentHistory(assessmentPromptUUID);

    setCurrentAssessment(assessment);
  }, [isLoading, assessmentPromptUUID]);

  const allPrompts = getPromptsByType(type);

  const currentPromptIndex = allPrompts.findIndex(
    (p) => p.promptUUID === assessmentPromptUUID
  );

  if (!currentAssessment) {
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
                  {currentAssessment?.promptNamePrefix}
                  {": "}
                  {currentAssessment?.promptName}
                </span>

                <div>
                  <Badge variant="outline">
                    <UsersRound />
                    {(() => {
                      const now = new Date();
                      return Math.floor(
                        Number(now.getHours() + "" + now.getMinutes()) /
                          (currentPromptIndex + 2)
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
                      initialTime={currentAssessment.responseTime}
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
                  Response time: {currentAssessment.responseTime}
                </Badge>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {currentAssessment?.questionName}
                </p>
                {currentAssessment?.questionImagePath && (
                  <Image
                    src={
                      getEnv("BASE_ASSETS", "") +
                      currentAssessment?.questionImagePath
                    }
                  ></Image>
                )}
              </div>
              {/** Recording */}
              <div>
                {(() => {
                  switch (type) {
                    case "speaking":
                      return (
                        <CelpipTestSpeaking
                          assessmentPromptUUID={assessmentPromptUUID}
                        />
                      );
                    case "writing":
                      return (
                        <CelpipWritingTest
                          assessmentPromptUUID={assessmentPromptUUID}
                        />
                      );
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
