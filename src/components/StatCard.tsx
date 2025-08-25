import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "warning" | "success" | "destructive";
  description?: string;
}

const StatCard = ({ title, value, icon: Icon, variant = "default", description }: StatCardProps) => {
  const variantClasses = {
    default: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
    warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
    success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
    destructive: "border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10",
  };

  const iconVariantClasses = {
    default: "text-primary bg-primary/10",
    warning: "text-warning bg-warning/10",
    success: "text-success bg-success/10",
    destructive: "text-destructive bg-destructive/10",
  };

  return (
    <Card className={cn(
      "p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border",
      variantClasses[variant]
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          iconVariantClasses[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;