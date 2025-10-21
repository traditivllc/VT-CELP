import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RecordingIndicatorProps {
  /** Whether the recording is active */
  isRecording?: boolean;
  /** Audio stream for voice analysis */
  audioStream?: MediaStream | null;
  /** Background color theme */
  bgColor?: string;
  /** Custom className for additional styling */
  className?: string;
}

const RecordingIndicator = ({
  isRecording = true,
  audioStream = null,
  bgColor = "bg-red-500",
  className = "",
}: RecordingIndicatorProps) => {
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(12).fill(0));
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>(null);

  useEffect(() => {
    if (isRecording && audioStream) {
      // Set up audio analysis
      audioContextRef.current = new window.AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();

      const source =
        audioContextRef.current.createMediaStreamSource(audioStream);
      source.connect(analyzerRef.current);

      analyzerRef.current.fftSize = 64;
      analyzerRef.current.smoothingTimeConstant = 0.8;

      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevels = () => {
        if (analyzerRef.current && isRecording) {
          analyzerRef.current.getByteFrequencyData(dataArray);

          // Map frequency data to 12 bars
          const barCount = 12;
          const barsPerBin = Math.floor(bufferLength / barCount);
          const newLevels = [];

          for (let i = 0; i < barCount; i++) {
            const start = i * barsPerBin;
            const end = start + barsPerBin;
            let sum = 0;

            for (let j = start; j < end && j < bufferLength; j++) {
              sum += dataArray[j];
            }

            const average = sum / barsPerBin;
            // Convert to percentage (20% minimum height, up to 80% max)
            const level = Math.max(20, Math.min(80, (average / 255) * 80 + 20));
            newLevels.push(level);
          }

          setAudioLevels(newLevels);
          animationFrameRef.current = requestAnimationFrame(updateLevels);
        }
      };

      updateLevels();
    } else {
      // Reset to idle state
      setAudioLevels(Array(12).fill(20));
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording, audioStream]);

  return (
    <div className={`relative w-32 h-32 ${className}`}>
      {/* Equalizer Background */}
      <div className="absolute inset-0 flex items-end justify-center gap-1 p-4">
        {audioLevels.map((level, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-current to-current opacity-70 rounded-sm transition-all duration-100 ease-out"
            style={{
              width: "4px",
              height: `${level}%`,
              color: isRecording ? "#ef4444" : "#6b7280",
            }}
          />
        ))}
      </div>

      {/* Microphone Icon with Background */}
      <div
        className={`absolute inset-0 rounded-full ${bgColor} flex items-center justify-center ${
          isRecording ? "animate-pulse" : ""
        }`}
      >
        <div
          className="w-12 h-12 flex items-center justify-center"
          style={{
            background: isRecording
              ? "linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6)"
              : "transparent",
            backgroundSize: "300% 300%",
            animation: isRecording ? "gradient-shift 2s ease infinite" : "none",
            WebkitBackgroundClip: isRecording ? "text" : "unset",
            backgroundClip: isRecording ? "text" : "unset",
            WebkitTextFillColor: isRecording ? "transparent" : "white",
          }}
        >
          <Mic className={`w-10 h-10 ${!isRecording ? "text-white" : ""}`} />
        </div>
      </div>
    </div>
  );
};

export default RecordingIndicator;
