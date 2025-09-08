import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "blue" | "green" | "yellow" | "red";
}

export function StatsCard({ title, value, icon: Icon, trend, color = "blue" }: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <Card className="card-dashboard hover:shadow-large transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
            {trend && (
              <p className="text-sm text-muted-foreground">
                <span className={`font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>{' '}
                {trend.label}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}