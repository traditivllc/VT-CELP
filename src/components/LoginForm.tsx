import { useAuth } from "@/comman/contexts/AuthContext";
import {
  LoginOTPSchema,
  LoginSchema,
  type LoginOTPSchemaTypes,
  type LoginSchemaTypes,
} from "@/comman/zode/Login.z";
import api from "@/lib/axios";
import { type LoginAPIResponse } from "@/types/API-URLs.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "./ui/input";
import type { CurrentCustomerType } from "@/types/Customer.type";
import { API_ENDPOINTS } from "@/types/Api.type";

export default function LoginForm({
  onLogin,
}: {
  onLogin?: (customer: CurrentCustomerType) => void;
}) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login: authLogin } = useAuth();

  // Form for email step
  const emailForm = useForm<LoginSchemaTypes>({
    resolver: zodResolver(LoginSchema),
  });

  // Form for OTP step
  const otpForm = useForm<LoginOTPSchemaTypes>({
    resolver: zodResolver(LoginOTPSchema),
  });

  async function handleStep1Submit(data: LoginSchemaTypes) {
    setIsLoading(true);
    console.log("Email submitted:", data.email);
    setEmail(data.email);
    try {
      await api.post(API_ENDPOINTS.SEND_OTP, { email: data.email });
      setStep(2);
    } catch {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  }

  async function handleOtpSubmit(data: LoginOTPSchemaTypes) {
    setIsLoading(true);

    try {
      const login = await api.post<LoginAPIResponse>(API_ENDPOINTS.LOGIN, {
        email,
        otp: data.otp,
      });
      if (!login.data) {
        toast.error("Something went wrong. Please try again.");
      }
      authLogin(login.data.customer);
      onLogin?.(login.data.customer);
    } catch {
      setError(true);
      otpForm.setError("otp", {
        type: "manual",
        message: "Invalid OTP. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <>
      {step === 1 ? (
        <form onSubmit={emailForm.handleSubmit(handleStep1Submit)}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <Input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              {...emailForm.register("email")}
            />
            {emailForm.formState.errors.email && (
              <div className="invalid-feedback d-block">
                {emailForm.formState.errors.email.message}
              </div>
            )}
          </div>
          <button
            className="btn brand-btn w-100"
            type="submit"
            disabled={isLoading}
          >
            Continue
          </button>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
          <div className="mb-3">
            <label className="form-label">Enter OTP sent to {email}</label>
            <div className="d-flex gap-2">
              <Input
                type="text"
                maxLength={6}
                className={`form-control text-center fs-4 ${
                  error || otpForm.formState.errors.otp ? "is-invalid" : ""
                }`}
                placeholder={"----"}
                {...otpForm.register("otp", {
                  valueAsNumber: true,
                })}
                onChange={(e) => {
                  setError(false);
                  otpForm.clearErrors("otp");

                  const value = e.target.value.replace(/\D/g, "");
                  otpForm.setValue("otp", value as unknown as number);
                }}
              />
            </div>
            {otpForm.formState.errors.otp && (
              <div className="invalid-feedback d-block">
                {otpForm.formState.errors.otp.message}
              </div>
            )}
          </div>
          <button className="btn brand-btn w-100" type="submit">
            Verify &amp; Sign In
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setStep(1);
              setError(false);
              otpForm.reset();
            }}
            className="btn cta-btn w-100"
          >
            ← Back to email
          </button>
        </form>
      )}
    </>
  );
}
