import { useAuth } from "@/comman/contexts/AuthContext";
import {
  createEvaluation,
  submitEvaluation,
  type CreateEvaluationDataTypes,
} from "@/services/celpip-services";
import type { TFSubmitEvaluationAPI } from "@/types/API-URLs.enum";
import type {
  EvaluationResult,
  PromptsWithQuestionAndEvaluation,
  TEvaluationSubmit,
} from "@/types/AssessmentTypes.type";
import { createContext, useCallback, useContext, useState } from "react";

interface AssessmentContextProps {
  startAssessment: (evaluationData: CreateEvaluationDataTypes) => void;
  stopAssessment: (
    params: TFSubmitEvaluationAPI
  ) => Promise<TEvaluationSubmit | false>;
  resetAssessment: () => void;
  currentAssessment: EvaluationResult | null;
  countDownTime: number;
  isTimeRunning: boolean;

  isLocked: (prompt: PromptsWithQuestionAndEvaluation) => boolean;
}

export const EvaluationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentAssessment, setCurrentAssessment] =
    useState<EvaluationResult | null>(null);
  const [countDownTime, setCountDownTime] = useState<number>(0);

  const { isAuthenticated } = useAuth();

  const startAssessment = async (data: CreateEvaluationDataTypes) => {
    const created = await createEvaluation(data);
    console.log("created", created);
    setCountDownTime(
      Number(created?.promptQuestion.celpTestPrompt.responseTime) || 123
    );
    setCurrentAssessment(created);
  };

  const resetAssessment = useCallback(() => {
    setCurrentAssessment(null);
    setCountDownTime(0);
  }, []);
  const stopAssessment = useCallback(
    async (params: TFSubmitEvaluationAPI) => {
      const res = await submitEvaluation(params);
      if (!res) {
        return false;
      }
      resetAssessment();
      return res;
    },
    [resetAssessment]
  );

  const isLocked = (prompt: PromptsWithQuestionAndEvaluation) => {
    return isAuthenticated === false && prompt.isRequiredAuth == true;
  };
  return (
    <EvaluationContext.Provider
      value={{
        startAssessment: startAssessment,
        currentAssessment: currentAssessment,
        countDownTime: countDownTime,
        isTimeRunning: countDownTime > 0,
        stopAssessment,
        resetAssessment,
        isLocked,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const EvaluationContext = createContext<
  AssessmentContextProps | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context)
    throw new Error(
      "useAssessment must be used within a AssessmentHistoryProvider"
    );
  return context;
};
