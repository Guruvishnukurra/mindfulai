
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileButton({ className, size, ...props }: ButtonProps) {
  return (
    <Button
      className={cn("min-h-[44px]", className)}
      size={size || "lg"}
      {...props}
    />
  );
}
