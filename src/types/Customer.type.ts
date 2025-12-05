export type CurrentCustomerType = {
  customerUuid: string;
  dateOfAnniversary: string | null;
  dateOfBirth: string | null;
  email: string;
  firstName: string | null;
  gender: "male" | "female" | "other" | "prefer_not_to_say"; // adjust based on possible values
  lastName: string | null;
  middleName: string | null;
  phoneNumber: string | null;
};
