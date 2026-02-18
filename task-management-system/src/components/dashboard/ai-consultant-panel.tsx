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
        <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 border-l border-white/5 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-right duration-500">
            <div className="flex h-full flex-col p-8">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">AI Consultant</h2>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Plan your objectives</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto space-y-10 pr-2 custom-scrollbar">
                    <section className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 shadow-inner">
                        <form onSubmit={handleConsult} className="space-y-4">
                            <Input
                                label="Project Goal"
                                placeholder="What's on your mind?"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                required
                                className="bg-zinc-950/50 border-white/5 focus:border-primary/50"
                            />
                            <Button isLoading={isLoading} className="w-full h-12 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                Ask Consultant ✨
                            </Button>
                        </form>
                    </section>

                    {error && (
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-center">
                            <p className="text-xs text-rose-500 font-medium">{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Suggested Roadmap</h3>
                                <span className="h-1 w-12 bg-primary/20 rounded-full" />
                            </div>
                            <div className="space-y-4">
                                {result.map((step, i) => (
                                    <div key={i} className="group relative rounded-2xl border border-white/5 bg-zinc-900/30 p-6 transition-all hover:bg-zinc-900/60 hover:border-primary/20">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                                                Step {i + 1}
                                            </span>
                                            <button
                                                onClick={() => onAddTask(step.title, step.description)}
                                                className="text-[10px] font-black text-white bg-zinc-800 hover:bg-primary px-3 py-1.5 rounded-md transition-all shadow-lg active:scale-95"
                                            >
                                                Add Task +
                                            </button>
                                        </div>
                                        <h4 className="text-base font-bold text-white mb-2 leading-tight">{step.title}</h4>
                                        <p className="text-xs text-zinc-400 leading-relaxed font-medium">{step.description}</p>
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
