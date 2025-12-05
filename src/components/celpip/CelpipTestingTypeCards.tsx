import { cn } from "@/lib/utils";
import type { TestType } from "@/types/AssessmentTypes.type";
import { Mic, PenTool } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Link } from "react-router-dom";
import { useAssessment } from "@/context/assessmentV2/useAssessment";

export default function TestingTypeCards() {
  // Fetch task types from API

  const { taskTypes, isLoading, history } = useAssessment();

  const taskTypeMetaDataMap: Record<
    TestType["slug"],
    {
      icon?: React.ReactElement;
      bgClassName?: string;
    }
  > | null = {
    speaking: {
      icon: <Mic className="w-12 h-12" />,
      bgClassName: "from-green-500 to-green-600",
    },
    writing: {
      icon: <PenTool className="w-12 h-12" />,
      bgClassName: "from-blue-500 to-blue-600",
    },
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        taskTypes.map((type) => {
          const contCompleted = history?.filter(
            (h) => h.assessmentType === type.slug && h.isCompletedOnce
          ).length;
          const countTotalPrompt = type.testPrompts.length;
          const completedPercentage =
            ((contCompleted || 0) / countTotalPrompt) * 100;

          return (
            <Card
              className="p-0 hover:shadow-lg transition-shadow overflow-hidden"
              key={type.id}
            >
              <div
                className={cn(
                  "bg-gradient-to-br  p-8 text-white",
                  taskTypeMetaDataMap[type.slug]?.bgClassName
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  {taskTypeMetaDataMap[type.slug]?.icon}
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {contCompleted}/{countTotalPrompt}
                    </div>
                    <div className="text-blue-100">Tasks Completed</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{type.title}</h3>
                <p className="text-blue-100 mb-6">{type.shortDescription}</p>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm text-gray-600">
                      {Number(completedPercentage).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "bg-blue-500 h-2 rounded-full transition-all bg-gradient-to-br duration-500",
                        taskTypeMetaDataMap[type.slug]?.bgClassName
                      )}
                      style={{
                        width: `${Number(completedPercentage).toFixed(2)}%`,
                      }}
                    />
                  </div>
                </div>

                <Button
                  size="lg"
                  asChild
                  className={cn(
                    "w-full !font-semibold bg-gradient-to-br ",
                    taskTypeMetaDataMap[type.slug]?.bgClassName
                  )}
                >
                  <Link to={"test/" + type.slug}>Start {type.title}</Link>
                </Button>
              </div>
            </Card>
          );
        })
      )}
    </>
  );
}
