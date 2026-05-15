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

import {
    searchUsers,
    addProjectMember,
} from "@/api/projects";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

const InviteMemberDialog = ({
    projectId,
}: {
    projectId: string;
}) => {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const usersQuery = useQuery({
        queryKey: [
            "user-search",
            search,
        ],

        queryFn: () =>
            searchUsers(search),

        enabled: !!search,
    });

    const mutation = useMutation({
        mutationFn: (
            userId: string
        ) =>
            addProjectMember(
                projectId,
                userId
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "members",
                    projectId,
                ],
            });

            toast.success(
                "Member added"
            );

            setOpen(false);
            setSearch("");
        },

        onError: () => {
            toast.error(
                "Failed to add member"
            );
        },
    });

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button className="cursor-pointer">
                    Invite Member
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Invite Member
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Search username"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <div className="space-y-2">
                        {usersQuery.data?.map(
                            (user: {
                                id: string;
                                name: string;
                                username: string
                            }) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between border rounded-lg p-3"
                                >
                                    <div>
                                        <p>
                                            {user.name}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            @
                                            {
                                                user.username
                                            }
                                        </p>
                                    </div>

                                    <Button
                                        size="sm"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            mutation.mutate(
                                                user.id
                                            )
                                        }
                                    >
                                        Add
                                    </Button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteMemberDialog;