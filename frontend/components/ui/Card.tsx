import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className, onClick }: CardProps) => (
  <div
    onClick={onClick}
    className={cn(
      'glass rounded-xl p-5',
      onClick && 'cursor-pointer hover:border-gray-700 transition-colors',
      className
    )}
  >
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={cn('text-sm font-medium text-gray-400 mb-1', className)}>
    {children}
  </h3>
);

export const CardValue = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={cn('text-2xl font-bold text-white', className)}>{children}</p>
);