"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AIConsultantPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTask: (title: string, description: string) => void;
}

export const AIConsultantPanel: React.FC<AIConsultantPanelProps> = ({ isOpen, onClose, onAddTask }) => {
    const [goal, setGoal] = useState("");
    const [result, setResult] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConsult = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://localhost:8080/breakdown", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: goal }),
            });

            if (!response.ok) throw new Error("AI Agent is not responding. Please ensure the Python service is running.");

            const data = await response.json();
            setResult(data.subtasks);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 border-l border-glass bg-slate-900/95 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-300">
            <div className="flex h-full flex-col p-6">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">AI Consultant</h2>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Plan your next move</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                    <section className="rounded-xl border border-glass bg-white/5 p-4">
                        <form onSubmit={handleConsult} className="space-y-4">
                            <Input
                                label="Project Goal"
                                placeholder="What are you planning?"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                required
                                className="bg-slate-950/50"
                            />
                            <Button isLoading={isLoading} className="w-full">
                                Ask Consultant ✨
                            </Button>
                        </form>
                    </section>

                    {error && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
                            <p className="text-xs text-red-500 font-medium">{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Suggested Roadmap</h3>
                            <div className="space-y-3">
                                {result.map((step, i) => (
                                    <div key={i} className="group relative rounded-xl border border-glass bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-primary/30">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                                Step {i + 1}
                                            </span>
                                            <button
                                                onClick={() => onAddTask(step.title, step.description)}
                                                className="text-[10px] font-bold text-white bg-primary hover:bg-primary/80 px-2 py-1 rounded transition-colors shadow-lg shadow-primary/20"
                                            >
                                                Add Task +
                                            </button>
                                        </div>
                                        <h4 className="text-sm font-bold text-white mb-1">{step.title}</h4>
                                        <p className="text-xs text-slate-400 line-clamp-2">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!result && !isLoading && !error && (
                        <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-glass text-center p-4">
                            <p className="text-xs text-slate-500">Tell me what you're planning and I'll break it down for you.</p>
                        </div>
                    )}
                </div>

            </div>
        </aside>
    );
};
