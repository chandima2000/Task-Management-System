import React from "react";
import { TaskStatus } from "@/app/generated/prisma/enums";

interface TaskCardProps {
    task: {
        id: number;
        title: string;
        description: string | null;
        status: TaskStatus;
        createdAt: string;
    };
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const statusColors = {
    TODO: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    DONE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
    return (
        <div className="group rounded-xl border border-glass bg-glass p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-slate-900/40">
            <div className="mb-3 flex items-start justify-between">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[task.status]}`}>
                    {task.status.replace("_", " ")}
                </span>
                <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        onClick={() => onEdit(task.id)}
                        className="text-slate-400 hover:text-primary transition-colors"
                        title="Edit Task"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete Task"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>

            <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-primary">
                {task.title}
            </h3>

            {task.description && (
                <p className="mb-4 text-sm text-slate-400 line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                Created {new Date(task.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
};
