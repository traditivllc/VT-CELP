"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import InputWrap from "@/components/ui/inputWrap";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AxiosError } from "axios";

const PromptQuestionSchema = z.object({
  celpTestPromptId: z.number().min(1, "Required"),
  celpLanguageId: z.number().min(1, "Required"),
  name: z.string().min(1, "Required"),
  imagePath: z.any().optional(), // Accept file or undefined
  isActive: z.boolean().optional(),
});

export type PromptQuestionFormValues = z.infer<typeof PromptQuestionSchema>;

interface Props {
  defaultValues?: PromptQuestionFormValues;
  onSubmit: (data: FormData) => void;
  isEdit?: boolean;
  formRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PromptQuestionsForm({
  defaultValues,
  onSubmit,
  isEdit,
  formRef,
}: Props) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PromptQuestionFormValues>({
    resolver: zodResolver(PromptQuestionSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof PromptQuestionFormValues, value);
      });
    }
  }, [defaultValues, setValue]);

  // Custom submit handler to handle file and multipart
  const onFormSubmit = async (data: PromptQuestionFormValues) => {
    setSubmitting(true);
    setApiError(null);
    const formData = new FormData();
    formData.append("celpTestPromptId", String(data.celpTestPromptId));
    formData.append("celpLanguageId", String(data.celpLanguageId));
    formData.append("name", data.name);
    if (
      data.imagePath &&
      data.imagePath instanceof FileList &&
      data.imagePath.length > 0
    ) {
      formData.append("imagePath", data.imagePath[0]);
    }
    if (typeof data.isActive !== "undefined") {
      formData.append("isActive", String(data.isActive));
    }
    try {
      await onSubmit(formData);
    } catch (err) {
      if (err instanceof AxiosError) {
        setApiError(err.response?.data?.message);
        return;
      }
      if (err instanceof Error) {
        setApiError(err.message);
      }
      setApiError("An unexpected error occurred.");
    }
    setSubmitting(false);
  };

  return (
    <Card ref={formRef}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <InputWrap
          label="celpTestPromptId"
          required
          error={errors.celpTestPromptId?.message}
        >
          <Input
            type="number"
            {...register("celpTestPromptId", { valueAsNumber: true })}
          />
        </InputWrap>
        <InputWrap
          label="celpLanguageId"
          required
          error={errors.celpLanguageId?.message}
        >
          <Input
            type="number"
            {...register("celpLanguageId", { valueAsNumber: true })}
          />
        </InputWrap>
        <InputWrap label="Name" required error={errors.name?.message}>
          <Input type="text" {...register("name")} />
        </InputWrap>
        <InputWrap
          label="Image Path"
          error={
            typeof errors.imagePath?.message === "string"
              ? errors.imagePath.message
              : undefined
          }
        >
          <Input type="file" accept="image/*" {...register("imagePath")} />
        </InputWrap>
        <InputWrap label="Is Active" error={errors.isActive?.message}>
          <Checkbox
            {...register("isActive")}
            checked={watch("isActive") || false}
            onCheckedChange={(value: boolean) => {
              setValue("isActive", value);
            }}
          />
        </InputWrap>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={submitting}
        >
          {submitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update"
            : "Create"}
        </button>
        {apiError && (
          <div className="text-red-600 text-sm mt-2">{apiError}</div>
        )}
      </form>
    </Card>
  );
}
