import { type ReactNode, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    createTaskSchema,
    type CreateTaskInput,
} from "./validation";

import {
    updateTask,
    deleteTask,
} from "@/api/tasks";

import {
    getProjectMembers,
} from "@/api/projects";

import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type EditTaskDialogProps = {
    task: {
        id: string;
        title: string;
        description?: string;
        priority: string;
        dueDate?: string;
        assignedUserId?: string;
        projectId: string;
        status: string;
    };
    children: ReactNode;
};

const EditTaskDialog = ({
    task,
    children,
}: EditTaskDialogProps) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(
        task.dueDate ? new Date(task.dueDate) : undefined
    );

    const queryClient = useQueryClient();

    const membersQuery = useQuery({
        queryKey: [
            "members",
            task.projectId,
        ],

        queryFn: () =>
            getProjectMembers(
                task.projectId
            ),
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
    } = useForm<CreateTaskInput>({
        resolver: zodResolver(
            createTaskSchema
        ),

        defaultValues: {
            title: task.title,
            description:
                task.description || "",

            priority: task.priority as "LOW" | "MEDIUM" | "HIGH",

            assignedUserId:
                task.assignedUserId ||
                undefined,

            dueDate: task.dueDate
                ? new Date(task.dueDate)
                    .toISOString()
                    .split("T")[0]
                : "",
        },
    });

    const updateMutation =
        useMutation({
            mutationFn: (
                data: CreateTaskInput
            ) =>
                updateTask(task.id, {
                    ...data,
                    status: task.status,
                }),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "tasks",
                        task.projectId,
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "activities",
                        task.projectId,
                    ],
                });

                toast.success(
                    "Task updated"
                );

                setOpen(false);
            },

            onError: () => {
                toast.error(
                    "Failed to update task"
                );
            },
        });

    const deleteMutation =
        useMutation({
            mutationFn: () =>
                deleteTask(task.id),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "tasks",
                        task.projectId,
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "activities",
                        task.projectId,
                    ],
                });

                toast.success(
                    "Task deleted"
                );

                setOpen(false);
            },

            onError: () => {
                toast.error(
                    "Failed to delete task"
                );
            },
        });

    const onSubmit = (
        data: CreateTaskInput
    ) => {
        updateMutation.mutate(data);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(
                value
            ) => {
                setOpen(value);

                if (value) {
                    const parsedDate = task.dueDate
                        ? new Date(task.dueDate)
                        : undefined;

                    setDate(parsedDate);

                    reset({
                        title: task.title,
                        description:
                            task.description ||
                            "",

                        priority: task.priority as "LOW" | "MEDIUM" | "HIGH",

                        assignedUserId:
                            task.assignedUserId ||
                            undefined,

                        dueDate: parsedDate
                            ? parsedDate.toISOString()
                            : undefined,
                    });
                }
            }}
        >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Task
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    className="space-y-4"
                >
                    <Input
                        placeholder="Task title"
                        {...register("title")}
                    />

                    <Textarea
                        placeholder="Description"
                        {...register(
                            "description"
                        )}
                    />

                    <Select
                        defaultValue={
                            task.priority
                        }
                        onValueChange={(
                            value
                        ) =>
                            setValue(
                                "priority",
                                value as
                                | "LOW"
                                | "MEDIUM"
                                | "HIGH"
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="LOW">
                                Low
                            </SelectItem>

                            <SelectItem value="MEDIUM">
                                Medium
                            </SelectItem>

                            <SelectItem value="HIGH">
                                High
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        defaultValue={
                            task.assignedUserId
                        }
                        onValueChange={(
                            value
                        ) =>
                            setValue(
                                "assignedUserId",
                                value
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Assign member" />
                        </SelectTrigger>

                        <SelectContent>
                            {membersQuery.data?.map(
                                (
                                    member: {
                                        id: string;
                                        user: {
                                            id: string;
                                            name: string;
                                            avatarUrl?: string;
                                        }
                                    }
                                ) => (
                                    <SelectItem
                                        key={
                                            member.id
                                        }
                                        value={
                                            member.user.id
                                        }
                                    >
                                        {
                                            member.user.name
                                        }
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                id="date-picker-simple"
                                className="w-full justify-start font-normal"
                            >
                                {date ? format(date, "PPP") : <span>Pick a due date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                    setDate(selectedDate);
                                    setValue(
                                        "dueDate",
                                        selectedDate
                                            ? selectedDate.toISOString()
                                            : undefined
                                    );
                                }}
                                defaultMonth={date}
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={
                                updateMutation.isPending
                            }
                        >
                            {updateMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            disabled={
                                deleteMutation.isPending
                            }
                            onClick={() =>
                                deleteMutation.mutate()
                            }
                        >
                            Delete
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTaskDialog;