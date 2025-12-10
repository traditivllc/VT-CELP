import type { TApiResponse } from "./API-URLs.enum";

export interface TestPrompt {
  id: number;
  name: string;
  namePrefix: string;
  isImageRequired: boolean;
  isMonetize: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preparationTime: number;
  responseTime: number;
  shortDescription: string;
  promptUuid: string;
}

export type TAssessmentType = "speaking" | "writing";
export interface TestType {
  id: number;
  name: string;
  /** its a type slug */
  slug: TAssessmentType;
  title: string;
  shortDescription: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  testPrompts: TestPrompt[];
}

export type Language = { id: number; name: string; code: string };

export interface PromptQuestion {
  id: number;
  uuid: string;
  name: string;
  imagePath: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PromptRandQuestion {
  id: number;
  namePrefix: string;
  name: string;
  shortDescription?: string;
  isRequiredAuth?: boolean | number; // number 0,1
  preparationTime: number;
  responseTime: number;
  promptUuid: string;
  question: {
    name: string;
    uuid: string;
    imagePath: string | null;
  };
}

export type PromptsWithQuestionAndEvaluation = PromptRandQuestion & {
  evaluationUuid: string;
  promptQuestionId: number;
  promptIdId: number;
  score: number;
  feedback: unknown;
  tips: unknown;
  vocabularyExamples: unknown;
  fluencyComment: unknown;
  idealResponseSummary: null | string;
  sampleResponses: unknown;
  status: EvaluationStatus;
  updatedAt: string;
};

export const EVALUATION_STATUS = {
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
  CANCELLED: "CANCELLED",
} as const;
export type EvaluationStatus =
  (typeof EVALUATION_STATUS)[keyof typeof EVALUATION_STATUS];

export interface EvaluationResult {
  evaluationUuid: string;
  sessionId: string;
  score: string;
  status: EvaluationStatus;
  feedback: string[];
  tips: string[];
  vocabularyExamples: string[];
  fluencyComment: string[];
  idealResponseSummary: string | null;
  sampleResponses: string[];
  promptQuestion: PromptQuestion & {
    celpTestPrompt: TestPrompt & {
      celpTestType: Omit<TestType, "testPrompts">;
    };
  };
  responseTime: string;
  targetingScore: string;
  previousScore: string;
  isCompletedOnce: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type TEvaluationSubmit = TApiResponse<{ evaluationUUID: string }>;

export interface EvaluationResponse {
  /**
   * The proficiency score (e.g., "CLB 5")
   */
  score: string;

  /**
   * List of feedback points about the response
   */
  feedback: string[];

  /**
   * Suggested improvement tips
   */
  tips: string[];

  /**
   * Correct vocabulary examples
   */
  vocabulary_examples: string[];

  /**
   * Comments about fluency and pacing
   */
  fluency_comment: string[];

  /**
   * Description of what an ideal response would include
   */
  ideal_response_summary: string;

  /**
   * Example responses demonstrating the target level
   */
  sample_responses: string[];
}

export interface AssessmentHistory {
  /**
   * Speaking or Writing
   */
  assessmentType: TAssessmentType;
  promptUUID: string;
  promptName: string;
  promptNamePrefix: string;
  promptShortDescription: string;
  responseTime: number; // in seconds
  preparationTime: number; // in seconds

  targetingScore: string; // Targeting score for the test

  /**
   * If the retesting same assessment, this will be the previous score.
   * This is used to compare the current score with the previous one.
   * If this is the first attempt, it will be undefined.
   */
  previousScore?: string; // Previous response score.

  languageId: Language["id"];

  questionUUID: string;
  questionName: string;
  questionImagePath?: string | null; // Optional image path for the question

  evaluationResponse?: EvaluationResponse; // Full evaluation response object

  isStarted?: boolean;
  isCompleted?: boolean; // Optional field to indicate if the test was completed
  isCompletedOnce?: boolean; // Ever completed the prompt
}
