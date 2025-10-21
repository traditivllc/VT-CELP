import type {
  AssessmentHistory,
  EvaluationResponse,
  Language,
  PromptQuestion,
  TAssessmentType,
  TestPrompt,
  TestType,
} from "@/types/AssessmentTypes.types";

import api from "@/lib/axios";
import { jsonSafeParse } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AssessmentContext } from "./Assessment.context";
import axios from "axios";

export interface IStartAssessmentWithAPI {
  selectedPrompt?: TestPrompt;
  selectedLanguageId?: Language["id"];
  continueAssessment: boolean;
  targetingScore: string;
}

const LOCAL_STORAGE_KEY = "AssessmentList";

const getFromLocalStorage = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? jsonSafeParse<AssessmentHistory[]>(stored) : [];
};

export const AssessmentHistoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [history, setHistory] = useState<AssessmentHistory[] | null>(
    getFromLocalStorage()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [taskTypes, setTaskTypes] = useState<TestType[]>([]);

  const [isTimeRunning, setIsTimeRunning] = useState(false);

  const saveHistory = (data: AssessmentHistory[] | null) => {
    if (data) localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    else localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  /**
   * Get assessment history by ID
   * @param id
   * @returns
   */
  const getAssessmentHistory = (
    promptUUID: string
  ): AssessmentHistory | null => {
    if (!history) return null;
    return history.find((his) => his.promptUUID === promptUUID) || null;
  };

  // Add a test to history (addToHistory and addTestHistory are the same)
  const addToHistory = (test: AssessmentHistory) => {
    setHistory((prev) => {
      let updated: AssessmentHistory[];
      if (prev) {
        const exists = prev.some((t) => t.promptUUID === test.promptUUID);

        if (exists) {
          updated = prev.map((t) =>
            t.promptUUID === test.promptUUID ? test : t
          );
        } else {
          updated = [test, ...prev];
        }
      } else {
        updated = [test];
      }
      saveHistory(updated);
      return updated;
    });
  };
  const addAssessmentHistory = addToHistory;

  const updateAssessmentHistory = (
    promptUUID: string,
    data: AssessmentHistory
  ) => {
    setHistory((prev) => {
      if (!prev) return null;
      const updated = prev.map((t) => (t.promptUUID === promptUUID ? data : t));
      saveHistory(updated);
      return updated;
    });
  };

  const deleteAssessmentHistory = (promptUUID: string) => {
    setHistory((prev) => {
      if (!prev) return null;
      const updated = prev.filter((t) => t.promptUUID !== promptUUID);
      saveHistory(updated);
      return updated.length ? updated : null;
    });
  };

  const clearHistory = () => {
    setHistory(null);
    saveHistory(null);
  };

  useEffect(() => {
    if (isLoading) {
      toast.dismiss();
      toast("Loading...", {
        duration: Infinity,
        position: "bottom-right",
      });
    } else {
      toast.dismiss();
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchTypes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<TestType[]>("celpip/get-types");
        const responseData = response.data;
        if (!responseData || responseData.length === 0) {
          throw new Error("No task types found");
        }
        setTaskTypes(responseData);
        const historyOnLS = getFromLocalStorage();

        responseData.forEach((assessmentTypes) => {
          assessmentTypes.testPrompts.forEach((pmt) => {
            const exist = historyOnLS?.find(
              (hist) => hist.promptUUID == pmt.promptUuid
            );
            if (exist) {
              return;
            }

            addToHistory({
              assessmentType: assessmentTypes.slug,
              promptUUID: pmt.promptUuid,
              promptName: pmt.name,
              promptNamePrefix: pmt.namePrefix,
              isCompleted: false,
              isStarted: false,
              promptShortDescription: pmt.shortDescription,
              preparationTime: pmt.preparationTime,
              responseTime: pmt.responseTime,

              questionUUID: "",
              questionName: "",
              questionImagePath: "",
              isCompletedOnce: false,
              languageId: 1, // default to english
              targetingScore: "10",
            });
          });
        });
      } catch (error) {
        if (error instanceof axios.AxiosError) {
          setError(error.message);
        }
        console.error("Error fetching task types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const startAssessment = (
    assessment: Pick<
      AssessmentHistory,
      | "promptUUID"
      | "questionUUID"
      | "questionName"
      | "questionImagePath"
      | "targetingScore"
      | "previousScore"
    >,
    clearResults: boolean = false
  ) => {
    const prev = getAssessmentHistory(assessment.promptUUID);

    if (prev) {
      if (prev.isStarted) {
        return;
      }

      assessment.previousScore =
        prev.previousScore || prev.evaluationResponse?.score;

      updateAssessmentHistory(assessment.promptUUID, {
        ...prev,
        ...assessment,
        ...{
          isStarted: false,
          isCompleted: false,
          evaluationResponse: clearResults
            ? undefined
            : prev.evaluationResponse,
        },
      });
      return;
    }

    toast.success("Unexpected error. Please refresh the page and try again");
  };

  /**
   * startExistingAssessmentByPropmtId
   * @param promptId
   */
  const restartByPromptId = (promptUUID: string) => {
    console.log(history, "<<history");
    const existingAssessment = history?.find(
      (his) => his.promptUUID === promptUUID
    );
    if (existingAssessment) {
      if (existingAssessment.isCompleted) {
        existingAssessment.questionUUID = "";
        existingAssessment.questionName = "";
        existingAssessment.questionImagePath = undefined;
      }
      existingAssessment.isStarted = false;
      existingAssessment.isCompleted = false;

      existingAssessment.previousScore =
        existingAssessment.previousScore ||
        existingAssessment.evaluationResponse?.score;

      existingAssessment.evaluationResponse = undefined;

      startAssessment(existingAssessment);
    } else {
      console.error(
        `No existing assessment found for prompt UUID: ${promptUUID}`
      );
      toast.error("No existing assessment found for the given prompt ID.");
    }
  };

  /**
   * startExistingAssessmentByPropmtId
   * @param promptId
   */
  // const startByPromptId = (promptUUID: string) => {
  //   const existingAssessment = history?.find(
  //     (his) => his.promptUUID === promptUUID
  //   );
  // };

  const setAsCompleted = (promptUUID: string, data: EvaluationResponse) => {
    setHistory((prev) => {
      if (!prev) return null;
      const updated = prev.map((t) =>
        t.promptUUID === promptUUID
          ? {
              ...t,
              evaluationResponse: data,
              isCompleted: true,
              isCompletedOnce: true,
            }
          : t
      );
      saveHistory(updated);
      return updated;
    });
  };

  const getPromptsByType = (
    typeSlug: TestType["slug"]
  ): AssessmentHistory[] => {
    const prompts = history?.filter((type) => type.assessmentType === typeSlug);
    if (prompts) {
      return prompts;
    }
    return [];
  };

  const setIsStarted = (promptId: AssessmentHistory["promptUUID"]) => {
    setHistory((prev) => {
      if (!prev) return null;
      const updated = prev.map((t) =>
        t.promptUUID === promptId ? { ...t, isStarted: true } : t
      );
      saveHistory(updated);
      return updated;
    });
  };

  async function assignQuestionToPrompt({
    type,
    random = false,
    clearResults = false,
    promptUUID,
  }: {
    promptUUID: AssessmentHistory["promptUUID"];
    type: TAssessmentType;
    random?: boolean;
    clearResults?: boolean;
  }) {
    if (isLoading) {
      toast.error("Please wait, loading in progress.");
      return;
    }

    const prompts = getPromptsByType(type || "speaking");

    if (!random) {
      const existingAssessment = prompts.find(
        (p) => p.promptUUID === promptUUID
      );

      if (existingAssessment && existingAssessment.questionUUID) {
        startAssessment(
          {
            promptUUID: promptUUID,
            targetingScore: "10",
            questionUUID: existingAssessment.questionUUID,
            questionName: existingAssessment.questionName,
            questionImagePath: existingAssessment.questionImagePath,
          },
          clearResults
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await api.get<PromptQuestion>(
        `/celpip/prompts-questions/${promptUUID}/1` // 1 as english.
      );
      const dataToStart = {
        promptUUID: promptUUID,
        targetingScore: "10",
        questionUUID: response.data.uuid,
        questionName: response.data.name,
        questionImagePath: response.data.imagePath,
      };

      startAssessment(dataToStart, clearResults);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const hasNextTask = (
    promptUUID: string,
    type: TestType["slug"]
  ): AssessmentHistory | false => {
    const index = history?.findIndex(
      (his) => his.promptUUID == promptUUID && his.assessmentType == type
    );
    if (index === undefined || index === -1 || !history) return false;
    if (index + 1 < history.length) return history[index + 1];
    return false;
  };

  const startNext = (promptUUID: string, type: TestType["slug"]) => {
    const next = hasNextTask(promptUUID, type);
    if (next) {
      assignQuestionToPrompt({
        promptUUID: next.promptUUID,
        random: true,
        type: next.assessmentType,
      });
      return;
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        history,
        setHistory,
        isLoading,
        error,
        addAssessmentHistory,
        deleteAssessmentHistory,
        clearHistory,
        addToHistory,

        getAssessmentHistory,

        startAssessment,
        restartByPromptId,

        setAsCompleted,

        taskTypes,

        getPromptsByType,

        setIsStarted,

        assignQuestionToPrompt,

        hasNextTask,
        startNext,

        isTimeRunning,
        setIsTimeRunning,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
