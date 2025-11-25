import React, { useState, useRef, useEffect } from "react";

const AudioRecorder = ({
  id,
  prompt,
}: {
  id: string;
  prompt: string;
  storageKey?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recordingState, setRecordingState] = useState("idle"); // idle, recording, paused
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);

  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (recordingState === "recording") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (recordingState !== "recording" && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Waveform Visualizer
  const drawWave = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Audio Context setup
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      // Media Recorder setup
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
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

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
    } else if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecordingState("idle");
      // Stop tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const reset = () => {
    stopRecording();
    setTimer(0);
    setAudioUrl(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <>
      {!isExpanded && (
        <button
          className="btn brand-btn w-100 mb-2"
          onClick={() => setIsExpanded(true)}
        >
          <i className="bi bi-mic-fill"></i> Start New Speaking Task
        </button>
      )}

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
        ></canvas>

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
            src={audioUrl || ""}
          />
          <a
            href={audioUrl || "#"}
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
