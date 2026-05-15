import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const ProjectCard = ({
    project,
}: {
    project: { name: string, description: string, role: string }
}) => {
    return (
        <Card className="hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>
                            {project.name}
                        </CardTitle>

                        <CardDescription className="mt-2">
                            {project.description ||
                                "No description"}
                        </CardDescription>
                    </div>

                    <Badge variant="secondary">
                        {project.role}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Collaborative project workspace
                </p>
            </CardContent>
        </Card>
    );
};

export default ProjectCard;