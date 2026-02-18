"use client";

import React, { useState, useEffect } from "react";
import { AuthCard } from "@/components/ui/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StyledLink } from "@/components/ui/styled-link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (searchParams.get("registered")) {
            setSuccess("Account created successfully! Please log in.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            // On success, redirect to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
            setSuccess(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthCard
            title="Welcome Back"
            subtitle="Sign in to access your dashboard and tasks"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-500">
                        {success}
                    </div>
                )}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <Button type="submit" isLoading={isLoading} className="mt-6">
                    Sign In
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                New here?{" "}
                <StyledLink href="/auth/register">Create an account</StyledLink>
            </div>
        </AuthCard>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
