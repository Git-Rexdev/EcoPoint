import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: ReactNode;
  icon?: LucideIcon;
  trend?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning';
}

export function StatsCard({ title, value, icon: Icon, trend, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'from-primary/10 to-primary/5 text-primary border-primary/20',
    accent: 'from-accent/10 to-accent/5 text-accent border-accent/20',
    success: 'from-success/10 to-success/5 text-success border-success/20',
    warning: 'from-warning/10 to-warning/5 text-warning border-warning/20',
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {trend && (
            <p className="text-xs text-muted-foreground mt-2">{trend}</p>
          )}
        </div>
        {/* Icon removed by request - star/icon on the right is intentionally hidden */}
      </div>
    </Card>
  );
}
