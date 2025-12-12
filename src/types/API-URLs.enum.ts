import type { CurrentCustomerType } from "./Customer.type";

export type TApiResponse<TData> = {
  success: boolean;
  message: string;
  data: TData;
};

export type CurrentCustomerAPIResponse = {
  customer: CurrentCustomerType;
};
export type LoginAPIResponse = {
  expireAt: string;
  isNewCustomer: false;
  customer: CurrentCustomerType;
};

export type TFSubmitEvaluationAPI = (
  | {
      type: "speaking";
      evaluationUUID: string;
      formData: FormData;
      timeTaken: number;
    }
  | {
      type: "writing";
      evaluationUUID: string;
      text: string;
      timeTaken: number;
    }
) & {
  targetingScore?: number;
};
