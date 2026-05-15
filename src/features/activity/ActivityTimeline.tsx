import { useQuery } from "@tanstack/react-query";

import { getProjectActivities } from "@/api/activity";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

const ActivityTimeline = ({
    projectId,
}: {
    projectId: string;
}) => {
    const { data, isLoading } =
        useQuery({
            queryKey: [
                "activities",
                projectId,
            ],

            queryFn: () =>
                getProjectActivities(
                    projectId
                ),
        });

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    Loading activity...
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Recent Activity
                </CardTitle>
            </CardHeader>

            <CardContent>
                {!data?.length ? (
                    <div className="text-sm text-muted-foreground">
                        No activity yet
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map(
                            (activity: {
                                id: string;
                                message: string;
                                createdAt: string;
                                user: {
                                    avatarUrl: string;
                                    name: string;
                                };
                            }) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={
                                                activity.user
                                                    .avatarUrl
                                            }
                                        />

                                        <AvatarFallback>
                                            {
                                                activity.user
                                                    .name[0]
                                            }
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <p className="text-sm">
                                            {
                                                activity.message
                                            }
                                        </p>

                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(
                                                activity.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ActivityTimeline;