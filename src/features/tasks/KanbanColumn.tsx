import {
    useDroppable,
} from "@dnd-kit/core";

import TaskCard from "./TaskCard";

const KanbanColumn = ({
    id,
    title,
    tasks,
    isActive,
}: {
    id: string;
    title: string;
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
    isActive: boolean;
}) => {
    const {
        setNodeRef,
    } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className={` rounded-xl p-4 min-h-[500px] transition-colors duration-200 ${isActive
                ? "bg-primary/10 border border-primary"
                : "bg-muted/40 border border-transparent"
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                    {title}
                </h3>

                <span className="text-sm text-muted-foreground">
                    {tasks.length}
                </span>
            </div>

            <div className="space-y-3">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanColumn;