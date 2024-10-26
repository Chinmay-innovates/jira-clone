"use client";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpWithGithub } from "@/lib/oauth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { type LoginSchema, loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";

export const SignInCard = () => {
  const { mutate, isPending } = useLogin();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginSchema) => {
    mutate({ json: values });
  };

  return (
    <Card className="size-full md:w-[487px] relative overflow-hidden 
      before:absolute before:w-[200%] before:h-[200%] before:-top-1/2 before:-left-1/2 
      before:animate-spin-slow before:bg-gradient-to-r before:from-purple-600/20 
      before:via-blue-600/20 before:to-pink-600/20 
      border-0 bg-gradient-to-br from-gray-900/95 via-gray-900/95 to-black/95 
      backdrop-blur-xl shadow-2xl shadow-purple-900/20
      hover:shadow-blue-900/30 hover:scale-[1.01] transform-gpu
      transition-all duration-700 ease-out">
      
      <div className="absolute inset-[1px] bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-lg z-10">
        <CardHeader className="flex items-center justify-center text-center p-8">
          <CardTitle className="text-6xl font-black tracking-tight
            bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
            text-transparent bg-clip-text 
            animate-text-shimmer hover:from-purple-600 hover:via-pink-600 hover:to-blue-500
            transition-all duration-700">
            Welcome Back!{" "} 👋🏻
          </CardTitle>
        </CardHeader>

        <div className="px-8">
          <DottedSeparator />
        </div>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6 animate-fade-up">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter email address"
                        className="h-12 px-4 bg-gray-900/50 backdrop-blur-sm
                          border-2 border-gray-800/50 
                          text-gray-100 placeholder-gray-400
                          rounded-lg shadow-inner shadow-black/20
                          focus:border-blue-500/50 focus:bg-gray-900/80
                          focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0
                          hover:border-gray-700/50 hover:bg-gray-900/70
                          transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter password"
                        className="h-12 px-4 bg-gray-900/50 backdrop-blur-sm
                          border-2 border-gray-800/50 
                          text-gray-100 placeholder-gray-400
                          rounded-lg shadow-inner shadow-black/20
                          focus:border-blue-500/50 focus:bg-gray-900/80
                          focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0
                          hover:border-gray-700/50 hover:bg-gray-900/70
                          transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full h-12 relative overflow-hidden
                  bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                  hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
                  text-white font-semibold tracking-wide
                  shadow-lg shadow-purple-900/30
                  hover:shadow-blue-900/40 hover:scale-[1.02]
                  before:absolute before:inset-0
                  before:bg-gradient-to-r before:from-transparent 
                  before:via-white/20 before:to-transparent
                  before:translate-x-[-200%] hover:before:translate-x-[200%]
                  before:transition-transform before:duration-700
                  transform-gpu transition-all duration-300"
                size="lg"
                disabled={isPending}
              >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>

        <div className="px-8">
          <DottedSeparator />
        </div>

        <CardContent className="p-8 flex flex-col gap-y-4">
          <Button
            onClick={() => signUpWithGithub()}
            disabled={isPending}
            variant="secondary"
            size="lg"
            className="w-full h-12 relative
              bg-gray-800/50 backdrop-blur-sm
              border-2 border-gray-700/30
              hover:border-blue-500/50 hover:bg-gray-800/80
              text-gray-100 font-medium
              shadow-lg shadow-black/20
              hover:shadow-blue-900/20 hover:scale-[1.02]
              transform-gpu transition-all duration-300
              flex items-center justify-center gap-3"
          >
            <FaGithub className="size-5 opacity-90" />
            Login with Github
          </Button>
        </CardContent>

        <div className="px-8">
          <DottedSeparator />
        </div>

        <CardContent className="p-8 flex items-center justify-center">
          <p className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300">
            Don&apos;t have an account?
            <Link href="/sign-up">
              <span className="inline-block ml-1.5 font-medium
                bg-gradient-to-r from-blue-400 to-emerald-400 
                text-transparent bg-clip-text
                hover:from-blue-300 hover:to-emerald-300
                cursor-pointer hover:underline
                transition-all duration-300">
                Sign Up
              </span>
            </Link>
          </p>
        </CardContent>
      </div>
    </Card>
  );
};

export default SignInCard;
