import { Button } from "@/components/ui/button";
import { PenTool, RefreshCcw, SquarePause } from "lucide-react";
import Timer from "../Timer";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAssessment } from "@/context/assessmentV2/useAssessment";
import type { EvaluationResponse } from "@/types/AssessmentTypes.types";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

export default function CelpipWritingTest({
  assessmentPromptUUID,
}: {
  assessmentPromptUUID: string;
}) {
  const [phase, setPhase] = useState<
    "instruction" | "writing" | "review" | "results"
  >("instruction");

  const redirect = useNavigate();

  const { getAssessmentHistory, isTimeRunning, setIsTimeRunning } =
    useAssessment();

  const runningAssessment = getAssessmentHistory(assessmentPromptUUID);

  // Modal and writing state
  const { setAsCompleted, setIsStarted } = useAssessment();

  const [responseTime, setResponseTime] = useState<number>(
    runningAssessment?.responseTime || 60
  );

  const [writtenResponse, setWrittenResponse] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Start writing
  const startWriting = useCallback(async () => {
    setIsStarted(runningAssessment?.promptUUID || "");
    setWrittenResponse("");
    setResponseTime(runningAssessment?.responseTime || 35);

    // Clear any previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsTimeRunning(true);
    setPhase("writing");

    // Focus on textarea after state update
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  }, [
    runningAssessment?.responseTime,
    runningAssessment?.promptUUID,
    setIsStarted,
  ]);

  const reset = useCallback(() => {
    setPhase("instruction");
    setIsTimeRunning(false);
    setResponseTime(runningAssessment?.responseTime || 126);
    setWrittenResponse("");
    setIsSubmitting(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [runningAssessment?.responseTime]);

  useEffect(() => {
    if (isTimeRunning) {
      let timeC = responseTime;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        if (timeC <= 0) {
          handleStop();
          clearInterval(timerRef.current!);
          timerRef.current = null;
        }
        timeC = timeC - 1;
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimeRunning, responseTime]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const retakeWriting = () => {
    setWrittenResponse("");
    setResponseTime(runningAssessment?.responseTime || 126);
    setIsTimeRunning(false);

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

    try {
      const res = await api.post<EvaluationResponse>(
        `/celpip/writing?promptUUID=${runningAssessment?.promptUUID}&questionUUID=${runningAssessment?.questionUUID}&targetingScore=${runningAssessment?.targetingScore}`,
        {
          text: writtenResponse,
        },
        {
          timeout: 60000, // 60 seconds timeout
        }
      );

      console.log("Response from server:", res.data);

      // Save to history after successful test
      if (runningAssessment?.promptUUID && res.data) {
        setAsCompleted(runningAssessment?.promptUUID, res.data);
        redirect(`/test/writing/${runningAssessment?.promptUUID}/result`);
      }
    } catch (err) {
      console.error("Error submitting writing:", err);
    }
    setIsSubmitting(false);
  };

  const handleStop = useCallback(() => {
    setIsTimeRunning(false);
    setPhase("review");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWrittenResponse(e.target.value);
  };

  if (!runningAssessment) {
    return null;
  }

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
            Click the button below to start writing. You'll have {responseTime}{" "}
            seconds to complete your response. Make sure you have a clear
            understanding of the prompt before beginning.
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
              initialTime={responseTime}
              onTimeUp={() => handleStop()}
              isRunning={isTimeRunning}
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
