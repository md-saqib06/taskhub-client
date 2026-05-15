import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { logout } from "@/api/auth";

import { useAuth } from "@/features/auth/useAuth";

import { toast } from "sonner";

import {
    useQueryClient,
} from "@tanstack/react-query";

const Navbar = () => {
    const navigate = useNavigate();

    const queryClient =
        useQueryClient();

    const { user } = useAuth();

    const handleLogout =
        async () => {
            try {
                await logout();

                queryClient.clear();

                toast.success(
                    "Logged out"
                );

                navigate("/login");
            } catch (error) {
                console.error({ error })
                toast.error(
                    "Logout failed"
                );
            }
        };

    return (
        <header className="border-b border-border/60 bg-background/80 backdrop-blur">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    to="/"
                    className="font-bold text-lg"
                >
                    TaskHub
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage
                                src={user?.avatarUrl}
                            />

                            <AvatarFallback>
                                {user?.name?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="hidden sm:block">
                            <p className="text-sm font-medium">
                                {user?.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                @
                                {user?.username}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={
                            handleLogout
                        }
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;