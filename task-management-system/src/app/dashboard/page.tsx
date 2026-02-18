"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TaskCard } from "@/components/dashboard/task-card";
import { StatsBar } from "@/components/dashboard/stats-bar";
import { StatusFilter } from "@/components/dashboard/status-filter";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/dashboard/task-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TaskStatus } from "@/app/generated/prisma/enums";
import { AIConsultantPanel } from "@/components/dashboard/ai-consultant-panel";

export default function DashboardPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<any[]>([]);
    const [activeStatus, setActiveStatus] = useState<TaskStatus | "ALL">("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal & Panel State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = activeStatus === "ALL"
                ? "/api/tasks"
                : `/api/tasks?status=${activeStatus}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch tasks");

            const data = await response.json();
            setTasks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [activeStatus]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    };

    const handleCreateTask = async (data: any) => {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Failed to create task");
        }

        setIsModalOpen(false);
        fetchTasks();
    };

    const handleQuickAddTask = async (title: string, description: string) => {
        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    status: "TODO",
                    priority: "MEDIUM"
                }),
            });

            if (!response.ok) throw new Error("Failed to add task from AI suggestion");

            fetchTasks();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleUpdateTask = async (data: any) => {
        if (!editingTask) return;

        const response = await fetch(`/api/tasks/${editingTask.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Failed to update task");
        }

        setIsModalOpen(false);
        setEditingTask(null);
        fetchTasks();
    };

    const handleDeleteTask = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete task");

            fetchTasks();
        } catch (err: any) {
            alert(err.message);
        }
    };


    const openEditModal = (task: any) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const stats = {
        total: tasks.length,
        todo: tasks.filter((t: any) => t.status === "TODO").length,
        inProgress: tasks.filter((t: any) => t.status === "IN_PROGRESS").length,
        done: tasks.filter((t: any) => t.status === "DONE").length,
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 overflow-x-hidden">
            {/* Header */}
            <header className="mx-auto mb-10 flex max-w-6xl items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-sm text-slate-400 font-medium">Welcome back to your workspace</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsAIPanelOpen(true)}
                        className="text-xs font-bold uppercase tracking-widest text-primary border-primary/20 hover:text-primary hover:bg-primary/10 transition-all px-4"
                    >
                        Ask AI Consultant ✨
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="h-10 w-auto px-4">
                        Logout
                    </Button>
                    <Button
                        className="h-10 w-auto px-6 shadow-lg shadow-primary/20"
                        onClick={() => {
                            setEditingTask(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Add New Task
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl space-y-8">
                {/* Stats Section */}
                <StatsBar stats={stats} />

                {/* Filter Section */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-glass bg-glass p-4 backdrop-blur-md sm:flex-row">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                        Your Tasks
                    </h2>
                    <StatusFilter activeStatus={activeStatus} onStatusChange={setActiveStatus} />
                </div>

                {/* Task Grid */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task: any) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={() => openEditModal(task)}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-glass bg-glass/20 text-center">
                        <div className="mb-4 text-4xl">📭</div>
                        <h3 className="text-lg font-bold text-white">No tasks found</h3>
                        <p className="text-sm text-slate-400">Time to dream up something new!</p>
                    </div>
                )}
            </main>

            {/* Task Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTask ? "Edit Task" : "Create New Task"}
            >
                <TaskForm
                    initialData={editingTask}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* AI Consultant Backdrop */}
            {isAIPanelOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsAIPanelOpen(false)}
                />
            )}

            {/* AI Consultant Panel */}
            <AIConsultantPanel
                isOpen={isAIPanelOpen}
                onClose={() => setIsAIPanelOpen(false)}
                onAddTask={handleQuickAddTask}
            />
        </div>
    );
}
