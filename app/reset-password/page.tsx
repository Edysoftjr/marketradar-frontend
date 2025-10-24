import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - MarketRadar",
  description: "Reset your MarketRadar account password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const token = resolvedSearchParams?.token;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center"
      >
        <Image
          src="/foodrlogo.png"
          alt="MarketRadar Logo"
          width={32}
          height={32}
          className="mr-2 rounded-full"
        />
        <span className="font-bold">MarketRadar</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password
          </p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
