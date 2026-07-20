import { cn } from '@/lib/utils/helpers';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    color?: string;
}

const LoadingSpinner = ({
    size = 'md',
    className,
    color = '#4B5694'
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={cn(
                    'animate-spin rounded-full border-solid border-t-transparent',
                    sizeClasses[size],
                    className
                )}
                style={{ borderColor: color, borderTopColor: 'transparent' }}
            />
        </div>
    );
};

export default LoadingSpinner;