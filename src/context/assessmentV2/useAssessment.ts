import { useContext } from "react";
import { AssessmentContext } from "./Assessment.context";

/**
 * useAssessment V2
 */
export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context)
    throw new Error(
      "useAssessment must be used within a AssessmentHistoryProvider"
    );
  return context;
};
