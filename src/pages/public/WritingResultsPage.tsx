import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  RotateCcw,
  ArrowRight,
  Star,
  FileText,
  Clock,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
}

interface WritingResultsPageProps {
  task: Task;
  content: string;
  wordCount: number;
  timeUsed: number;
  onComplete: () => void;
  onTryAgain: () => void;
}

const WRITING_FEEDBACK_SAMPLES = [
  {
    category: "Task Achievement",
    score: "Good",
    feedback:
      "You addressed all the required points effectively. Your response was well-organized and stayed focused on the task. Consider adding more specific examples to strengthen your arguments.",
  },
  {
    category: "Coherence & Cohesion",
    score: "Very Good",
    feedback:
      "Excellent use of linking words and logical paragraph structure. Your ideas flow smoothly from one to the next. The introduction and conclusion tie the response together well.",
  },
  {
    category: "Vocabulary",
    score: "Good",
    feedback:
      "Good range of vocabulary with appropriate word choice for the context. Try to use more varied synonyms and idiomatic expressions to enhance your lexical resource.",
  },
  {
    category: "Grammar & Accuracy",
    score: "Satisfactory",
    feedback:
      "Generally accurate grammar with good control of complex structures. Pay attention to article usage and subject-verb agreement in longer sentences.",
  },
];

const WritingResultsPage = ({
  task,
  content,
  wordCount,
  timeUsed,
  onComplete,
  onTryAgain,
}: WritingResultsPageProps) => {
  const score = Math.floor(Math.random() * 4) + 8; // Random score between 8-12

  const getScoreBand = (score: number) => {
    if (score >= 10) return { band: "Advanced", color: "text-success" };
    if (score >= 8) return { band: "Intermediate", color: "text-warning" };
    return { band: "Developing", color: "text-destructive" };
  };

  const scoreBand = getScoreBand(score);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <h1 className="text-xl font-semibold">
                Task Complete: {task.title}
              </h1>
              <p className="text-muted-foreground">
                Here's your detailed feedback
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Results Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Overall Score */}
          <Card className="p-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-6xl font-bold text-primary">{score}</div>
                <div className="text-left">
                  <div className="text-2xl font-semibold">/ 12</div>
                  <Badge
                    className={`${scoreBand.color} bg-transparent border-current`}
                  >
                    {scoreBand.band}
                  </Badge>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Overall Performance
              </h2>
              <p className="text-muted-foreground">
                Your response demonstrates {scoreBand.band.toLowerCase()}{" "}
                writing proficiency. Continue practicing to improve your score!
              </p>
            </div>
          </Card>

          {/* Writing Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-6 text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{wordCount}</div>
              <div className="text-sm text-muted-foreground">Words Written</div>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">{timeUsed}</div>
              <div className="text-sm text-muted-foreground">Minutes Used</div>
            </Card>
            <Card className="p-6 text-center">
              <Star className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round((wordCount / timeUsed) * 10) / 10}
              </div>
              <div className="text-sm text-muted-foreground">Words/Minute</div>
            </Card>
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-semibold">Detailed Analysis</h3>
            {WRITING_FEEDBACK_SAMPLES.map((feedback, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-lg">{feedback.category}</h4>
                  <Badge variant="outline">{feedback.score}</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feedback.feedback}
                </p>
              </Card>
            ))}
          </div>

          {/* Your Response Preview */}
          <Card className="p-6 mb-8">
            <h4 className="font-semibold mb-4">Your Response Preview</h4>
            <div className="bg-muted/30 p-4 rounded-lg max-h-40 overflow-y-auto">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {content.length > 500
                  ? content.substring(0, 500) + "..."
                  : content}
              </p>
            </div>
          </Card>

          {/* Actionable Tips */}
          <Card className="p-6 mb-8">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              Key Improvement Tips
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Plan your response structure before you start writing</li>
              <li>• Use a variety of sentence lengths and structures</li>
              <li>
                • Include specific examples and details to support your points
              </li>
              <li>• Check your grammar and spelling before submitting</li>
              <li>• Practice time management to use the full time available</li>
              <li>• Use connecting words to link your ideas clearly</li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={onTryAgain}>
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button
              size="lg"
              onClick={onComplete}
              className="bg-success hover:bg-success/90"
            >
              Continue to Next Task
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WritingResultsPage;
