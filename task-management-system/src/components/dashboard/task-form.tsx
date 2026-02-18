"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/app/generated/prisma/enums";

interface TaskFormProps {
    initialData?: {
        id?: number;
        title: string;
        description: string | null;
        status: TaskStatus;
    };
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        status: initialData?.status || TaskStatus.TODO,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500 font-medium">
                    {error}
                </div>
            )}

            <Input
                label="Task Title"
                placeholder="Enter task title..."
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Description
                </label>
                <textarea
                    rows={3}
                    placeholder="What needs to be done?"
                    className="w-full rounded-lg border border-border bg-slate-900/50 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-3 gap-2">
                {(Object.keys(TaskStatus) as Array<keyof typeof TaskStatus>).map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: TaskStatus[status] })}
                        className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${formData.status === TaskStatus[status]
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "border border-glass bg-white/5 text-slate-400 hover:text-white"
                            }`}
                    >
                        {status.replace("_", " ")}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData?.id ? "Update Task" : "Create Task"}
                </Button>
            </div>
        </form>
    );
};
