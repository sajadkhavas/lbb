import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/lib/navigation";

export function NavigationLink({
  item,
  className,
  active = false,
  onNavigate,
  children,
  autofocus = false,
}: {
  item: NavigationItem;
  className?: string;
  active?: boolean;
  onNavigate?: () => void;
  children?: React.ReactNode;
  autofocus?: boolean;
}) {
  return (
    <Link
      to={item.to}
      params={item.params}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      data-autofocus={autofocus ? "true" : undefined}
      className={cn(className)}
    >
      {children ?? item.label}
    </Link>
  );
}
