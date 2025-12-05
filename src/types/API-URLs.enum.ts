import type { CurrentCustomerType } from "./Customer.type";

export type CurrentCustomerAPIResponse = {
  customer: CurrentCustomerType;
};
export type LoginAPIResponse = {
  expireAt: string;
  isNewCustomer: false;
  customer: CurrentCustomerType;
};
