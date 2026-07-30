import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-5">
          <Icon className="w-7 h-7 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-5">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl transition-all active:scale-[0.97] shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
