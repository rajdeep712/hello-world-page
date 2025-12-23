import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
  isLoading?: boolean;
}

const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = 'text-primary',
  isLoading = false,
}: AdminStatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-2.5 rounded-xl bg-muted/50 transition-colors group-hover:bg-primary/10', colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              trend.isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          {isLoading ? (
            <div className="h-9 w-20 bg-muted/50 rounded-md animate-pulse" />
          ) : (
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
