/**
 * Mathematical Design System with Golden Ratio Optimization
 * Built for CS ERP Application - World-Class UI/UX
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Mathematical constants
const GOLDEN_RATIO = 1.618033988749895;
const PHI = GOLDEN_RATIO;

// Container Component
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', centered = false, children, ...props }, ref) => {
    const maxWidths = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full px-4 sm:px-6 lg:px-8',
          maxWidths[size],
          centered && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = 'Container';

// Card System
const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-cs-default transition-all duration-phi',
  {
    variants: {
      variant: {
        default: 'border-border hover:shadow-cs-md',
        elevated: 'shadow-cs-lg hover:shadow-cs-xl',
        interactive: 'cursor-pointer hover:shadow-cs-md hover:-translate-y-1 hover:border-primary-200',
        danger: 'border-danger-200 bg-danger-50',
        success: 'border-success-200 bg-success-50',
        warning: 'border-warning-200 bg-warning-50',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

// Typography System
const headingVariants = cva(
  'font-semibold tracking-tight text-foreground',
  {
    variants: {
      size: {
        xs: 'text-sm',
        sm: 'text-base',
        default: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
        '2xl': 'text-3xl',
        '3xl': 'text-4xl',
      },
      color: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        primary: 'text-primary-600',
        success: 'text-success-600',
        warning: 'text-warning-600',
        danger: 'text-danger-600',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
    },
  }
);

interface HeadingProps<T extends keyof React.JSX.IntrinsicElements = 'h2'>
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">, VariantProps<typeof headingVariants> {
  as?: T;
}

const Heading = <T extends keyof React.JSX.IntrinsicElements = 'h2'>({
  className,
  size,
  color,
  as,
  children,
  ...props
}: HeadingProps<T> & { ref?: React.Ref<HTMLElement> }) => {
  const Component = (as || 'h2') as React.ElementType;

  return (
    <Component
      className={cn(headingVariants({ size, color }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};
Heading.displayName = 'Heading';

// Status Badge
const statusVariants = cva(
  'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
  {
    variants: {
      status: {
        draft: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
        pending: 'bg-warning-100 text-warning-700 border border-warning-200',
        processing: 'bg-primary-100 text-primary-700 border border-primary-200',
        completed: 'bg-success-100 text-success-700 border border-success-200',
        failed: 'bg-danger-100 text-danger-700 border border-danger-200',
        overdue: 'bg-danger-100 text-danger-700 border border-danger-200 animate-pulse',
        paid: 'bg-success-100 text-success-700 border border-success-200',
      },
    },
    defaultVariants: {
      status: 'draft',
    },
  }
);

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusVariants> {
  icon?: React.ReactNode;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(statusVariants({ status }), className)}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  )
);
StatusBadge.displayName = 'StatusBadge';

// Metric Card
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  description?: string;
  onClick?: () => void;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, change, icon, description, onClick, ...props }, ref) => (
    <Card
      ref={ref}
      variant={onClick ? 'interactive' : 'default'}
      onClick={onClick}
      padding="lg"
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-3 text-primary-500">
            {icon}
          </div>
        )}
      </div>

      {change && (
        <div className={cn(
          "flex items-center mt-3 text-xs font-medium",
          change.type === 'increase' && "text-success-600",
          change.type === 'decrease' && "text-danger-600",
          change.type === 'neutral' && "text-muted-foreground"
        )}>
          <span className="mr-1">
            {change.type === 'increase' && '↗'}
            {change.type === 'decrease' && '↘'}
            {change.type === 'neutral' && '→'}
          </span>
          {Math.abs(change.value)}%
          <span className="ml-1 text-muted-foreground">from last period</span>
        </div>
      )}
    </Card>
  )
);
MetricCard.displayName = 'MetricCard';

// Grid System
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'md', responsive = true, children, ...props }, ref) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    };

    const gridGap = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };

    const responsiveClasses = responsive ? {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12',
    } : gridCols;

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          responsive ? responsiveClasses[cols] : gridCols[cols],
          gridGap[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = 'Grid';

// Loading Components
const LoadingCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <Card className={cn('p-6 animate-pulse', className)} {...props}>
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded w-1/3"></div>
      <div className="h-8 bg-muted rounded w-2/3"></div>
      <div className="h-3 bg-muted rounded w-1/2"></div>
    </div>
  </Card>
);

const LoadingSpinner = ({ size = 'md', className, ...props }: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <div className={cn(
        'border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin',
        sizes[size]
      )} />
    </div>
  );
};

// Progress Bar
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, color = 'primary', size = 'md', showValue = false, className, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colorClasses = {
      primary: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      danger: 'bg-danger-500',
    };

    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <div className={cn('w-full', className)} {...props}>
        {showValue && (
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{value}</span>
            <span>{max}</span>
          </div>
        )}
        <div ref={ref} className={cn('bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out rounded-full',
              colorClasses[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';

export {
  Container,
  Grid,
  Heading,
  Card,
  MetricCard,
  StatusBadge,
  ProgressBar,
  LoadingCard,
  LoadingSpinner,
  GOLDEN_RATIO,
  PHI,
};