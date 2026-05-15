import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditTaskDialog from "./EditTaskDialog";
import { GripVertical } from "lucide-react";

const priorityColorMap = {
    LOW: "secondary",
    MEDIUM: "default",
    HIGH: "destructive",
} as const;

const TaskCard = ({
    task,
}: {
    task: {
        id: string;
        title: string;
        description?: string;
        priority: string;
        assignedUser?: {
            name: string;
            avatarUrl?: string;
        };
        dueDate?: string;
        projectId: string;
        status: string;
    };
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        // animateLayoutChanges: () => true,
    });

    const style = {
        transform:
            CSS.Transform.toString(
                transform
            ),

        transition,

        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <EditTaskDialog
            task={task}
        >
            <Card
                ref={setNodeRef}
                style={style}
                className="cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
            >
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2 flex-1">
                            <button
                                className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                                {...listeners}
                                {...attributes}
                            >
                                <GripVertical className="h-4 w-4" />
                            </button>

                            <div className="flex-1">
                                <h3 className="font-semibold">
                                    {task.title}
                                </h3>

                            </div>
                        </div>

                        <Badge
                            variant={
                                priorityColorMap[
                                task.priority as keyof typeof priorityColorMap
                                ]
                            }
                        >
                            {task.priority}
                        </Badge>
                    </div>

                    {task.description && (
                        <p className="text-sm text-muted-foreground">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        {task.assignedUser ? (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={
                                            task.assignedUser
                                                .avatarUrl
                                        }
                                    />

                                    <AvatarFallback>
                                        {task.assignedUser.name[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <span className="text-sm">
                                    {
                                        task.assignedUser
                                            .name
                                    }
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                Unassigned
                            </span>
                        )}

                        {task.dueDate && (
                            <span className="text-xs text-muted-foreground">
                                {new Date(
                                    task.dueDate
                                ).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </EditTaskDialog>
    );
};

export default TaskCard;