import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const switchVariants = {
  default:
    "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
  destructive:
    "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
  outline:
    "border border-border data-[state=checked]:bg-primary data-[state=unchecked]:bg-background",
  secondary:
    "data-[state=checked]:bg-secondary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
  danger:
    "data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
  ghost:
    "bg-transparent border-none shadow-none data-[state=checked]:bg-primary/20",
  link: "bg-transparent underline-offset-4 hover:underline data-[state=checked]:bg-primary/20",
  green:
    "data-[state=checked]:bg-green-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
} as const;

type VariantType = keyof typeof switchVariants;

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  variant?: VariantType;
}

function Switch({ className, variant = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        switchVariants[variant],
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
