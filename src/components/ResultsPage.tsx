import { getEvaluationResultByPromptUUID } from "@/services/celpip-services";
import type { EvaluationResult } from "@/types/AssessmentTypes.type";
import { CheckCircle2, Home, RotateCcw, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";

interface TestResult {
  score: number;
  maxScore: number;
  feedback: {
    overall: string;
    strengths: string[];
    improvements: string[];
    detailedAnalysis?: {
      fluency: { score: number; comment: string };
      vocabulary: { score: number; comment: string };
      grammar: { score: number; comment: string };
      pronunciation: { score: number; comment: string };
    };
  };
  audioBlob?: Blob;
  completedAt: Date;
}
const resultDummy: TestResult = {
  score: Math.floor(Math.random() * 4) + 8, // Score between 8-12
  maxScore: 12,
  feedback: {
    overall:
      "Your response demonstrates good understanding of the task and provides relevant advice. Continue working on fluency and vocabulary range for higher scores.",
    strengths: [
      "Clear pronunciation and good pace",
      "Relevant and practical advice given",
      "Good use of examples to support points",
      "Appropriate tone for the context",
    ],
    improvements: [
      "Try using more advanced vocabulary and idiomatic expressions",
      "Work on reducing hesitations and filler words",
      "Add more linking words to improve coherence",
      "Expand on ideas with more detailed explanations",
    ],
    detailedAnalysis: {
      fluency: {
        score: 7,
        comment:
          "Speech flows well with minor hesitations. Good natural rhythm overall.",
      },
      vocabulary: {
        score: 6,
        comment:
          "Appropriate word choice but limited range. Try incorporating more sophisticated vocabulary.",
      },
      grammar: {
        score: 8,
        comment:
          "Good control of basic structures with few errors. Complex sentences used effectively.",
      },
      pronunciation: {
        score: 8,
        comment:
          "Clear and intelligible throughout. Good word stress and intonation patterns.",
      },
    },
  },
  completedAt: new Date(),
};

interface ResultsPageProps {
  promptUUID: string;
}
const getScoreBand = (score: number) => {
  if (score >= 10)
    return { band: "Advanced", color: "text-green-600", bg: "bg-green-50" };
  if (score >= 8)
    return { band: "Proficient", color: "text-blue-600", bg: "bg-blue-50" };
  if (score >= 6)
    return {
      band: "Developing",
      color: "text-orange-600",
      bg: "bg-orange-50",
    };
  return { band: "Beginner", color: "text-red-600", bg: "bg-red-50" };
};

export default function ResultsPage({ promptUUID }: ResultsPageProps) {
  const redirect = useNavigate();
  const [result, setResult] = useState<EvaluationResult>();
  const [query] = useSearchParams();

  useEffect(() => {
    getEvaluationResultByPromptUUID(
      promptUUID,
      query.get("evaluationUUID") || undefined
    ).then((data) => {
      setResult(data);
    });
  }, [promptUUID]);

  const score = Number(result?.score);
  const scoreBand = getScoreBand(score);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Complete!
          </h1>
          <p className="text-gray-600">
            Here's your detailed feedback for:{" "}
            {result?.promptQuestion.celpTestPrompt.name}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {score}
              <span className="text-3xl text-gray-500">/{12}</span>
            </div>
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full ${scoreBand.bg}`}
            >
              <span className={`font-semibold ${scoreBand.color}`}>
                {scoreBand.band}
              </span>
            </div>
          </div>

          {/* Detailed Scores */}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <ScoreItem
                label="Fluency & Coherence"
                score={score}
                comment={result?.fluencyComment.join(", ") || ""}
              />
              <ScoreItem
                label="Vocabulary"
                score={score}
                comment={result?.vocabularyExamples.join(", ") || ""}
              />
            </div>
            <div className="space-y-4">
              <ScoreItem
                label="Summary"
                score={score}
                comment={result?.idealResponseSummary || ""}
              />
              <ScoreItem
                label="Tips"
                score={score}
                comment={result?.tips.join(", ") || ""}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Overall Feedback
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {result?.feedback.join(", ")}
            </p>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Strengths
            </h3>
            <ul className="space-y-3">
              {resultDummy.feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center">
              <RotateCcw className="w-5 h-5 mr-2" />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {resultDummy.feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-orange-400 rounded-full flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => {
              redirect(
                `/test/${result?.promptQuestion.celpTestPrompt.celpTestType.slug}/${result?.promptQuestion.celpTestPrompt.promptUuid}`
              );
            }}
            size={"lg"}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          {/* {hasNextTask(promptUUID, assessment.assessmentType) && (
            <Button
              onClick={() => {
                const nextTask = hasNextTask(
                  promptUUID,
                  assessment.assessmentType
                );

                if (!nextTask) return;

                redirect(
                  `/test/${nextTask.assessmentType}/${nextTask.promptUUID}`
                );
              }}
              size={"lg"}
              variant={"gradient-green"}
            >
              <span>Next Task</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )} */}

          <Button
            onClick={() => {
              redirect("/");
            }}
            variant="outline"
            size={"lg"}
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  score: number;
  comment: string;
}

function ScoreItem({ label, score, comment }: ScoreItemProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-blue-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{label}</h4>
        <span className={`text-xl font-bold ${getScoreColor(score)}`}>
          {score}/10
        </span>
      </div>
      <p className="text-sm text-gray-600">{comment}</p>
    </div>
  );
}
