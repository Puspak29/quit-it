import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card = ({ children, className, onClick, hoverEffect = true, ...props }: CardProps) => (
  <motion.div
    onClick={onClick}
    whileHover={onClick && hoverEffect ? { y: -2 } : {}}
    className={cn(
      'glass rounded-2xl p-5 relative overflow-hidden group',
      onClick && 'cursor-pointer hover:border-foreground/20 transition-all duration-300',
      className
    )}
    {...props}
  >
    {/* Subtle gradient overlay on hover */}
    {onClick && hoverEffect && (
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    )}
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={cn('text-sm font-medium text-foreground/60 mb-1 tracking-wide', className)}>
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
  <p className={cn('text-2xl font-semibold text-foreground tracking-tight', className)}>{children}</p>
);