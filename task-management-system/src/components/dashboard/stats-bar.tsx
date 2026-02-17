import React from "react";

interface StatsBarProps {
    stats: {
        total: number;
        todo: number;
        inProgress: number;
        done: number;
    };
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatItem label="Total Tasks" value={stats.total} color="text-white" />
            <StatItem label="To Do" value={stats.todo} color="text-slate-400" />
            <StatItem label="In Progress" value={stats.inProgress} color="text-amber-500" />
            <StatItem label="Completed" value={stats.done} color="text-emerald-500" />
        </div>
    );
};

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="rounded-xl border border-glass bg-glass p-4 backdrop-blur-md">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                {label}
            </div>
            <div className={`text-2xl font-black ${color}`}>
                {value}
            </div>
        </div>
    );
}
