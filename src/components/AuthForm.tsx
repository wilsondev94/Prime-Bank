"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ReusableInput from "./ReusableInput";
import { authFormSchema } from "@/lib/schamas";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/userActions";

export default function AuthForm({ type }: { type: string }) {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof authSchema>) {
    try {
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const res = await signIn({
          email: data.email,
          password: data.password,
        });
        if (res) router.push("/");
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={36}
            height={36}
            alt="Prime logo"
          />
          <h1 className="text-26 font-inter font-bold text-black-3">Prime</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-bold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}

            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div>Plaid Card</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <ReusableInput
                      control={form.control}
                      name="firstName"
                      label="First name"
                      placeholder="Enter your first name"
                    />
                    <ReusableInput
                      control={form.control}
                      name="lastName"
                      label="Last name"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <ReusableInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your address"
                  />
                  <ReusableInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <ReusableInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Enter your state"
                    />

                    <ReusableInput
                      control={form.control}
                      name="postalCode"
                      label="Posatal Code"
                      placeholder="E.g 00331"
                    />
                  </div>
                  <div className="flex gap-4">
                    <ReusableInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="DD-MM-YYYY"
                    />
                    <ReusableInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="1234"
                    />
                  </div>
                </>
              )}

              <>
                <ReusableInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email address"
                />
                <ReusableInput
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              </>
              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn("form-btn", isLoading && "cursor-not-allowed")}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="anitmate-spine" />
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p>
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
}
