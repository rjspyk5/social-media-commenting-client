"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface LoginFormValues {
    email: string;
    password: string;
}

export const Login = () => {
    const { register, handleSubmit, formState } = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = formState;

    const onSubmit = (data: LoginFormValues) => {
        console.log("Form submitted:", data);

    };

    return (
        <Card className="w-full max-w-md !p-10 border-0 shadow-2xl">
            <CardHeader className="mb-6">
                <CardTitle className="text-3xl text-center">
                    Login to your account
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your Email and password to continue
                </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

                    <Input
                        type="text"
                        placeholder="Enter Email"
                        {...register("email")}
                    />

                    <Input
                        type="password"
                        placeholder="****"
                        {...register("password")}
                    />

                    <Button size="lg" type="submit" className="w-full">
                        {isSubmitting ? "Loading..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
