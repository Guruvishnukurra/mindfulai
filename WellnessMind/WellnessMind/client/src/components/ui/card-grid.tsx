
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    desktop?: number;
  };
}

export function CardGrid({ 
  children, 
  className,
  columns = { mobile: 1, desktop: 3 }
}: CardGridProps) {
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "grid gap-4",
        isMobile 
          ? `grid-cols-${columns.mobile || 1}` 
          : `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns.desktop || 3}`,
        className
      )}
    >
      {children}
    </div>
  );
}
