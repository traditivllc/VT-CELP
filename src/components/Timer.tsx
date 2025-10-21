import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  isRunning?: boolean;
  /** will show as inline html element */
  inline?: boolean;
}

const Timer = ({
  initialTime,
  onTimeUp,
  isRunning = true,
  inline = false,
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isRunning) return;
    setTimeLeft(initialTime);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp, initialTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-destructive";
    if (timeLeft <= 30) return "text-warning";
    return "text-foreground";
  };

  if (inline) {
    return <span>{formatTime(timeLeft)}</span>;
  }

  return (
    <div
      className={`flex items-center gap-2 font-mono text-lg font-semibold ${getTimerColor()}`}
    >
      <Clock className="w-5 h-5" />
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
