"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useCheckIfTokenIsValid } from "@/hooks/use-forgot-password";
import { useEffect } from "react";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPageClient() {
  const searchParams = useSearchParams();
  const { mutateAsync: checkIfTokenIsValidAsync } = useCheckIfTokenIsValid();
  const token = searchParams.get("token");

  useEffect(() => {
    async function check() {
      if (!token) return;
      await checkIfTokenIsValidAsync({ token: token as never });
    }
    check();
  }, [checkIfTokenIsValidAsync, token]);

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          Recuperação de Senha
        </CardTitle>
        <CardDescription>Informe sua nova senha abaixo</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
