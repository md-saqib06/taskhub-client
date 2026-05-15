import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/api/projects";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

const DashboardPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: getProjects,
    });
    console.log({ data })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="text-muted-foreground mt-2">
                        Manage your collaborative projects
                    </p>
                </div>

                {!data?.length ? (
                    <Card className="border-dashed">
                        <CardContent className="py-16 flex flex-col items-center justify-center">
                            <h2 className="text-xl font-semibold">
                                No projects yet
                            </h2>

                            <p className="text-muted-foreground mt-2">
                                Create your first project to get started
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.map((project: { id: string, name: string, description: string, role: string }) => (
                            <Card
                                key={project.id}
                                className="hover:border-primary/40 transition-colors cursor-pointer"
                            >
                                <CardHeader>
                                    <CardTitle>
                                        {project.name}
                                    </CardTitle>

                                    <CardDescription>
                                        {project.description ||
                                            "No description"}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Role: {project.role}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;