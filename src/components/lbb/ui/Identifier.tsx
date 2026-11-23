import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Identifier({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={cn("num inline-block unicode-bidi-isolate", className)}>
      {children}
    </bdi>
  );
}
