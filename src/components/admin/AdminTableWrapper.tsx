import { cn } from '@/lib/utils';

interface AdminTableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const AdminTableWrapper = ({ children, className }: AdminTableWrapperProps) => {
  return (
    <div className={cn(
      'rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm',
      className
    )}>
      {children}
    </div>
  );
};

export default AdminTableWrapper;
