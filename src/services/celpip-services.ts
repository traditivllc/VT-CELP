import api from "@/lib/axios";
import { buildUrl } from "@/lib/utils";
import type { TFSubmitEvaluationAPI } from "@/types/API-URLs.enum";
import { API_ENDPOINTS } from "@/types/Api.type";
import type {
  CustomerAnalytics,
  EvaluationResult,
  PromptQuestion,
  PromptsWithQuestionAndEvaluation,
  TestPrompt,
  TestType,
  TEvaluationSubmit,
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
  promptUUID: string,
  evaluationUUID?: string
): Promise<EvaluationResult> => {
  const res = await api.get<EvaluationResult>(
    buildUrl(API_ENDPOINTS.CELPIP_GET_EVALUATION_RESULT_BY_PROMPT_UUID, {
      promptUUID,
    }) + (evaluationUUID ? `?evaluationUUID=${evaluationUUID}` : "")
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

export const submitEvaluation = async (params: TFSubmitEvaluationAPI) => {
  const { type, evaluationUUID, targetingScore = 12, timeTaken } = params;

  if (type === "speaking") {
    const res = await api.postForm<TEvaluationSubmit>(
      `${buildUrl(API_ENDPOINTS.CELPIP_SUBMIT_EVALUATION, {
        type: type,
      })}?evaluationUUID=${evaluationUUID}&targetingScore=${targetingScore}&timeTaken=${timeTaken}`,
      params.formData,
      {
        timeout: 60000, // 60 seconds timeout
      }
    );

    return res.data;
  }
  if (type === "writing") {
    const res = await api.post<TEvaluationSubmit>(
      `${buildUrl(API_ENDPOINTS.CELPIP_SUBMIT_EVALUATION, {
        type: type,
      })}?evaluationUUID=${evaluationUUID}&targetingScore=${targetingScore}&timeTaken=${timeTaken}`,
      { text: params.text },
      {
        timeout: 60000, // 60 seconds timeout
      }
    );

    return res.data;
  }
};

export async function getAnalytics(): Promise<CustomerAnalytics> {
  const res = await api.get<CustomerAnalytics>(
    API_ENDPOINTS.EVALUATION_ANALYTICS
  );

  return res.data;
}
