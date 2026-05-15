import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/projects";

import CreateProjectDialog from "@/features/projects/CreateProjectDialog";
import ProjectCard from "@/features/projects/ProjectCard";

interface Project {
    id: string;
    name: string;
    description: string;
    role: string;
}

const DashboardPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: getProjects,
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            Dashboard
                        </h1>

                        <p className="text-muted-foreground mt-2">
                            Manage collaborative projects
                        </p>
                    </div>

                    <CreateProjectDialog />
                </div>

                {isLoading ? (
                    <div>
                        Loading projects...
                    </div>
                ) : !data?.length ? (
                    <div className="border border-dashed rounded-xl p-16 text-center">
                        <h2 className="text-xl font-semibold">
                            No projects yet
                        </h2>

                        <p className="text-muted-foreground mt-2">
                            Create your first project
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.map((project: Project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;