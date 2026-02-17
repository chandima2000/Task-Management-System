import React from "react";

interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-glass bg-glass p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-primary/50">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-slate-400">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};
