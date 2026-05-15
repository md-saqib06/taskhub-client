import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    signupSchema,
    type SignupInput,
} from "@/features/auth/validation";

import { signup } from "@/api/auth";

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

const SignupPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (
        data: SignupInput
    ) => {
        try {
            await signup(data);

            toast.success("Account created");

            navigate("/");
        } catch (error) {
            console.error({ error });
            toast.error("Signup failed");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-border/60 shadow-xl">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl">
                        Create account
                    </CardTitle>

                    <CardDescription>
                        Start collaborating with your team
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Input
                            placeholder="Name"
                            {...register("name")}
                        />

                        <Input
                            placeholder="Username"
                            {...register("username")}
                        />

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
                                ? "Creating account..."
                                : "Signup"}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignupPage;