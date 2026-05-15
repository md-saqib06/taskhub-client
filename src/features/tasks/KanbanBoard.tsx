import {
    DndContext,
    DragOverlay,
    type DragOverEvent,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTaskStatus } from "@/api/tasks";

import KanbanColumn from "./KanbanColumn";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";


const columns = [
    {
        id: "TODO",
        title: "Todo",
    },
    {
        id: "IN_PROGRESS",
        title: "In Progress",
    },
    {
        id: "DONE",
        title: "Done",
    },
];

const KanbanBoard = ({
    tasks,
    projectId,
}: {
    tasks: {
        id: string;
        title: string;
        description?: string;
        priority: string;
        status: string;
        assignedUser?: {
            name: string;
            avatarUrl?: string;
        };
        dueDate?: string;
    }[];
    projectId: string;
}) => {
    const queryClient = useQueryClient();

    const [activeTask, setActiveTask] = useState<{
        id: string;
        title: string;
        description?: string;
        priority: string;
        status: string;
        assignedUser?: {
            name: string;
            avatarUrl?: string;
        };
        dueDate?: string;
    }>();
    const [activeColumn, setActiveColumn] = useState<string | null>(null);
    const [boardTasks, setBoardTasks] = useState(tasks);

    useEffect(() => {
        setBoardTasks(tasks);
    }, [tasks]);

    const handleDragStart = (
        event: DragStartEvent
    ) => {
        const task = boardTasks.find(
            (t) => t.id === event.active.id
        );

        setActiveTask(task);
    };

    const handleDragOver = (
        event: DragOverEvent
    ) => {
        const { over } = event;

        if (!over) {
            setActiveColumn(null);
            return;
        }

        const overId = over.id as string;

        const isColumn =
            overId === "TODO" ||
            overId === "IN_PROGRESS" ||
            overId === "DONE";

        if (isColumn) {
            setActiveColumn(overId);
            return;
        }

        const overTask =
            findTaskById(overId);

        if (!overTask) {
            setActiveColumn(null);
            return;
        }

        setActiveColumn(
            overTask.status
        );
    };

    const mutation = useMutation({
        mutationFn: ({
            taskId,
            status,
        }: {
            taskId: string;
            status:
            | "TODO"
            | "IN_PROGRESS"
            | "DONE";
        }) =>
            updateTaskStatus(
                taskId,
                status
            ),

        onError: () => {
            setActiveTask(undefined);

            toast.error(
                "Failed to update task"
            );
        },

        onSettled: () => {
            setActiveTask(null);

            queryClient.invalidateQueries({
                queryKey: [
                    "tasks",
                    projectId,
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "activities",
                    projectId,
                ],
            });
        },
    });

    const findTaskById = (
        taskId: string
    ) => {
        return boardTasks.find(
            (task) => task.id === taskId
        );
    };

    const handleDragEnd = (
        event: DragEndEvent
    ) => {
        const { active, over } = event;

        if (!over) return;

        const activeTask =
            findTaskById(
                active.id as string
            );

        if (!activeTask) return;

        let newStatus: string;

        const overId = over.id as string;

        const isColumn =
            overId === "TODO" ||
            overId === "IN_PROGRESS" ||
            overId === "DONE";

        if (isColumn) {
            newStatus = overId as
                | "TODO"
                | "IN_PROGRESS"
                | "DONE";
        } else {
            const overTask = findTaskById(overId);

            if (!overTask) return;

            newStatus = overTask.status;
        }

        if (
            activeTask.status === newStatus
        ) {
            return;
        }

        setBoardTasks((prev) =>
            prev.map((task) =>
                task.id === active.id
                    ? {
                        ...task,
                        status: newStatus,
                    }
                    : task
            )
        );

        mutation.mutate({
            taskId: active.id as string,
            status: newStatus as "TODO" | "IN_PROGRESS" | "DONE",
        });
    };

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
        >
            <DragOverlay>
                {activeTask ? (
                    <div className="rotate-2 opacity-90">
                        <TaskCard
                            task={activeTask}
                        />
                    </div>
                ) : null}
            </DragOverlay>
            <div className="grid gap-4 lg:grid-cols-3">
                {columns.map((column) => {
                    const columnTasks = boardTasks.filter(
                        (task) =>
                            task.status === column.id
                    );

                    return (
                        <SortableContext
                            key={column.id}
                            items={columnTasks.map(
                                (task) => task.id
                            )}
                            strategy={
                                verticalListSortingStrategy
                            }
                        >
                            <KanbanColumn
                                id={column.id}
                                title={column.title}
                                tasks={columnTasks}
                                isActive={
                                    activeColumn === column.id
                                }
                            />
                        </SortableContext>
                    );
                })}
            </div>
        </DndContext>
    );
};

export default KanbanBoard;