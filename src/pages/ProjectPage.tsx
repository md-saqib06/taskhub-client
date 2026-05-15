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
        queryFn: () =>
            getProjectMembers(id!),
    });

    if (
        projectQuery.isLoading ||
        membersQuery.isLoading
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
                            (member: { id: string; user: { name: string; username: string } }) => (
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
            </div>
        </div>
    );
};

export default ProjectPage;