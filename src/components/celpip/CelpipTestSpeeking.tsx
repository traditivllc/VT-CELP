import { Button } from "@/components/ui/button";
import { useEvaluation } from "@/context/assessmentV3/Evaluation.provider";
import { getSupportedMimeType } from "@/lib/utils";
import type {
  EvaluationResult,
  PromptsWithQuestionAndEvaluation,
} from "@/types/AssessmentTypes.type";
import { Lock, Mic, RefreshCcw, SquarePause } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AudioPlayerButton from "../AudioPlayerButton";
import Timer from "../Timer";

export default function CelpipTestDashboard({
  assessment,
}: {
  assessment?: PromptsWithQuestionAndEvaluation | null;
}) {
  const [phase, setPhase] = useState<
    "instruction" | "recording" | "playback" | "results"
  >("instruction");

  const currentAssessmentRef = useRef<EvaluationResult | null>(null);
  const isTimeRunningRef = useRef<boolean>(false);

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

  const promptResponseTime = Number(assessment?.responseTime) || 60;

  const [responseTime, setResponseTime] = useState<number>(promptResponseTime);

  const [recordedTime, setRecordedTime] = useState(0);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);

  // Start recording
  const startRecording = useCallback(async () => {
    await startAssessment({
      promptUUID: assessment?.promptUuid || "",
      questionUUID: assessment?.question.uuid || "",
    });

    setAudioBlob(null);
    setResponseTime(promptResponseTime);

    audioChunks.current = [];

    // Clear any previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      isTimeRunningRef.current = false;
    }

    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mimeType = getSupportedMimeType();
      recorder.current = new MediaRecorder(stream.current, { mimeType });

      recorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      recorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: mimeType });
        setAudioBlob(blob);
        stream.current?.getTracks().forEach((track) => track.stop());

        // Get duration from the actual audio blob
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        audio.addEventListener("loadedmetadata", () => {
          const duration = Math.floor(audio.duration);
          setRecordedTime(duration);
          URL.revokeObjectURL(audioURL); // Clean up
        });
      };
      recorder.current.start();

      resetAssessment();
      setPhase("recording");
      // Start countdown interval only once
    } catch {
      alert("Microphone access denied or error starting recording.");
      resetAssessment();
    }
  }, [promptResponseTime, resetAssessment]);

  const reset = useCallback(() => {
    const currentRecorder = recorder.current;
    if (currentRecorder && currentRecorder.state === "recording") {
      currentRecorder.stop();

      stream.current?.getTracks().forEach((track) => track.stop());
      console.log("stopped status", currentRecorder.state);
    }

    setPhase("instruction");
    resetAssessment();

    setAudioBlob(null);
    setIsSubmitting(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [stopAssessment]);

  useEffect(() => {
    if (recorder.current && isTimeRunning) {
      let timeC = 60;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        if (timeC <= 0) {
          recorder.current?.stop();
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
  }, [isTimeRunning, reset]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const retakeRecording = () => {
    setAudioBlob(null);
    setResponseTime(promptResponseTime);
    // setIsTimeRunning(false);

    // Clear any previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeout(() => startRecording(), 200); // restart after modal rerender
  };

  // Submit audio
  const submitAudio = async () => {
    if (!audioBlob) return;
    if (!currentAssessmentRef.current) {
      toast.error("Something went wrong. unable to submit.");
      return;
    }
    setIsSubmitting(true);

    // Use the original recorded format (webm)
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const promptUUID = assessment?.promptUuid;
    if (recordedTime <= 0) {
      toast.error("No audio recorded. Please try again.");
      return;
    }
    try {
      const result = await stopAssessment({
        type: "speaking",
        evaluationUUID: currentAssessmentRef.current.evaluationUuid,
        formData,
        timeTaken: recordedTime,
      });

      // Save to history after successful test
      if (promptUUID && result) {
        redirect(
          `/test/speaking/${promptUUID}/result?evaluationUUID=${result.data.evaluationUUID}`
        );
      }
    } catch (err) {
      console.error("Error submitting audio:", err);
    }
    setIsSubmitting(false);
  };

  const handleStop = useCallback(() => {
    reset();
    setPhase("playback");
  }, [reset]);

  if (!assessment) {
    return null;
  }

  return (
    <div className="text-center bg-green-50 px-4 py-10">
      {phase === "instruction" && (
        <>
          <h3 className="text-xl font-semibold mb-4">Ready to Record?</h3>
          <p className="text-muted-foreground mb-8">
            Click the button below to start recording. You'll have{" "}
            {responseTime} seconds to complete your response. Make sure your
            microphone is working and you're in a quiet environment.
          </p>
          {isLocked(assessment) ? (
            <button
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
              className="btn brand-btn text-white flex items-center"
            >
              <Lock className="w-5 h-5 mr-2 inline-block" /> Login to start
              recording
            </button>
          ) : (
            <Button size="lg" onClick={startRecording} variant={"primary"}>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
          )}
        </>
      )}

      {phase === "recording" && (
        <>
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Recording in Progress</h3>
          <p className="text-muted-foreground mb-8">
            Speak clearly and naturally. Time remaining:{" "}
            <Timer
              initialTime={responseTime}
              onTimeUp={() => handleStop()}
              isRunning={isTimeRunningRef.current}
              inline
            />{" "}
            seconds
          </p>
          <Button
            size="lg"
            variant="destructive"
            onClick={handleStop}
            disabled={isSubmitting}
          >
            <SquarePause />
            Stop Recording
          </Button>
        </>
      )}

      {phase === "playback" && (
        <>
          <h3 className="text-xl font-semibold mb-4">Recording Complete</h3>
          <p className="text-muted-foreground mb-8">
            Your recording is {recordedTime} seconds long. You can play it back
            to review before submitting.
          </p>

          {/* Audio Player */}
          <div className="flex items-center flex-wrap justify-center gap-4 mb-6">
            <AudioPlayerButton
              audioBlob={audioBlob}
              variant="outline"
              size="default"
              disabled={isSubmitting}
            />
            <Button
              variant="outline"
              onClick={() => {
                retakeRecording();
              }}
              disabled={isSubmitting}
            >
              <RefreshCcw /> Record Again
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={submitAudio}
              variant={"primary"}
              disabled={isSubmitting}
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
