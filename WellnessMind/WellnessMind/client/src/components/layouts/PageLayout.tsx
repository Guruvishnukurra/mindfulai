
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full",
        isMobile ? "px-4 pt-16 pb-6" : "px-8 py-6",
        className
      )}
    >
      {children}
    </div>
  );
}
