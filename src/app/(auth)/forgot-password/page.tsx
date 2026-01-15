import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckEmailResetPasswordForm } from "./components/check-email-reset-password-form";

export default async function Page() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          Recuperação de Senha
        </CardTitle>
        <CardDescription>
          Informe seu e-mail abaixo para efetuar a recuperação da senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CheckEmailResetPasswordForm />
      </CardContent>
    </Card>
  );
}
