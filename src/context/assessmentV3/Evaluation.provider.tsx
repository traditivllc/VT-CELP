import {
  createEvaluation,
  type CreateEvaluationDataTypes,
} from "@/services/celpip-services";
import type { EvaluationResult } from "@/types/AssessmentTypes.type";
import { createContext, useCallback, useContext, useState } from "react";

interface AssessmentContextProps {
  startAssessment: (evaluationData: CreateEvaluationDataTypes) => void;
  stopAssessment: () => void;
  currentAssessment: EvaluationResult | null;
  countDownTime: number;
  isTimeRunning: boolean;
}

export const EvaluationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentAssessment, setCurrentAssessment] =
    useState<EvaluationResult | null>(null);
  const [countDownTime, setCountDownTime] = useState<number>(0);

  const startAssessment = async (data: CreateEvaluationDataTypes) => {
    const created = await createEvaluation(data);
    console.log("created", created);
    setCountDownTime(Number(created?.responseTime) || 60);
    setCurrentAssessment(created);
  };

  const stopAssessment = useCallback(() => {
    setCurrentAssessment(null);
    setCountDownTime(0);
  }, []);
  return (
    <EvaluationContext.Provider
      value={{
        startAssessment: startAssessment,
        currentAssessment: currentAssessment,
        countDownTime: countDownTime,
        isTimeRunning: countDownTime > 0,
        stopAssessment,
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
