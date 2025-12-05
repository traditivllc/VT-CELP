import type {
  AssessmentHistory,
  EvaluationResponse,
  TAssessmentType,
  TestType,
} from "@/types/AssessmentTypes.type";
import { createContext } from "react";

interface AssessmentContextProps {
  history: AssessmentHistory[] | null; // Array of assessment history or null if not available
  setHistory: (history: AssessmentHistory[] | null) => void; // Function to set the assessment history
  isLoading: boolean; // Loading state for fetching history
  error: string | null; // Error message if fetching history fails

  addAssessmentHistory: (assessment: AssessmentHistory) => void; // Function to add a new assessment history entry

  getAssessmentHistory: (promptUUID: string) => AssessmentHistory | null; // Function to get a specific assessment history by ID

  deleteAssessmentHistory: (promptUUID: string) => void; // Function to delete a assessment history entry by ID
  /**
   * Function to clear the entire assessment history from the state and local storage
   */
  clearHistory: () => void;
  addToHistory: (assessment: AssessmentHistory) => void; // Alias for addAssessmentHistory

  startAssessment: (
    assessment: Pick<
      AssessmentHistory,
      | "promptUUID"
      | "questionUUID"
      | "questionName"
      | "questionImagePath"
      | "targetingScore"
    >
  ) => void; // Function to start a new assessment

  setAsCompleted: (promptUUID: string, data: EvaluationResponse) => void; // Function to mark a prompt as completed in the assessment history

  /**
   *  Function to start an existing assessment by prompt ID
   */
  restartByPromptId: (promptUUID: string) => void;

  taskTypes: TestType[];

  setIsStarted: (promptId: AssessmentHistory["promptUUID"]) => void;

  assignQuestionToPrompt: (prop: {
    type: TAssessmentType;
    promptUUID: AssessmentHistory["promptUUID"];
    random?: boolean;
    clearResults?: boolean;
  }) => void;

  hasNextTask: (
    promptUUID: string,
    type: TAssessmentType
  ) => AssessmentHistory | false;
  startNext: (promptUUID: string, type: TAssessmentType) => void;

  isTimeRunning: boolean;

  setIsTimeRunning: (isTimeRunning: boolean) => void;
}

export const AssessmentContext = createContext<
  AssessmentContextProps | undefined
>(undefined);
