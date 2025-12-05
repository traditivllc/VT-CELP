import api from "@/lib/axios";
import { buildUrl } from "@/lib/utils";
import { API_ENDPOINTS } from "@/types/Api.type";
import type {
  EvaluationResult,
  PromptQuestion,
  PromptsWithQuestionAndEvaluation,
  TestPrompt,
  TestType,
} from "@/types/AssessmentTypes.type";

export async function promptsQuestions(promptUUID: string) {
  const res = await api.get<PromptQuestion>(
    `/celpip/prompts-questions/${promptUUID}/1` // 1 as english.
  );
  return res.data;
}

export const getPromptsByType = async (
  typeSlug: TestType["slug"]
): Promise<TestPrompt[]> => {
  const res = await api.get<TestPrompt[]>(
    buildUrl(API_ENDPOINTS.CELPIP_GET_PROMPTS_BY_TYPE, {
      type: typeSlug,
    })
  );
  const prompts = res.data;
  return prompts;
};

export const getPromptsByTypeWithRandomQuestion = async (
  typeSlug: TestType["slug"]
): Promise<PromptsWithQuestionAndEvaluation[]> => {
  const res = await api.get<PromptsWithQuestionAndEvaluation[]>(
    `/celpip/prompts-questions?testTypeSlug=${encodeURIComponent(typeSlug)}`
  );
  const prompts = res.data;
  return prompts;
};

export const getEvaluationResultByPromptUUID = async (
  promptUUID: string
): Promise<EvaluationResult> => {
  const res = await api.get<EvaluationResult>(
    buildUrl(API_ENDPOINTS.CELPIP_GET_EVALUATION_RESULT_BY_PROMPT_UUID, {
      promptUUID,
    })
  );
  const prompts = res.data;
  return prompts;
};

export type CreateEvaluationDataTypes = {
  questionUUID: string;
  promptUUID: string;
  languageId?: 1;
};
export const createEvaluation = async (data: CreateEvaluationDataTypes) => {
  data.languageId = data.languageId || 1;
  const res = await api.post<EvaluationResult>(
    API_ENDPOINTS.CELPIP_START_EVALUATION,
    data
  );
  const prompts = res.data;
  return prompts;
};
