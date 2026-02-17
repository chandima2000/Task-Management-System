import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    isLoading,
    className,
    disabled,
    ...props
}) => {
    const baseStyles = "relative flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-primary text-white hover:bg-accent focus:ring-primary shadow-lg shadow-primary/20",
        secondary: "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-800",
        outline: "border border-border bg-transparent text-foreground hover:bg-white/5 hover:border-white/20 focus:ring-white/20",
    };

    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};
