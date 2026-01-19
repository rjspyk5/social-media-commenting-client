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
import { login } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormValues {
  email: string;
  password: string;
}

export const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data);

    if (result.success) {
      toast.success("Login successful 🎉", {
        description: "Redirecting...",
      });

      setTimeout(() => {
        router.push("/");
      }, 800);
    } else {
      toast.error("Login failed ❌", {
        description: result.message,
      });
    }
  };

  return (
    <Card className="w-full max-w-md p-10! border-0 shadow-2xl">
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
          {/* Email */}
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              placeholder="Enter Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <Input
              type="password"
              placeholder="****"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
  Don’t have an account?{" "}
  <Link
    href="/reg"
    className="font-medium text-primary hover:underline"
  >
    Register
  </Link>
</p>
        </form>
      </CardContent>
    </Card>
  );
};
