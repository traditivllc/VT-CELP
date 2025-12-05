import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------
   Props
--------------------------------------------------- */
interface AudioRecorderProps {
  /** Unique identifier for the component instance */
  id: string;
  /** Prompt text displayed above the recorder */
  prompt: string;
}

/* -------------------------------------------------
   Component
--------------------------------------------------- */
const AudioRecorder: React.FC<AudioRecorderProps> = ({ id, prompt }) => {
  /* -------------------- State -------------------- */
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused"
  >("idle");
  const [timer, setTimer] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  /* -------------------- Refs --------------------- */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  /* -------------------- Timer effect ------------- */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (recordingState === "recording") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recordingState]);

  /* -------------------- Helpers ------------------- */
  const formatTime = (sec: number): string => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  /* -------------------- Waveform visualizer -------- */
  const drawWave = (): void => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  /* -------------------- Recording controls --------- */
  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // AudioContext setup (create once)
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const source = audioCtxRef.current!.createMediaStreamSource(stream);
      analyserRef.current = audioCtxRef.current!.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      // MediaRecorder setup
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      recorder.start();
      setRecordingState("recording");
      setTimer(0);
      drawWave();
    } catch (err) {
      alert("Microphone access denied or not supported.");
      console.error(err);
    }
  };

  const pauseRecording = (): void => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
    } else if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecordingState("idle");

      // Stop all tracks to free the microphone
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const reset = (): void => {
    stopRecording();
    setTimer(0);
    setAudioUrl(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  /* -------------------- Render ---------------------- */
  return (
    <>
      {/* Collapsed view */}
      {!isExpanded && (
        <button
          className="btn brand-btn w-100 mb-2"
          onClick={() => setIsExpanded(true)}
        >
          <i className="bi bi-mic-fill"></i> Start New Speaking Task
        </button>
      )}

      {/* Expanded panel */}
      <div className={`rec-panel mt-3 ${!isExpanded ? "d-none" : ""}`} id={id}>
        <div className="small text-secondary mb-1">
          Task prompt (sample): <b>{prompt}</b>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="write-meta">
            Recording time: <span>{formatTime(timer)}</span>
          </div>
          <div className="badge text-bg-light">Waveform demo</div>
        </div>

        <canvas
          ref={canvasRef}
          className="w-100 rec-wave"
          height="80"
          style={{ width: "100%" }}
        />

        <div className="d-flex flex-wrap gap-2 align-items-center rec-controls mt-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={startRecording}
            disabled={recordingState !== "idle"}
          >
            <i className="bi bi-record-circle"></i> Start
          </button>

          <button
            className="btn btn-sm btn-warning"
            onClick={pauseRecording}
            disabled={recordingState === "idle"}
          >
            {recordingState === "paused" ? (
              <>
                <i className="bi bi-play-circle"></i> Resume
              </>
            ) : (
              <>
                <i className="bi bi-pause-circle"></i> Pause
              </>
            )}
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={stopRecording}
            disabled={recordingState === "idle"}
          >
            <i className="bi bi-stop-circle"></i> Stop
          </button>

          <button
            className="btn btn-sm btn-outline-secondary ms-auto"
            onClick={reset}
          >
            <i className="bi bi-arrow-counterclockwise"></i> Reset
          </button>
        </div>

        <div className="mt-2 d-flex flex-wrap align-items-center gap-2">
          <audio
            controls
            className="flex-grow-1"
            style={{ maxWidth: "100%" }}
            src={audioUrl ?? undefined}
          />
          <a
            href={audioUrl ?? "#"}
            download="speaking-response.webm"
            className={`btn btn-sm btn-outline-success ${
              !audioUrl ? "disabled" : ""
            }`}
          >
            <i className="bi bi-download"></i> Download
          </a>
        </div>
      </div>
    </>
  );
};

export default AudioRecorder;
