import { getProjectTasks } from "@/api/tasks";

import CreateTaskDialog from "@/features/tasks/CreateTaskDialog";
import TaskCard from "@/features/tasks/TaskCard";
import InviteMemberDialog from "@/features/projects/InviteMemberDialog";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    getProject,
    getProjectMembers,
} from "@/api/projects";

const ProjectPage = () => {
    const { id } = useParams();

    const projectQuery = useQuery({
        queryKey: ["project", id],
        queryFn: () => getProject(id!),
    });

    const membersQuery = useQuery({
        queryKey: ["members", id],
        queryFn: () => getProjectMembers(id!),
    });

    const tasksQuery = useQuery({
        queryKey: ["tasks", id],
        queryFn: () => getProjectTasks(id!),
    });

    if (
        projectQuery.isLoading ||
        membersQuery.isLoading ||
        tasksQuery.isLoading
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading project...
            </div>
        );
    }

    const project =
        projectQuery.data;

    const members =
        membersQuery.data || [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-start justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold">
                            {project.name}
                        </h1>

                        <p className="text-muted-foreground mt-2">
                            {project.description}
                        </p>
                    </div>

                    <InviteMemberDialog
                        projectId={id!}
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Members
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        {members.map(
                            (member: {
                                id: string;
                                user: {
                                    name: string;
                                    username: string
                                }
                            }) => (
                                <div
                                    key={member.id}
                                    className="border rounded-lg p-4"
                                >
                                    <p>
                                        {
                                            member.user.name
                                        }
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        @
                                        {
                                            member.user
                                                .username
                                        }
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Tasks
                            </h2>

                            <p className="text-muted-foreground mt-1">
                                Project task management
                            </p>
                        </div>

                        <CreateTaskDialog
                            projectId={id!}
                        />
                    </div>

                    {!tasksQuery.data?.length ? (
                        <div className="border border-dashed rounded-xl p-12 text-center">
                            <h3 className="font-semibold">
                                No tasks yet
                            </h3>

                            <p className="text-muted-foreground mt-2">
                                Create your first task
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {tasksQuery.data.map(
                                (task: {
                                    id: string;
                                    title: string;
                                    description?: string;
                                    priority: string;
                                    dueDate?: string;
                                    assignedUser?: {
                                        name: string;
                                        avatarUrl?: string;
                                    };
                                }) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;