import { Button } from "@/components/ui/button";
import { useEvaluation } from "@/context/assessmentV3/Evaluation.provider";
import type {
  EvaluationResult,
  PromptsWithQuestionAndEvaluation,
} from "@/types/AssessmentTypes.type";
import { PenTool, RefreshCcw, SquarePause } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../Timer";
import { toast } from "sonner";

export default function CelpipWritingTest({
  assessment,
}: {
  assessment: PromptsWithQuestionAndEvaluation | null;
}) {
  const [phase, setPhase] = useState<
    "instruction" | "writing" | "review" | "results"
  >("instruction");

  const currentAssessmentRef = useRef<EvaluationResult | null>(null);
  const isTimeRunningRef = useRef<boolean>(false);

  /**
   * this will be used to calculate the time taken to write
   */
  const timeTaken = useRef<number>(0);

  const redirect = useNavigate();

  const {
    startAssessment,
    resetAssessment,
    stopAssessment,
    isTimeRunning,
    currentAssessment,
    isLocked,
  } = useEvaluation();

  if (currentAssessment) {
    currentAssessmentRef.current = currentAssessment;
    isTimeRunningRef.current = isTimeRunning;
  }

  // Modal and writing state

  const [writtenResponse, setWrittenResponse] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Start writing
  const startWriting = useCallback(async () => {
    await startAssessment({
      promptUUID: assessment?.promptUuid || "",
      questionUUID: assessment?.question.uuid || "",
    });
    setWrittenResponse("");
    if (timeTaken.current === 0) timeTaken.current = Date.now();
    // Clear any previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setPhase("writing");

    // Focus on textarea after state update
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  }, [assessment?.promptUuid, assessment?.question.uuid, startAssessment]);

  const reset = useCallback(() => {
    timeTaken.current = 0;
    setPhase("instruction");
    setWrittenResponse("");
    setIsSubmitting(false);
    resetAssessment();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const retakeWriting = () => {
    reset();

    // Clear any previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeout(() => startWriting(), 200);
  };

  // Submit written response
  const submitWriting = async () => {
    if (!writtenResponse.trim()) return;
    setIsSubmitting(true);

    if (isLocked(assessment!)) {
      toast.error(
        "You have reached the maximum number of attempts. Please try again later."
      );
      return;
    }

    if (!assessment) return;
    if (currentAssessmentRef.current?.evaluationUuid) {
      try {
        const result = await stopAssessment({
          type: "writing",
          evaluationUUID: currentAssessmentRef.current?.evaluationUuid,
          text: writtenResponse,
          timeTaken: timeTaken.current, // in seconds
        });

        if (result) {
          redirect(
            `/test/writing/${assessment.promptUuid}/result?evaluationUUID=${result.data.evaluationUUID}`
          );
        }
      } catch (err) {
        console.error("Error submitting writing:", err);
      }
    }
    setIsSubmitting(false);
  };

  const handleStop = useCallback(() => {
    timeTaken.current = Math.round((Date.now() - timeTaken.current) / 1000);
    resetAssessment();
    setPhase("review");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [resetAssessment]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWrittenResponse(e.target.value);
  };

  const wordCount = writtenResponse
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="text-center bg-blue-50 px-4 py-10">
      {phase === "instruction" && (
        <>
          <h3 className="text-xl font-semibold mb-4">Ready to Write?</h3>
          <p className="text-muted-foreground mb-8">
            Click the button below to start writing. You'll have{" "}
            {assessment?.responseTime} seconds to complete your response. Make
            sure you have a clear understanding of the prompt before beginning.
          </p>
          <Button size="lg" onClick={startWriting} variant={"gradient-green"}>
            <PenTool className="w-5 h-5 mr-2" />
            Start Writing
          </Button>
        </>
      )}

      {phase === "writing" && (
        <>
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Writing in Progress</h3>
          <p className="text-muted-foreground mb-4">
            Write your response clearly and thoroughly. Time remaining:{" "}
            <Timer
              initialTime={
                currentAssessmentRef.current?.promptQuestion.celpTestPrompt
                  .responseTime || 0
              }
              onTimeUp={() => handleStop()}
              isRunning={isTimeRunningRef.current}
              inline
            />
            seconds
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Word count: {wordCount}
          </p>

          <div className="max-w-6xl mx-auto mb-6">
            <textarea
              ref={textareaRef}
              value={writtenResponse}
              onChange={handleTextChange}
              className="w-full h-96 p-4 bg-white border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start writing your response here..."
              disabled={isSubmitting}
            />
          </div>

          <Button
            size="lg"
            variant="destructive"
            onClick={handleStop}
            disabled={isSubmitting}
          >
            <SquarePause />
            Stop Writing
          </Button>
        </>
      )}

      {phase === "review" && (
        <>
          <h3 className="text-xl font-semibold mb-4">Writing Complete</h3>
          <p className="text-muted-foreground mb-4">
            Your response contains {wordCount} words. You can review it before
            submitting.
          </p>

          {/* Response Preview */}
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-white p-6 border border-gray-200 rounded-lg text-left">
              <h4 className="font-semibold mb-3 text-center">Your Response:</h4>
              <div className="whitespace-pre-wrap text-gray-700 max-h-60 overflow-y-auto">
                {writtenResponse}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => {
                retakeWriting();
              }}
              disabled={isSubmitting}
            >
              <RefreshCcw /> Write Again
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={submitWriting}
              variant={"gradient-green"}
              disabled={isSubmitting || !writtenResponse.trim()}
              size={"lg"}
            >
              Submit for Analysis
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
