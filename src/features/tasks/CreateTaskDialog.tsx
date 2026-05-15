import { useState } from "react";

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createTaskSchema,
    type CreateTaskInput,
} from "./validation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";

import { createTask } from "@/api/tasks";
import { getProjectMembers } from "@/api/projects";


const CreateTaskDialog = ({
    projectId,
}: {
    projectId: string;
}) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>()

    const queryClient = useQueryClient();

    const membersQuery = useQuery({
        queryKey: [
            "members",
            projectId,
        ],

        queryFn: () =>
            getProjectMembers(projectId),
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
            priority: "MEDIUM",
        },
    });

    const mutation = useMutation({
        mutationFn: (
            data: CreateTaskInput
        ) =>
            createTask({
                ...data,
                projectId,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "tasks",
                    projectId,
                ],
            });

            toast.success(
                "Task created"
            );

            reset();
            setOpen(false);
            setDate(undefined);
        },

        onError: () => {
            toast.error(
                "Failed to create task"
            );
        },
    });

    const onSubmit = (
        data: CreateTaskInput
    ) => {
        mutation.mutate(data);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button className="cursor-pointer">
                    Create Task
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Task
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
                        defaultValue="MEDIUM"
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
                        <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="LOW">
                                Low
                            </SelectItem>

                            <SelectItem className="cursor-pointer" value="MEDIUM">
                                Medium
                            </SelectItem>

                            <SelectItem className="cursor-pointer" value="HIGH">
                                High
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(
                            value
                        ) =>
                            setValue(
                                "assignedUserId",
                                value
                            )
                        }
                    >
                        <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Assign member" />
                        </SelectTrigger>

                        <SelectContent>
                            {membersQuery.data?.map(
                                (
                                    member: {
                                        user: {
                                            id: string;
                                            name: string;
                                        }
                                    }
                                ) => (
                                    <SelectItem
                                        className="cursor-pointer"
                                        key={
                                            member.user.id
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

                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={
                            mutation.isPending
                        }
                    >
                        {mutation.isPending
                            ? "Creating..."
                            : "Create Task"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTaskDialog;