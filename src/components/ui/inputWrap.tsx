import { cn } from "@/lib/utils";
import Label from "./label";

export default function InputWrap({
  children,
  error,
  label,
  required = false,
  hidden = false,
  className = "",
}: {
  children: React.ReactNode;
  error?: string;
  label?: string;
  required?: boolean;
  hidden?: boolean;
  className?: string;
}) {
  if (hidden) {
    return null;
  }
  return (
    <div className={cn("flex flex-col gap-1 w-full mb-4", className)}>
      {label && (
        <Label className="font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
