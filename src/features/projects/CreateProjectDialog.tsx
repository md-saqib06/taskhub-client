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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    createProjectSchema,
    type CreateProjectInput,
} from "./validation";
import { createProject } from "@/api/projects";
import { useState } from "react";


const CreateProjectDialog = () => {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<CreateProjectInput>({
        resolver: zodResolver(
            createProjectSchema
        ),
    });

    const mutation = useMutation({
        mutationFn: createProject,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });

            toast.success(
                "Project created"
            );

            reset();
            setOpen(false);
        },

        onError: () => {
            toast.error(
                "Failed to create project"
            );
        },
    });

    const onSubmit = (
        data: CreateProjectInput
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
                    Create Project
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Project
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Input
                        placeholder="Project name"
                        {...register("name")}
                    />

                    <Textarea
                        placeholder="Description"
                        {...register(
                            "description"
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={
                            mutation.isPending
                        }
                    >
                        {mutation.isPending
                            ? "Creating..."
                            : "Create"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectDialog;