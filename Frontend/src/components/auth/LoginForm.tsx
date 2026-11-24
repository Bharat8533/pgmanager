"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Alert } from "@/components/ui/Alert";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, X } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g. owner@pgmaster.in)"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setDemoSuccess(null);

    // Simulate authentication API latency
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsLoading(false);
    setDemoSuccess(data.email);
  };

  const handleUseDemoAccount = () => {
    setValue("email", "owner@pgmaster.in", { shouldValidate: true });
    setValue("password", "Pass@1234", { shouldValidate: true });
    setValue("rememberMe", true);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPasswordEmail && forgotPasswordEmail.includes("@")) {
      setForgotPasswordSuccess(true);
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
          Welcome back
        </h2>
        <p className="text-sm text-brand-muted mt-1.5 leading-relaxed">
          Sign in to manage your PG properties, rooms, and residents.
        </p>

        {/* Demo Account Quick-Fill Pill */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleUseDemoAccount}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-offwhite text-brand-charcoal border border-brand-border hover:border-brand-charcoal/40 hover:bg-[#EBEEE8] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-charcoal" />
            <span>Fill Demo PG Owner Account</span>
          </button>
        </div>
      </div>

      {/* Demo Success Message */}
      {demoSuccess && (
        <div className="mb-6 animate-fadeIn">
          <Alert
            variant="success"
            title="Demo Sign In Successful"
            description={
              <div className="space-y-1">
                <p>
                  Authenticated as <strong className="font-semibold">{demoSuccess}</strong>.
                </p>
                <p className="text-[11px] text-emerald-800">
                  Phase 1 Preview Mode: Real backend authentication and database connections will be integrated in future phases.
                </p>
              </div>
            }
            onClose={() => setDemoSuccess(null)}
          />
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="owner@business.com"
          leftAddon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••••••"
            leftAddon={<Lock className="w-4 h-4" />}
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-brand-muted hover:text-brand-charcoal transition-colors focus:outline-none p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox
            label="Remember me for 30 days"
            {...register("rememberMe")}
          />

          <button
            type="button"
            onClick={() => {
              setForgotPasswordOpen(true);
              setForgotPasswordSuccess(false);
              setForgotPasswordEmail("");
            }}
            className="text-xs font-semibold text-brand-charcoal hover:underline hover:text-black focus:outline-none"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            loadingText="Verifying credentials..."
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to PGMaster
          </Button>
        </div>
      </form>

      {/* Link to Sign Up */}
      <div className="mt-8 pt-6 border-t border-brand-border text-center">
        <p className="text-xs text-brand-muted">
          Don&apos;t have a PGMaster account yet?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-charcoal hover:underline underline-offset-4"
          >
            Create your account
          </Link>
        </p>
      </div>

      {/* Legal & Compliance Footer */}
      <div className="mt-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-3 text-[11px] text-brand-muted">
          <button
            type="button"
            onClick={() => alert("Terms of Service: PGMaster PG Cloud SaaS terms apply.")}
            className="hover:text-brand-charcoal transition-colors"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => alert("Privacy Policy: Your tenant and property data is protected under Indian DPDP Act standards.")}
            className="hover:text-brand-charcoal transition-colors"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => alert("Helpdesk: Reach us at support@pgmaster.in")}
            className="hover:text-brand-charcoal transition-colors"
          >
            Support
          </button>
        </div>
        <p className="text-[10px] text-brand-muted/70">
          © 2026 PGMaster Technologies Inc. All rights reserved.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl border border-brand-border p-6 shadow-xl relative animate-scaleUp">
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(false)}
              className="absolute top-5 right-5 text-brand-muted hover:text-brand-charcoal p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-brand-charcoal">
                Reset your password
              </h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Enter your registered PG Owner email address to receive password reset instructions.
              </p>
            </div>

            {forgotPasswordSuccess ? (
              <div className="space-y-4">
                <Alert
                  variant="success"
                  title="Reset instructions sent"
                  description={`We sent a secure password reset link to ${forgotPasswordEmail}. Please check your inbox or spam folder.`}
                />
                <Button
                  variant="obsidian"
                  fullWidth
                  onClick={() => setForgotPasswordOpen(false)}
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <Input
                  label="Registered Email"
                  type="email"
                  required
                  placeholder="owner@pgmaster.in"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  leftAddon={<Mail className="w-4 h-4" />}
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setForgotPasswordOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
