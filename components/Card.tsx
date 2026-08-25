import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md p-6 border border-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function CardHeader({ title, description, children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('pb-4 border-b border-slate-200', className)} {...props}>
      {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
      {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      {children}
    </div>
  );
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn('py-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('pt-4 border-t border-slate-200 flex gap-2', className)} {...props}>
      {children}
    </div>
  );
}
