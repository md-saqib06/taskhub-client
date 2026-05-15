import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    loginSchema,
    type LoginInput,
} from "@/features/auth/validation";

import { login } from "@/api/auth";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

const LoginPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (
        data: LoginInput
    ) => {
        try {
            await login(data);

            toast.success("Logged in successfully");

            navigate("/");
        } catch (error) {
            console.error({ error });
            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-border/60 shadow-xl">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl">
                        Welcome back
                    </CardTitle>

                    <CardDescription>
                        Login to continue to TaskHub
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Input
                            placeholder="Email"
                            {...register("email")}
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                        />

                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Logging in..."
                                : "Login"}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-primary hover:underline"
                            >
                                Signup
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;