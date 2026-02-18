import React from "react";
import { TaskStatus } from "@/app/generated/prisma/enums";

interface StatusFilterProps {
    activeStatus: TaskStatus | "ALL";
    onStatusChange: (status: TaskStatus | "ALL") => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ activeStatus, onStatusChange }) => {
    const statuses: (TaskStatus | "ALL")[] = ["ALL", "TODO", "IN_PROGRESS", "DONE"];

    return (
        <div className="flex space-x-1 rounded-lg bg-slate-900/50 p-1">
            {statuses.map((status) => (
                <button
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className={`rounded-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeStatus === status
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                >
                    {status.replace("_", " ")}
                </button>
            ))}
        </div>
    );
};
