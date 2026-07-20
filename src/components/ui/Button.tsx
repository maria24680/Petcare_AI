import {
    ButtonHTMLAttributes,
    forwardRef,
    ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/helpers';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary: 'bg-[#111844] text-white hover:bg-[#4B5694]',
                secondary: 'bg-[#EAE0CF] text-[#111844] hover:bg-[#d5c8b5]',
                outline: 'border border-[#111844] text-[#111844] hover:bg-[#EAE0CF]',
                ghost: 'hover:bg-[#EAE0CF] hover:text-[#111844]',
                danger: 'bg-red-500 text-white hover:bg-red-600',
                success: 'bg-green-500 text-white hover:bg-green-600',
            },
            size: {
                sm: 'px-3 py-1.5 text-sm',
                md: 'px-4 py-2 text-sm',
                lg: 'px-6 py-3 text-base',
                xl: 'px-8 py-4 text-lg',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
    fullWidth?: boolean;
    icon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            loading,
            fullWidth,
            icon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    buttonVariants({ variant, size, className }),
                    fullWidth && 'w-full',
                    loading && 'cursor-wait'
                )}
                {...props}
            >
                {loading ? (
                    <>
                        <svg
                            className="mr-2 h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Loading...
                    </>
                ) : (
                    <>
                        {icon && (
                            <span className="mr-2 flex items-center">
                                {icon}
                            </span>
                        )}
                        {children}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;