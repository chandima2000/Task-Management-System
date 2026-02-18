"use client";

import React, { useState } from "react";
import { AuthCard } from "@/components/ui/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StyledLink } from "@/components/ui/styled-link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setGeneralError(null);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details && Array.isArray(data.details)) {
                    const validationErrors: Record<string, string> = {};
                    data.details.forEach((err: any) => {
                        validationErrors[err.path[0]] = err.message;
                    });
                    setErrors(validationErrors);
                    throw new Error("Please correct the highlighted errors.");
                }
                throw new Error(data.error || "Registration failed");
            }

            // On success, redirect to login or dashboard
            router.push("/auth/login?registered=true");
        } catch (err: any) {
            setGeneralError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthCard
            title="Create Account"
            subtitle="Join us and start managing your tasks intelligently"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {generalError && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500 font-medium">
                        {generalError}
                    </div>
                )}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    error={errors.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        error={errors.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <ul className="mt-2 space-y-1 px-1 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        <li className={formData.password.length >= 8 ? "text-emerald-500" : ""}>• Minimum 8 Characters</li>
                        <li className={/[A-Z]/.test(formData.password) ? "text-emerald-500" : ""}>• At least one uppercase letter</li>
                        <li className={/[0-9]/.test(formData.password) ? "text-emerald-500" : ""}>• At least one number</li>
                    </ul>
                </div>

                <Button type="submit" isLoading={isLoading} className="mt-6">
                    Register
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <StyledLink href="/auth/login">Sign in</StyledLink>
            </div>
        </AuthCard>
    );
}
