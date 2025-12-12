export type APIRequest<T> = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: T;
};

export const API_ENDPOINTS = {
  SEND_OTP: "/customer/otp/send/login",
  LOGIN: "/customers/auth/login",
  LOG_OUT: "/customers/auth/logout",
  CURRENT_CUSTOMER: "/customers/auth/me",

  CELPIP_GET_TYPES: "celpip/get-types",
  CELPIP_LANGUAGES: "celpip/languages",
  CELPIP_TESTING: "celpip/testing",

  CELPIP_PROMPTS_QUESTIONS: "/celpip/prompts-questions/:promptUUID/:language",

  CELPIP_GET_PROMPTS_BY_TYPE: "/celpip/get-prompts/:type",

  CELPIP_GET_EVALUATION_RESULT_BY_PROMPT_UUID:
    "/evaluation/results/:promptUUID",

  CELPIP_START_EVALUATION: "/evaluation/create",
  CELPIP_SUBMIT_EVALUATION: "evaluation/submit/:type",

  EVALUATION_ANALYTICS: "evaluation/analytics",
} as const;
