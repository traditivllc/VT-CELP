import z from "zod";

export const LoginSchema = z.object({
  email: z.email().nonempty(),
});

export type LoginSchemaTypes = z.infer<typeof LoginSchema>;

export const LoginOTPSchema = z.object({
  otp: z.number().min(10_00_00).max(99_99_99),
});

export type LoginOTPSchemaTypes = z.infer<typeof LoginOTPSchema>;
