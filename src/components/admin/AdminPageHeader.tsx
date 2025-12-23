import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  children?: React.ReactNode;
  className?: string;
}

const AdminPageHeader = ({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
}: AdminPageHeaderProps) => {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/10 shadow-sm">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h2>
            {description && (
              <p className="text-sm md:text-base text-muted-foreground/80 font-medium">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 pl-0 sm:pl-0">
          {children}
          {action && (
            <Button 
              onClick={action.onClick} 
              className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
        </div>
      </div>
      <div className="mt-4 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
    </div>
  );
};

export default AdminPageHeader;
