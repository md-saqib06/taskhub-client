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

const priorityColorMap = {
    LOW: "secondary",
    MEDIUM: "default",
    HIGH: "destructive",
} as const;

const TaskCard = ({
    task,
}: {
    task: {
        title: string;
        description?: string;
        priority: string;
        assignedUser?: {
            name: string;
            avatarUrl?: string;
        };
        dueDate?: string;
    };
}) => {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold">
                        {task.title}
                    </h3>

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
    );
};

export default TaskCard;