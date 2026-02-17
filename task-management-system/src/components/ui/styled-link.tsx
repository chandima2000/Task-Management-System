import Link, { LinkProps } from "next/link";
import React from "react";

interface StyledLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
}

export const StyledLink: React.FC<StyledLinkProps> = ({ children, className, ...props }) => {
    return (
        <Link
            {...props}
            className={`text-sm font-medium text-primary transition-colors hover:text-accent ${className}`}
        >
            {children}
        </Link>
    );
};
