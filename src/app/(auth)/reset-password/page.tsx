"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "./components/reset-password-form";
import { useSearchParams } from "next/navigation";
import { useCheckIfTokenIsValid } from "@/hooks/use-forgot-password";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const { mutateAsync: checkIfTokenIsValidAsync } = useCheckIfTokenIsValid();
  const token = searchParams.get("token");

  useEffect(() => {
    async function check() {
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
