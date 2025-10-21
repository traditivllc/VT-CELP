import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AudioPlayerButtonProps {
  audioBlob: Blob | null;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onEnded?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

type PlayerState = "idle" | "playing" | "paused";

const AudioPlayerButton = ({
  audioBlob,
  onPlay,
  onPause,
  onStop,
  onEnded,
  variant = "outline",
  size = "default",
  className = "",
  disabled = false,
}: AudioPlayerButtonProps) => {
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Initialize audio when blob changes
  useEffect(() => {
    if (audioBlob) {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", updateTime);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      // Create new audio
      audioUrlRef.current = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrlRef.current);

      // Set up event listeners
      audioRef.current.addEventListener("timeupdate", updateTime);
      audioRef.current.addEventListener("ended", handleEnded);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("timeupdate", updateTime);
          audioRef.current.removeEventListener("ended", handleEnded);
          audioRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
        }
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
      };
    }
  }, [audioBlob]);

  const updateTime = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setPlayerState("idle");
    setCurrentTime(0);
    onEnded?.();
  }, [onEnded]);

  const handlePlay = useCallback(async () => {
    if (!audioRef.current || !audioBlob) return;

    try {
      await audioRef.current.play();
      setPlayerState("playing");
      onPlay?.();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }, [audioBlob, onPlay]);

  const handlePause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setPlayerState("paused");
    onPause?.();
  }, [onPause]);

  const handleStop = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlayerState("idle");
    setCurrentTime(0);
    onStop?.();
  }, [onStop]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getButtonContent = () => {
    switch (playerState) {
      case "playing":
        return (
          <div className="flex items-center gap-2">
            <Pause className="w-4 h-4" />
            <span>
              Playing ({formatTime(currentTime)}/{formatTime(duration)})
            </span>
          </div>
        );
      case "paused":
        return (
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span>
              Resume ({formatTime(currentTime)}/{formatTime(duration)})
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span>Play Recording</span>
            {duration > 0 && (
              <span className="text-xs opacity-75">
                ({formatTime(duration)})
              </span>
            )}
          </div>
        );
    }
  };

  const handleMainButtonClick = () => {
    switch (playerState) {
      case "playing":
        handlePause();
        break;
      case "paused":
        handlePlay();
        break;
      default:
        handlePlay();
        break;
    }
  };

  if (!audioBlob) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Main play/pause button */}
      <Button
        variant={variant}
        size={size}
        onClick={handleMainButtonClick}
        disabled={disabled}
        className={`relative overflow-hidden transition-all duration-300 ${
          playerState === "playing"
            ? "bg-blue-50 border-blue-200 text-blue-700 shadow-md"
            : ""
        } ${className}`}
      >
        {/* Animated background for playing state */}
        {playerState === "playing" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/50 via-blue-300/30 to-blue-200/50 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </>
        )}

        {/* Progress bar */}
        {playerState !== "idle" && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-blue-500/30 transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
        )}

        <div className="relative z-10">{getButtonContent()}</div>
      </Button>

      {/* Stop button - only show when playing or paused */}
      {playerState !== "idle" && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleStop}
          disabled={disabled}
          className="shrink-0"
          title="Stop and reset"
        >
          <Square className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default AudioPlayerButton;
