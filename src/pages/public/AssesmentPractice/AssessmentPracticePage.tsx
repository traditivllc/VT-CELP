import ResultsPage from "@/components/ResultsPage";
import TestInterface from "@/components/TestInterface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAssessment } from "@/context/assessmentV2/useAssessment";
import { cn } from "@/lib/utils";
import type {
  AssessmentHistory,
  TAssessmentType,
} from "@/types/AssessmentTypes.types";
import { AlignLeft, ArrowLeft, Check, Lock, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const PracticePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showResumeAlert, setShowResumeAlert] = useState(false);

  const redirect = useNavigate();
  const { testType, taskTypeUUID, action } = useParams<{
    testType: TAssessmentType;
    taskTypeUUID: string;
    action: "result";
  }>();

  const {
    getPromptsByType,
    restartByPromptId,
    assignQuestionToPrompt,
    getAssessmentHistory,
    isTimeRunning,
  } = useAssessment();

  const prompts = getPromptsByType(testType || "speaking");

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // lg breakpoint
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // setSelectedTask(prompt.id);

  const getTaskStatus = (
    prompt: AssessmentHistory
  ): "completed" | "unlocked" | "locked" => {
    const promptHistory = prompt;
    if (promptHistory?.isCompletedOnce) return "completed";

    return "unlocked";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!prompts) {
    toast.error("text information not available now now");
  }

  useEffect(() => {
    const assessment = getAssessmentHistory(taskTypeUUID || "");

    if (assessment && assessment.isStarted && !assessment.isCompleted) {
      setShowResumeAlert(true);
      return;
    } else {
      setShowResumeAlert(false);
    }

    if (assessment?.isStarted == true) {
      return;
    }
  }, [taskTypeUUID]);

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:-translate-x-full"
        }
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-card border-r flex flex-col transition-transform duration-300 ease-in-out
        ${!sidebarOpen ? "lg:hidden" : ""}
      `}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            {/* Close button for mobile */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold">Speaking Practice</h2>
          <p className="text-sm text-muted-foreground">
            Complete tasks to unlock the next one
          </p>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {prompts.reverse().map((prompt) => {
            const status = getTaskStatus(prompt);

            return (
              <Card
                key={prompt.promptUUID}
                className={cn(
                  `p-4 cursor-pointer transition-all hover:shadow-md `,
                  prompt.promptUUID == taskTypeUUID ? "!border-gray-700" : "",
                  status === "completed"
                    ? "bg-success-light border-success"
                    : status === "unlocked"
                    ? "hover:bg-accent"
                    : "opacity-60 cursor-not-allowed",
                  isTimeRunning ? "opacity-60 cursor-not-allowed" : ""
                )}
                onClick={() => {
                  if (status !== "locked" && !isTimeRunning) {
                    if (prompt.isCompleted) {
                      redirect(`/test/${testType}/${prompt.promptUUID}/result`);
                    } else {
                      redirect(`/test/${testType}/${prompt.promptUUID}`);
                    }

                    // Close sidebar on mobile when task is selected
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {status === "completed" ? (
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-success-foreground" />
                      </div>
                    ) : status === "unlocked" ? (
                      <div className="w-6 h-6 brand-green-gradient rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-primary-foreground fill-current" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {prompt.promptName}
                      </h3>
                      <Badge
                        variant={
                          status === "completed" ? "default" : "secondary"
                        }
                        className={
                          status === "completed"
                            ? "bg-green-500 text-white"
                            : status === "unlocked"
                            ? "bg-blue-500 text-primary-foreground"
                            : ""
                        }
                      >
                        {status === "completed"
                          ? "Done"
                          : status === "unlocked"
                          ? "Ready"
                          : "Locked"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {prompt.promptShortDescription}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-background w-full ">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={toggleSidebar}>
                <AlignLeft className="w-4 h-4" />
              </Button>
              <div></div>
            </div>
            <div className="flex items-center gap-4"></div>
          </div>
        </header>

        {showResumeAlert ? (
          <>
            <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-5">
              <Card>
                <h3 className="font-bold text-center md:text-start">
                  Continue with Previous Prompt?
                </h3>
                <p className=" text-center md:text-start">
                  You didn't completed last test.
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button
                    variant="gradient-green"
                    onClick={() => {
                      if (taskTypeUUID) {
                        restartByPromptId(taskTypeUUID);
                        setShowResumeAlert(false);
                      }
                    }}
                  >
                    Restart with Previous Question
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (taskTypeUUID) {
                        assignQuestionToPrompt({
                          promptUUID: taskTypeUUID,
                          random: true,
                          type: testType || "speaking",
                        });
                        setShowResumeAlert(false);
                      }
                    }}
                  >
                    Start with new Question
                  </Button>
                </div>
              </Card>
            </div>
          </>
        ) : (
          (() => {
            switch (action) {
              case "result":
                return <ResultsPage promptUUID={taskTypeUUID || ""} />;

              default:
                return (
                  <TestInterface
                    assessmentPromptUUID={taskTypeUUID || ""}
                    type={testType || "speaking"}
                  />
                );
            }
          })()
        )}

        {/* {(() => {
          if (runningAssessment?.isStarted && !runningAssessment.isCompleted) {
            
          } else if (runningAssessment?.questionUUID) {
            return <TestInterface />;
          } else {
            return (
              <>
                <div className="p-6 border-b w-full">
                  <Button variant="outline" size="icon" onClick={toggleSidebar}>
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                  <div className="text-center max-w-md px-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Play className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">
                      Choose a Speaking Task
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Select a task from the sidebar to begin your practice
                      session. Complete each task to unlock the next one in the
                      sequence.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <p>🟢 Completed tasks</p>
                      <p>🔵 Available tasks</p>
                      <p>🔒 Locked tasks</p>
                    </div>
                  </div>
                </div>
              </>
            );
          }
        })()} */}
      </div>
    </div>
  );
};

export default PracticePage;
