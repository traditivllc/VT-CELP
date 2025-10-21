import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, FileText, PenTool } from "lucide-react";
import Timer from "./Timer";
import WritingResultsPage from "@/pages/public/WritingResultsPage";

interface Task {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
}

interface WritingTestInterfaceProps {
  task: Task;
  onComplete: () => void;
  onBack: () => void;
}

const WRITING_PROMPTS = {
  1: {
    situation:
      "You recently attended a conference and met someone who could help with your career. You want to follow up and maintain the connection.",
    task: "Write an email to this person. In your email, you should:\n• Thank them for their time at the conference\n• Mention something specific you discussed\n• Suggest a way to stay in touch or meet again\n• Ask for their advice on a career-related topic",
    wordRange: "150-200 words",
  },
  2: {
    situation:
      "Your local community center is conducting a survey about recreational activities and facilities in the area.",
    task: "Respond to the following survey questions with detailed answers:\n\n1. What recreational activities do you currently participate in, and how often?\n2. What new facilities or programs would you like to see in your community?\n3. How important is it to have recreational facilities close to where you live?\n4. What would encourage more people to use community recreational facilities?",
    wordRange: "200+ words total",
  },
};

const WritingTestInterface = ({
  task,
  onComplete,
  onBack,
}: WritingTestInterfaceProps) => {
  const [phase, setPhase] = useState<"instruction" | "writing" | "results">(
    "instruction"
  );
  const [content, setContent] = useState("");
  const [timeLeft, setTimeLeft] = useState(task.timeLimit * 60); // Convert minutes to seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const prompt = WRITING_PROMPTS[task.id as keyof typeof WRITING_PROMPTS];

  const handleStartWriting = () => {
    setPhase("writing");
    setIsTimerRunning(true);
  };

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    if (content.trim().length > 0) {
      setPhase("results");
    }
  };

  const handleSubmit = () => {
    setIsTimerRunning(false);
    setPhase("results");
  };

  if (phase === "results") {
    return (
      <WritingResultsPage
        task={task}
        content={content}
        wordCount={wordCount}
        timeUsed={task.timeLimit - Math.floor(timeLeft / 60)}
        onComplete={onComplete}
        onTryAgain={() => {
          setPhase("instruction");
          setContent("");
          setTimeLeft(task.timeLimit * 60);
          setIsTimerRunning(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{task.title}</h1>
              <Badge variant="secondary">Task {task.id} of 2</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {phase === "writing" && (
              <Timer
                initialTime={timeLeft}
                onTimeUp={handleTimeUp}
                isRunning={isTimerRunning}
              />
            )}
            {phase === "writing" && (
              <div className="text-sm text-muted-foreground">
                Words: <span className="font-medium">{wordCount}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {phase === "instruction" && (
            <>
              {/* Prompt */}
              <Card className="p-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Situation</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {prompt.situation}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Your Task</h3>
                    <div className="bg-accent/30 p-4 rounded-lg">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                        {prompt.task}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.timeLimit} minutes
                    </Badge>
                    <Badge variant="outline">
                      <FileText className="w-3 h-3 mr-1" />
                      {prompt.wordRange}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Start Button */}
              <Card className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Ready to Start?
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Once you click "Start Writing", the timer will begin. Make
                    sure you have a quiet environment and are ready to focus.
                  </p>
                  <Button
                    size="lg"
                    onClick={handleStartWriting}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    <PenTool className="w-5 h-5 mr-2" />
                    Start Writing
                  </Button>
                </div>
              </Card>
            </>
          )}

          {phase === "writing" && (
            <>
              {/* Quick Reference */}
              <Card className="p-4 mb-6">
                <div className="text-sm">
                  <strong>Task:</strong> {task.title} • <strong>Target:</strong>{" "}
                  {prompt.wordRange}
                </div>
              </Card>

              {/* Writing Area */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Response</h3>
                    <div className="text-sm text-muted-foreground">
                      {wordCount} words
                    </div>
                  </div>

                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing your response here..."
                    className="min-h-[400px] text-base leading-relaxed resize-none"
                    autoFocus
                  />

                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      Time remaining: {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={wordCount < 50}
                      className="bg-success hover:bg-success/90"
                    >
                      Submit Response
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default WritingTestInterface;
