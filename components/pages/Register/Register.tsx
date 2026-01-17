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
import { createUser } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RegistrationFormValues {
  name: string;
  email: string;
  password: string;
}

export const Registration = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    const result = await createUser(data);

    if (result.success) {
      toast.success("Account created successfully 🎉", {
        description: "Redirecting you to login...",
      });

      reset();

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      toast.error("Registration failed ❌", {
        description: result.message || "Something went wrong",
      });
    }
  };

  return (
    <Card className="w-full max-w-md !p-10 border-0 shadow-2xl">
      <CardHeader className="mb-6">
        <CardTitle className="text-3xl text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details to register
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Enter Name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
