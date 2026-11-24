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
import { Eye, EyeOff, User, Building, Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

// Indian mobile regex: 10 digits starting with 6, 7, 8, or 9
const indianMobileRegex = /^[6-9]\d{9}$/;

const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters"),
    businessName: z
      .string()
      .min(1, "PG or Business name is required")
      .min(3, "Business name must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),
    mobileNumber: z
      .string()
      .min(1, "Mobile number is required")
      .regex(indianMobileRegex, "Enter a valid 10-digit Indian mobile number (e.g. 9812345678)"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service & Privacy Policy to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState<SignUpFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const watchedPassword = watch("password");

  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(watchedPassword || "");

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setDemoSuccess(null);

    // Simulate account creation latency
    await new Promise((resolve) => setTimeout(resolve, 1400));

    setIsLoading(false);
    setDemoSuccess(data);
  };

  const handleUseDemoDetails = () => {
    setValue("fullName", "Vikramaditya Rao", { shouldValidate: true });
    setValue("businessName", "Urban Living PG & Hostels", { shouldValidate: true });
    setValue("email", "vikram@urbanliving.in", { shouldValidate: true });
    setValue("mobileNumber", "9818012345", { shouldValidate: true });
    setValue("password", "Pass@12345", { shouldValidate: true });
    setValue("confirmPassword", "Pass@12345", { shouldValidate: true });
    setValue("acceptTerms", true, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
          Create your account
        </h2>
        <p className="text-sm text-brand-muted mt-1.5 leading-relaxed">
          Get started with smarter PG management across your properties.
        </p>
      </div>

      {/* Demo Success Message */}
      {demoSuccess && (
        <div className="mb-6 animate-fadeIn">
          <Alert
            variant="success"
            title="Account Registration Simulated Successfully"
            description={
              <div className="space-y-1.5">
                <p>
                  Welcome, <strong>{demoSuccess.fullName}</strong>! Registered for{" "}
                  <strong>{demoSuccess.businessName}</strong>.
                </p>
                <div className="text-[11px] bg-white/70 p-2 rounded border border-[#C7E5BE] space-y-0.5 text-brand-charcoal">
                  <p>• Mobile: +91 {demoSuccess.mobileNumber}</p>
                  <p>• Email: {demoSuccess.email}</p>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Phase 1 Demo Mode: No database records were saved. In Phase 2, this will link to our Node.js & Neon PostgreSQL backend.
                </p>
              </div>
            }
            onClose={() => setDemoSuccess(null)}
          />
        </div>
      )}

      {/* Main Sign Up Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name & Business Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Ramesh Kumar"
            leftAddon={<User className="w-4 h-4" />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            label="Business / PG Name"
            required
            placeholder="e.g. Royal PG Stays"
            leftAddon={<Building className="w-4 h-4" />}
            error={errors.businessName?.message}
            {...register("businessName")}
          />
        </div>

        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="owner@yourpg.com"
          leftAddon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Mobile Number with India +91 prefix and generous spacing */}
        <Input
          label="Mobile Number"
          type="tel"
          required
          placeholder="98765 43210"
          leftPaddingClass="pl-[82px]"
          leftAddon={
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal pr-3 border-r border-brand-border h-5 select-none">
              <span className="text-sm leading-none" role="img" aria-label="India flag">
                🇮🇳
              </span>
              <span className="tracking-tight text-brand-charcoal">+91</span>
            </div>
          }
          error={errors.mobileNumber?.message}
          {...register("mobileNumber")}
        />

        {/* Password & Confirm Password Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Min. 8 chars"
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

          <div>
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Re-enter password"
              leftAddon={<Lock className="w-4 h-4" />}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-brand-muted hover:text-brand-charcoal transition-colors focus:outline-none p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>
        </div>

        {/* Password Strength Indicator */}
        {watchedPassword && watchedPassword.length > 0 && (
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-brand-muted">Password strength:</span>
              <span className="font-semibold text-brand-charcoal">
                {passwordScore <= 1 && "Weak"}
                {passwordScore === 2 && "Fair"}
                {passwordScore === 3 && "Good"}
                {passwordScore >= 4 && "Strong"}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1.5">
              <div
                className={`rounded-full transition-colors ${
                  passwordScore >= 1 ? "bg-amber-400" : "bg-brand-border"
                }`}
              />
              <div
                className={`rounded-full transition-colors ${
                  passwordScore >= 2 ? "bg-amber-500" : "bg-brand-border"
                }`}
              />
              <div
                className={`rounded-full transition-colors ${
                  passwordScore >= 3 ? "bg-brand-lime" : "bg-brand-border"
                }`}
              />
              <div
                className={`rounded-full transition-colors ${
                  passwordScore >= 4 ? "bg-emerald-600" : "bg-brand-border"
                }`}
              />
            </div>
          </div>
        )}

        {/* Terms and Conditions Acceptance */}
        <div className="pt-2">
          <Checkbox
            label={
              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Terms of Service: PGMaster SaaS platform policies.");
                  }}
                  className="font-semibold underline underline-offset-2 hover:text-black"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Privacy Policy: We comply with Indian Data Protection standards.");
                  }}
                  className="font-semibold underline underline-offset-2 hover:text-black"
                >
                  Privacy Policy
                </button>
              </span>
            }
            error={errors.acceptTerms?.message}
            {...register("acceptTerms")}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            loadingText="Setting up your account..."
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create PG Owner Account
          </Button>
        </div>
      </form>

      {/* Link to Sign In */}
      <div className="mt-6 pt-5 border-t border-brand-border text-center">
        <p className="text-xs text-brand-muted">
          Already managing properties on PGMaster?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-charcoal hover:underline underline-offset-4"
          >
            Sign In here
          </Link>
        </p>
      </div>

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-brand-muted">
        <CheckCircle2 className="w-3.5 h-3.5 text-brand-charcoal" />
        <span>Enterprise 256-bit encryption for all resident and financial data</span>
      </div>
    </div>
  );
}
