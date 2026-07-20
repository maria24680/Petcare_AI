import { cn } from '@/lib/utils/helpers';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circle' | 'rect';
    count?: number;
}

const Skeleton = ({ className, variant = 'rect', count = 1 }: SkeletonProps) => {
    const variantClasses = {
        text: 'h-4 rounded',
        circle: 'rounded-full',
        rect: 'rounded-lg',
    };

    const items = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {items.map((i) => (
                <div
                    key={i}
                    className={cn(
                        'animate-pulse bg-gray-200',
                        variantClasses[variant],
                        className
                    )}
                />
            ))}
        </>
    );
};

export default Skeleton;